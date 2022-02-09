import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { resolve } from 'pathe'
import chalk from 'chalk'
import { loadConfig } from 'c12'
import { createFiresteadContext } from 'firestead'
import { isDir } from '@firestead/kit'
import util from 'util'

export default defineFiresteadCommand({
    meta: {
      name: 'deploy',
      usage: 'npx firestead deploy',
      description: 'Deploy your firestore project to firebase'
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
      const firesteadCtx = createFiresteadContext({ rootPath , dev: false })
      // add firebase config and env vars to firesteadContext
      const { config: firesteadContext } = await loadConfig({
        configFile: `${rootPath}/env.config.js`,
        overrides: firesteadCtx
      })
      if(!firesteadContext?.firebase?.projectId){
        throw new Error(`Failed to deploy project, no firebase project id found in env.config.js`)
      }
      // add firebase emulator logger to firestead context
      firesteadContext.logger = client.logger.logger

      //change path to firebase runtime path
      const firebaseRuntimePath = `${firesteadContext.buildPath}/build`
      if(!isDir(firebaseRuntimePath)) throw new Error(`You have to build your project first`)
      process.chdir(firebaseRuntimePath)
      // set logger for firebase deployment
      firesteadContext.logger.on("data",(log)=>{
        if(['info', 'warn', 'data', 'http'].indexOf(log.level) !== -1){
          const logArgs = log[Symbol.for('splat')]
          if (logArgs) {
            log.message = util.format(log.message, logArgs[0]) 
          }
          console.log(log.message)
        }
      })
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Start to deploy project \n`)
      //start firebase emulator
      const deployOptions = {
        project: firesteadContext.firebase.projectId
      }
      await client.deploy(deployOptions)
      firesteadContext.logger.log('info', `${chalk.yellow('i Firestead')} Deployed successfully \n`)
      //change dir back to cli command path
      process.chdir(`${process.env.INIT_CWD}`)
    }
})