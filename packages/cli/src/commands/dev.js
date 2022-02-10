import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { resolve } from 'pathe'
import chalk from 'chalk'
import util from 'util'
import chokidar from 'chokidar'
import { initFramework } from '../utils/framwork'
import { waitUntilEmulatorReady } from '../utils/wait'
import { isDir } from '@firestead/kit'
import { prepareFirebase, watchFirebase, createFirebaseConfig, createFiresteadContext } from 'firestead'

export default defineFiresteadCommand({
    meta: {
      name: 'dev',
      usage: 'npx firestead dev',
      description: 'Run firestead in development mode'
    },
    async invoke (args) {
      process.env.NODE_ENV = process.env.NODE_ENV || 'development'
      let client = null
      try {
        client = await requireg('firebase-tools')        
      } catch (error) {
        throw new Error(`Failed to run firestead in development mode: ${error.message}`)
      }
      const rootPath = resolve(args._[0] || '.')

      //Init Firestead
      const firesteadContext = createFiresteadContext({ rootPath , dev: true })
      // init framework
      const frameworkInstance = await initFramework(firesteadContext)
      //change path to firebase runtime path
      const firebaseRuntimePath = `${firesteadContext.buildPath}/firebase`
      process.chdir(firebaseRuntimePath)

      // add firebase emulator logger to firestead context
      firesteadContext.logger = client.logger.logger
      //set process envs for dev
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
      process.env.GCLOUD_PROJECT = 'default'
      
      //prepare build for firestead
      await prepareFirebase(firesteadContext)       
      // create firebase configuration
      await createFirebaseConfig(firesteadContext)
      // run rollup watch function to build firestead index.mjs
      await watchFirebase(firesteadContext)

      // set logger for firebase emulator
      firesteadContext.logger.on("data",(log)=>{
        if(['info', 'warn', 'data', 'http'].indexOf(log.level) !== -1){
          const logArgs = log[Symbol.for('splat')]
          if (logArgs) {
            log.message = util.format(log.message, logArgs[0]) 
          }
          console.log(log.message)
        }
      })
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Starting Firebase emulator \n`)
      //start firebase emulator
      const emulatorOptions = {
        project: 'default', 
        only: firesteadContext.emulator.services.join(','),
        exportOnExit: firesteadContext.emulator.exportPath
      }
      //if export exists add import to emulator options
      if(isDir(firesteadContext.emulator.exportPath)){
        emulatorOptions.import = firesteadContext.emulator.exportPath
      }
      client.emulators.start(emulatorOptions)
      //change dir back to cli command path
      process.chdir(`${process.env.INIT_CWD}`)
      //await emulator ready
      await waitUntilEmulatorReady(firesteadContext)
      // start framework server and watch file changes if needed
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Starting dev server for framework '${firesteadContext.framework.name}'`)
      try {
        firesteadContext.framework.server = await frameworkInstance.createServer.call(null, args, firesteadContext)
        // watch for changes in firestead files -> needed for nuxt framework, check others
        const watcher = chokidar.watch([rootPath], { ignoreInitial: true, depth: 1 })
        watcher.on('all', async (event, path) => {
          // framework watch effect
          firesteadContext.framework.server.watchEffect(event, path)
          // firestead build watch effect
          await firesteadContext.hooks.callHook('watch:event', {event, path})
        }) 
      } catch (error) {
        throw new Error(`Failed to start framework dev server: ${error.message}`)
      }
    }
})