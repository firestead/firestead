import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { resolve } from 'pathe'
import chalk from 'chalk'
import { createFiresteadContext, useEnvironment } from 'firestead'
import { isDir } from '../utils/helper'

export default defineFiresteadCommand({
    meta: {
      name: 'deploy',
      usage: 'npx firestead deploy',
      description: 'Deploy your firestore project to firebase'
    },
    async invoke (args) {
      process.env.NODE_ENV = process.env.NODE_ENV || 'development'
      let firebaseClient = null
      try {
        firebaseClient = await requireg('firebase-tools')        
      } catch (error) {
        throw new Error(`Failed to run firestead in development mode: ${error.message}`)
      }
      const rootPath = resolve(args._[0] || '.')

      //Init Firestead
      const firesteadContext = createFiresteadContext({ rootPath , dev: false })
      // init runtime enviroment
      await useEnvironment(firesteadContext, 'prod')
      if(!firesteadContext.options.environments.envs[firesteadContext.options.environments.current].config?.projectId){
        throw new Error(`Failed to deploy project, no firebase project id found in firestead.env.json`)
      }

      //change path to firebase runtime path
      const firebaseRuntimePath = `${firesteadContext.options.buildConfig.path}/build`
      if(!isDir(firebaseRuntimePath)) throw new Error(`You have to build your project first`)
      process.chdir(firebaseRuntimePath)

      console.log(`${chalk.yellow('i Firestead')} Start to deploy project \n`)
      //start firebase emulator
      const deployOptions = {
        project: firesteadContext.options.environments.envs[firesteadContext.options.environments.current].config.projectId
      }
      await firebaseClient.deploy(deployOptions)
      console.log(`${chalk.yellow('i Firestead')} Deployed successfully \n`)
      //change dir back to cli command path
      process.chdir(`${process.env.INIT_CWD}`)
    }
})