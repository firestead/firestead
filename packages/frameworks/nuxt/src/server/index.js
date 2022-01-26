import { clearDir } from './utils/fs'
import { writeTypes } from './utils/prepare'
import { createServer as nuxtServer, createLoadingHandler } from './utils/server'
import { loadNuxt, buildNuxt } from '@nuxt/kit'

export async function createServer(args, { rootPath }){

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
    if (currentNuxt) {
      await currentNuxt.hooks.callHook('listen', listener.server, listener)
    }

    const reload = () => {

    }
    
    return {
      reload
    }
}