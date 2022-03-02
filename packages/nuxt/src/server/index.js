import { clearDir } from './utils/fs'
import { writeTypes } from './utils/prepare'
import debounce from 'p-debounce'
import chokidar from 'chokidar'
import { createServer as nuxtServer, createLoadingHandler } from './utils/server'
import { loadNuxt, buildNuxt, extendViteConfig } from '@nuxt/kit'
import { relative } from 'pathe'

export const createServer =  async function(args, { rootPath, hooks }){

    //create server
    const server = nuxtServer()
    const listener = await server.listen({
      clipboard: args.clipboard,
      open: args.open || args.o,
      port: args.port || args.p,
      hostname: args.host || args.h,
      https: Boolean(args.https),
      certificate: (args['ssl-cert'] && args['ssl-key']) && {
        cert: args['ssl-cert'],
        key: args['ssl-key']
      }
    })

    let currentNuxt = null

    const load = async (isRestart, reason = false) => {
      try {
        const message = `${reason ? reason + '. ' : ''}${isRestart ? 'Restarting' : 'Starting'} nuxt...`
        server.setApp(createLoadingHandler(message))
        if (isRestart) {
          consola.info(message)
        }
        if (currentNuxt) {
          await currentNuxt.close()
        }
        const newNuxt = await loadNuxt({ rootDir: rootPath, dev: true, ready: false })
        //firestead nuxt module
        if(newNuxt.options.buildModules.indexOf('@firestead/nuxt/module') === -1){
          newNuxt.options.buildModules.push('@firestead/nuxt/module')
        }
        await clearDir(newNuxt.options.buildDir)
        currentNuxt = newNuxt
        await currentNuxt.ready()
        writeTypes(currentNuxt).catch(console.error)
        await buildNuxt(currentNuxt)
        server.setApp(currentNuxt.server.app)
        if (isRestart && args.clear !== false) {
          listener.showURL()
        }
      } catch (err) {
        consola.error(`Cannot ${isRestart ? 'restart' : 'start'} nuxt: `, err)
        server.setApp(createLoadingHandler(
          'Error while loading nuxt. Please check console and fix errors.'
        ))
      }
    }

    await load(false)
    //set framework ready hook
    hooks.callHook('framework:ready', currentNuxt.server)
    if (currentNuxt) {
      await currentNuxt.hooks.callHook('listen', listener.server, listener)
    }

    const dLoad = debounce(load, 250)

    const reload = () => {
      dLoad(true, 'Manual triggered reload')
    }

    const watcher = chokidar.watch([rootPath], { ignoreInitial: true, depth: 1 })
    watcher.on('all', async (event, file) => {
      if (!currentNuxt) { return }
      if (file.startsWith(currentNuxt.options.buildDir)) { return }
      if (file.match(/nuxt\.config\.(js|ts|mjs|cjs)$/)) {
        dLoad(true, `${relative(rootPath, file)} updated`)
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
        if (file.match(/app\.(js|ts|mjs|jsx|tsx|vue)$/)) {
          dLoad(true, `\`${relative(rootPath, file)}\` ${event === 'add' ? 'created' : 'removed'}`)
        }
      }
    })
    
    return {
      reload
    }
}

export const build = async ({ rootPath, buildDir, enviromentsRuntime }) => {
  process.env.NITRO_PRESET = 'node'
  process.env.NODE_ENV = process.env.NODE_ENV || 'production'
  const nuxt = await loadNuxt({ rootDir: rootPath, ready: false })
  // set firestead config in nuxt context
  nuxt.options['firestead'] = {
    config: enviromentsRuntime.config
  }

  //nitro context -> add firestead output dir
  nuxt.hooks.hook('nitro:context',(nitroContext)=>{
    nitroContext.output.dir = `${rootPath}/${buildDir}/build/functions/framework`
    nitroContext.output.serverDir = `${rootPath}/${buildDir}/build/functions/framework/server`
    nitroContext.output.publicDir = `${rootPath}/${buildDir}/build/functions/framework/public`
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