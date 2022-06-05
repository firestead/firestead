import { defineFiresteadCommand } from "./index"
import requireg from "requireg"
import { setEnvironment } from "@firestead/kit"
import { resolve } from 'pathe'
import { FiresteadContext } from "@firestead/schema"

export default defineFiresteadCommand({
    meta: {
      name: 'dev',
      usage: 'npx firestead dev',
      description: 'Run firestead in development mode'
    },
    async invoke (args) {
        process.env.NODE_ENV = process.env.NODE_ENV || 'development'
        let firebaseClient = null
        try {
          firebaseClient = await requireg('firebase-tools')        
        } catch (error) {
          throw new Error(`Failed to run firestead in development mode: ${error.message}`)
        }

        /**
         * get root dir of firestead project
         */
        const rootDir = resolve(args._[0] || '.')
        const firesteadContext = await initFirestead({
            rootDir,
        }) as FiresteadContext

        /**
         * set environment default to development
         * The active runtime environment can be changed later via Firestead Admin or Firestead CLI --runtime=<environment>
         */ 
        let runtime = 'development'
        if(args.runtime){
          runtime = args.runtime
        }
        setEnvironment(runtime)
    }
})