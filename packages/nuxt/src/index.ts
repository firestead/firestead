import { clearDir } from './utils/fs'
import { writeTypes } from './utils/prepare'
import { getRuntimeConfig } from './utils/config'
import { importModule } from './utils/cjs'
import { debounce } from 'perfect-debounce'
import { withTrailingSlash } from 'ufo'
import { relative, normalize } from 'pathe'
import chokidar from 'chokidar'
import { loadNuxt, buildNuxt } from '@nuxt/kit'
import { addFrameworkConfig } from '@firestead/kit'

import type { HostingTarget, NuxtConfig } from '@firestead/schema'

interface NuxtServer {
  reload: Function
}

export const createServer =  async function(targetKey: string ,target : HostingTarget): Promise<NuxtServer>  {

    const { listen } = await import('listhen')

    let currentHandler
    let loadingMessage = 'Nuxt is starting...'
    const loadingHandler = async (_req, res) => {
      const { loading: loadingTemplate } = await importModule('@nuxt/ui-templates')
      res.setHeader('Content-Type', 'text/html; charset=UTF-8')
      res.statusCode = 503 // Service Unavailable
      res.end(loadingTemplate({ loading: loadingMessage }))
    }
    const serverHandler = (req, res) => {
      return currentHandler ? currentHandler(req, res) : loadingHandler(req, res)
    }

    //create server
    const listener = await listen(serverHandler,{
      port: target.server.port,
      hostname: target.server.hostname
    })

    let currentNuxt = null

    const load = async (isRestart: Boolean, reason?: string) => {
      try {
        loadingMessage = `${reason ? reason + '. ' : ''}${isRestart ? 'Restarting' : 'Starting'} nuxt...`
        currentHandler = null
        if (isRestart) {
          console.info(loadingMessage)
        }
        if (currentNuxt) {
          await currentNuxt.close()
        }
        currentNuxt = await loadNuxt({ rootDir: target.rootDir, dev: true, ready: false })

        /*
        * set framework config
        * all details of framework should be passed to context
        */
        const frameworkConfig: NuxtConfig = {
            version: currentNuxt.options.version,
            modules: currentNuxt.options.modules,
            ssr: currentNuxt.options.ssr,
            mode: currentNuxt.options.mode,
            target: currentNuxt.options.target
        }
        addFrameworkConfig(targetKey, frameworkConfig)
        /**
        *   add firestead's current env variables to nuxt config
        *
       /*
        const envVariables = options.environments.envs[options.environments.current].envVariables
        currentNuxt.options.privateRuntimeConfig = {
          ...currentNuxt.options.privateRuntimeConfig,
          ...getRuntimeConfig('private', envVariables)
        }
        currentNuxt.options.publicRuntimeConfig = {
          ...currentNuxt.options.publicRuntimeConfig,
          ...getRuntimeConfig('public', envVariables)
        }
*/
        await currentNuxt.ready()
        await currentNuxt.hooks.callHook('listen', listener.server, listener)
        await Promise.all([
          writeTypes(currentNuxt).catch(console.error),
          buildNuxt(currentNuxt)
        ])
        currentHandler = currentNuxt.server.app
        if (isRestart !== false) {
          console.log(`Nuxt3 v${currentNuxt._version}`)
          listener.showURL()
        }
      } catch (err) {
        console.error(`Cannot ${isRestart ? 'restart' : 'start'} nuxt: `, err)
        currentHandler = null
        loadingMessage = 'Error while loading nuxt. Please check console and fix errors.'
      }
    }

    // Watch for config changes
    // TODO: Watcher service, modules, and requireTree
    const dLoad = debounce(load)

    const watcher = chokidar.watch([target.rootDir], { ignoreInitial: true, depth: 1 })
    watcher.on('all', (event, file) => {
      if (!currentNuxt) { return }
      if (normalize(file).startsWith(withTrailingSlash(normalize(currentNuxt.options.buildDir)))) { return }
      if (file.match(/(nuxt\.config\.(js|ts|mjs|cjs)|\.nuxtignore|\.env|\.nuxtrc)$/)) {
        dLoad(true, `${relative(target.rootDir, file)} updated`)
      }

      const isDirChange = ['addDir', 'unlinkDir'].includes(event)
      const isFileChange = ['add', 'unlink'].includes(event)
      const reloadDirs = [currentNuxt.options.dir.pages, 'components', 'composables']

      if (isDirChange) {
        const dir = reloadDirs.find(dir => file.endsWith(dir))
        if (dir) {
          dLoad(true, `Directory \`${dir}/\` ${event === 'addDir' ? 'created' : 'removed'}`)
        }
      } else if (isFileChange) {
        if (file.match(/(app|error)\.(js|ts|mjs|jsx|tsx|vue)$/)) {
          dLoad(true, `\`${relative(target.rootDir, file)}\` ${event === 'add' ? 'created' : 'removed'}`)
        }
      }
    })

    await load(false)

    //set framework ready hook
    //hooks.callHook('framework:ready', currentNuxt.server)

    const reload = () => {
      dLoad(true, 'Manual triggered reload')
    }
    
    return {
      reload
    }
}

export const build = async (args, { rootPath, buildConfig, environments, hosting }) => {

  const frameworkConfig = hosting.targets[hosting.current]

  process.env.NITRO_PRESET = 'node'
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  const nuxt = await loadNuxt({ 
    rootDir: frameworkConfig.path,
    ready: false, 
    overrides: {
      _generate: args.prerender
    }
  })
  // set firestead config in nuxt context
  nuxt.options['firestead'] = {
    config: environments.envs[environments.current].config
  }
  const envVariables = environments.envs[environments.current].envVariables

  //add firestead runtime config to nuxt config
  //TODO:
  /*
  * export default {
  *  runtimeConfig: {
  *     apiKey: '' // Default to an empty string, automatically loaded at runtime using process.env.NUXT_API_SECRET
  *     public: {
  *        baseURL: '' // Exposed to the frontend as well.
  *     }
  *   }
  * }
  * */
  nuxt.options.privateRuntimeConfig = {
    ...nuxt.options.privateRuntimeConfig,
    ...getRuntimeConfig('private', envVariables)
  }
  nuxt.options.publicRuntimeConfig = {
    ...nuxt.options.publicRuntimeConfig,
    ...getRuntimeConfig('public', envVariables)
  }

  //nitro context -> add firestead output dir
  nuxt.hooks.hook('nitro:init',(nitroContext)=>{
    nitroContext.options.output.dir = `${rootPath}/${buildConfig.dir}/build/functions/framework`
    nitroContext.options.output.serverDir = `${rootPath}/${buildConfig.dir}/build/functions/framework/server`
    nitroContext.options.output.publicDir = `${rootPath}/${buildConfig.dir}/build/functions/framework/public`
  })

  //add firestead nuxt module
  nuxt.hooks.hook('modules:before',({nuxt})=>{
    if(nuxt.options.modules.indexOf('@firestead/nuxt/module') === -1){
      nuxt.options.modules.push('@firestead/nuxt/module')
    }
  })

  await nuxt.ready()
  /*
  extendViteConfig((config)=>{
    if(!config.ssr){
      config.ssr = {
        external: []
      }
    }
    if(!config.ssr.external) config.ssr.external = []
    config.ssr.external.push('firebase-admin')
  })
  */
  // clean .nuxt build dir
  await clearDir(nuxt.options.buildDir)
  await writeTypes(nuxt)

  nuxt.hook('build:error', (err) => {
    console.error('Nuxt Build Error:', err)
    process.exit(1)
  })
  
  await buildNuxt(nuxt)
}