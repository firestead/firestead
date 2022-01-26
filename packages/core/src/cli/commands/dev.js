import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { resolve } from 'pathe'
import chalk from 'chalk'
import util from 'util'
import { createFiresteadContext } from "../../context"
import { initFramework } from "../framwork"
import { waitUntilEmulatorReady } from '../utils/wait'
import { initApp } from '@firestead/ui'
import { installAddon } from '@firestead/kit'
import { prepare as prepareFirebase, bundle as bundleFirebase } from '../../builder'
import { writePackageJson, writeFirebaseDefaults } from '../../builder/config'

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
      //add firestead build dir to node env -> TODO: find better way to add build dir to middleware
      process.env.FIRESTEAD_BUILD_DIR = firesteadContext.buildPath
      //set process envs for dev
      process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
      process.env.GCLOUD_PROJECT = 'default'
      //prepare build for firestead
      await prepareFirebase(firesteadContext)       
      // create firebase configuration
      writeFirebaseDefaults(firesteadContext)
      await writePackageJson(firesteadContext)
      // run rollup watch function to build firestead index.mjs
      await bundleFirebase(firesteadContext)
      await installAddon('@firestead/addon-dashboard')
      await installAddon('@firestead/addon-operations')
      await initApp()


      // init framework
      const frameworkInstance = await initFramework(firesteadContext)
      //change path to firebase runtime path
      const firebaseRuntimePath = `${firesteadContext.buildPath}/firebase`
      process.chdir(firebaseRuntimePath)
      // set logger for firebase emulator
      client.logger.logger.on("data",(log)=>{
        if(['info', 'warn', 'data', 'http'].indexOf(log.level) !== -1){
          const logArgs = log[Symbol.for('splat')]
          if (logArgs) {
            log.message = util.format(log.message, logArgs[0]) 
          }
          console.log(log.message)
        }
      })
      firesteadContext.logger = client.logger.logger
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Starting Firebase emulator \n`)
      //start firebase emulator
      const activeEmulators = ['functions', 'storage', 'auth', 'firestore', 'pubsub']
      client.emulators.start({project: 'default', only: activeEmulators.join(',')})
      //await emulator ready
      await waitUntilEmulatorReady(firesteadContext)
      // start framework server and watch file changes if needed
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Starting dev server for framework '${firesteadContext.framework.name}'`)
      firesteadContext.framework.server = await frameworkInstance.createServer.call(null, args, firesteadContext)
      //change dir back to cli command path
      process.chdir(`${process.env.INIT_CWD}`)
    }
})