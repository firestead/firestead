import { clearDir } from './utils/fs'
import { writeTypes } from './utils/prepare'
import { getRuntimeConfig } from './utils/config'
import { importModule } from './utils/cjs'
import { debounce } from 'perfect-debounce'
import { withTrailingSlash } from 'ufo'
import { relative, normalize } from 'pathe'
import chokidar from 'chokidar'
import { loadNuxt, buildNuxt, extendViteConfig } from '@nuxt/kit'

export const createServer =  async function(args, firesteadContext){
    const { options, hooks } = firesteadContext

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
      clipboard: args.clipboard,
      open: args.open || args.o,
      port: args.port || args.p || process.env.NUXT_PORT,
      hostname: args.host || args.h || process.env.NUXT_HOST,
      https: Boolean(args.https),
      certificate: (args['ssl-cert'] && args['ssl-key']) && {
        cert: args['ssl-cert'],
        key: args['ssl-key']
      }
    })

    let currentNuxt = null

    const load = async (isRestart, reason = false) => {
      try {
        loadingMessage = `${reason ? reason + '. ' : ''}${isRestart ? 'Restarting' : 'Starting'} nuxt...`
        currentHandler = null
        if (isRestart) {
          consola.info(loadingMessage)
        }
        if (currentNuxt) {
          await currentNuxt.close()
        }
        currentNuxt = await loadNuxt({ rootDir: options.rootPath, dev: true, ready: false })
        //firestead nuxt module
        if(currentNuxt.options.modules.indexOf('@firestead/nuxt/module') === -1){
          currentNuxt.options.modules.push('@firestead/nuxt/module')
        }
        /*
        * set framework updated hook
        * all details of framework should be passed to context
        */
        hooks.callHook('framework:update', {
          version: currentNuxt._version,
          details: {
            ssr: currentNuxt.options.ssr,
            mode: currentNuxt.options.mode,
            target: currentNuxt.options.target,
            modules: currentNuxt.options.modules,
            features: currentNuxt.options.features
          }
        })
        /*
        *   add firestead's current env variables to nuxt config
        */
        const envVariables = options.environments.envs[options.environments.current].envVariables
        currentNuxt.options.privateRuntimeConfig = {
          ...currentNuxt.options.privateRuntimeConfig,
          ...getRuntimeConfig('private', envVariables)
        }
        currentNuxt.options.publicRuntimeConfig = {
          ...currentNuxt.options.publicRuntimeConfig,
          ...getRuntimeConfig('public', envVariables)
        }

        await currentNuxt.ready()
        await currentNuxt.hooks.callHook('listen', listener.server, listener)
        await Promise.all([
          writeTypes(currentNuxt).catch(console.error),
          buildNuxt(currentNuxt)
        ])
        currentHandler = currentNuxt.server.app
        if (isRestart && args.clear !== false) {
          console.log(`Nuxt3 v${currentNuxt._version}`)
          listener.showURL()
        }
      } catch (err) {
        consola.error(`Cannot ${isRestart ? 'restart' : 'start'} nuxt: `, err)
        currentHandler = null
        loadingMessage = 'Error while loading nuxt. Please check console and fix errors.'
      }
    }

    // Watch for config changes
    // TODO: Watcher service, modules, and requireTree
    const dLoad = debounce(load)

    const watcher = chokidar.watch([options.rootPath], { ignoreInitial: true, depth: 1 })
    watcher.on('all', (event, file) => {
      if (!currentNuxt) { return }
      if (normalize(file).startsWith(withTrailingSlash(normalize(currentNuxt.options.buildDir)))) { return }
      if (file.match(/(nuxt\.config\.(js|ts|mjs|cjs)|\.nuxtignore|\.env|\.nuxtrc)$/)) {
        dLoad(true, `${relative(options.rootPath, file)} updated`)
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
          dLoad(true, `\`${relative(options.rootPath, file)}\` ${event === 'add' ? 'created' : 'removed'}`)
        }
      }
    })

    await load(false)

    //set framework ready hook
    hooks.callHook('framework:ready', currentNuxt.server)

    const reload = () => {
      dLoad(true, 'Manual triggered reload')
    }
    
    return {
      reload
    }
}

export const build = async ({ rootPath, buildConfig, environments }) => {

  process.env.NITRO_PRESET = 'node'
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'

  const nuxt = await loadNuxt({ 
    rootDir: rootPath, 
    ready: false,
    overrides: {
      _generate: true
    }
  })
  // set firestead config in nuxt context
  nuxt.options['firestead'] = {
    config: environments.envs[environments.current].config
  }
  const envVariables = environments.envs[environments.current].envVariables
  //add firestead runtime config to nuxt config
  nuxt.options.privateRuntimeConfig = {
    ...nuxt.options.privateRuntimeConfig,
    ...getRuntimeConfig('private', envVariables)
  }
  nuxt.options.publicRuntimeConfig = {
    ...nuxt.options.publicRuntimeConfig,
    ...getRuntimeConfig('public', envVariables)
  }

  //nitro context -> add firestead output dir
  nuxt.hooks.hook('nitro:context',(nitroContext)=>{
    nitroContext.output.dir = `${rootPath}/${buildConfig.dir}/build/functions/framework`
    nitroContext.output.serverDir = `${rootPath}/${buildConfig.dir}/build/functions/framework/server`
    nitroContext.output.publicDir = `${rootPath}/${buildConfig.dir}/build/functions/framework/public`
  })

  //add firestead nuxt module
  nuxt.hooks.hook('modules:before',({nuxt})=>{
    if(nuxt.options.buildModules.indexOf('@firestead/nuxt/module') === -1){
      nuxt.options.buildModules.push('@firestead/nuxt/module')
    }
  })

  await nuxt.ready()

  extendViteConfig((config)=>{
    if(!config.ssr){
      config.ssr = {
        external: []
      }
    }
    if(!config.ssr.external) config.ssr.external = []
    config.ssr.external.push('firebase-admin')
  })

  // clean .nuxt build dir
  await clearDir(nuxt.options.buildDir)
  await writeTypes(nuxt)

  nuxt.hook('build:error', (err) => {
    consola.error('Nuxt Build Error:', err)
    process.exit(1)
  })
  
  await buildNuxt(nuxt)
}