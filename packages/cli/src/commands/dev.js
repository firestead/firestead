import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { resolve } from 'pathe'
import chalk from 'chalk'
import { loadConfig } from 'c12'
import { initFramework } from '../utils/framwork'
import { createWebsocketServer } from '../server'
import { registerLogger, progressBar, logOutput } from '../utils/logger'
import { waitUntilEmulatorReady } from '../utils/wait'
import { isDir, tryImportModule } from '../utils/helper'
import { prepareFunctions, watchFunctions, useEnvironment, createFirebaseConfig, createFiresteadContext } from 'firestead'

export default defineFiresteadCommand({
    meta: {
      name: 'dev',
      usage: 'npx firestead dev',
      description: 'Run firestead in development mode'
    },
    async invoke (args) {
      //use firestead logger
      process.env.NODE_ENV = process.env.NODE_ENV || 'development'
      let firebaseClient = null
      try {
        firebaseClient = await requireg('firebase-tools')        
      } catch (error) {
        throw new Error(`Failed to run firestead in development mode: ${error.message}`)
      }
      const rootPath = resolve(args._[0] || '.')

      //Init Firestead
      const firesteadContext = createFiresteadContext({ rootPath, dev: true })
      // add firestead enviroments to context
      const { config: envsConfig } = await loadConfig({
        configFile: `${rootPath}/${firesteadContext.options.environments.fileName}`,
        defaults: firesteadContext.options.environments.envs
      })
      firesteadContext.options.environments.envs = envsConfig
      // init runtime enviroment
      useEnvironment(firesteadContext, 'dev')
      //register Logger
      registerLogger(firesteadContext, firebaseClient, true)
      logOutput(`${chalk.yellow('i Firestead')} running in dev mode \n`, true)
      const progress = progressBar(14)
      // init framework
      const frameworkInstance = await initFramework(firesteadContext.options)
      progress.increment({
        msg: 'Framework initialized',
      })
      //prepare build for firestead
      await prepareFunctions(firesteadContext)
      progress.increment({
        msg: 'Prepare Firestead runtime environment'
      })
      //change path to firebase runtime path
      const firebaseRuntimePath = `${firesteadContext.options.buildConfig.path}/firebase`
      process.chdir(firebaseRuntimePath)
      //set process envs for firebase dev
      //process.env.GOOGLE_APPLICATION_CREDENTIALS = `${rootPath}/service-account.json`
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
      process.env.GCLOUD_PROJECT = 'default'   
      // create firebase configuration
      await createFirebaseConfig(firesteadContext)
      progress.increment({
        msg: 'Created Firebase configuration'
      })
      await watchFunctions(firesteadContext)
      progress.increment({
        msg: 'Watching Firebase functions'
      })
      /*
      * Firestead Console is an admin portal for Firestead.
      * It is not necessary to run Firestead
      */
      const firesteadConsole = await tryImportModule('@firestead/console')
      if (firesteadConsole) {
        /*
        * start vite server and bundle process
        */
        await firesteadConsole.start(firesteadContext)
        /*
        * start the web socket server
        */
        createWebsocketServer(firesteadContext)
      }
      const { projectId } = firesteadContext.options.environments.envs.dev.config 
      //start firebase emulator
      const emulatorOptions = {
        project: projectId, 
        exportOnExit: firesteadContext.options.emulator.exportPath,
        only: firesteadContext.options.emulator.services.join(',')
      }
      //if export exists add import to emulator options
      if(isDir(firesteadContext.options.emulator.exportPath)){
        emulatorOptions.import = firesteadContext.options.emulator.exportPath
      }
      progress.increment()
      firebaseClient.emulators.start(emulatorOptions)
      //change dir back to cli command path -> this will output firebase emulator logs to root project path ???
      //process.chdir(`${process.env.INIT_CWD}`)
      //await emulator ready
      await waitUntilEmulatorReady(firebaseClient, firesteadContext.hooks, progress)
      progress.update(14)
      try {
        // start framework server
        console.log('info', `${chalk.yellow('i Firestead')} Starting dev server for framework '${firesteadContext.options.framework.name}'`)
        await frameworkInstance.createServer.call(null, args, firesteadContext)
      } catch (error) {
        throw new Error(`Failed to start framework dev server: ${error.message}`)
      }
    }
})