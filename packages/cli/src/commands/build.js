import { defineFiresteadCommand } from "./index"
import { createFiresteadContext, prepareFirebase, buildFirebase, createFirebaseConfig } from 'firestead'
import { initFramework } from '../utils/framwork'
import { resolve } from 'pathe'
import { loadConfig } from 'c12'

export default defineFiresteadCommand({
    meta: {
      name: 'build',
      usage: 'npx firestead build',
      description: 'Build firestead'
    },
    async invoke (args) {
        const rootPath = resolve(args._[0] || '.')
        //Init Firestead
        const firesteadCtx = createFiresteadContext({ dev: false, rootPath })
        // add firebase config and env vars to firesteadContext
        const { config: firesteadContext } = await loadConfig({
          configFile: `${rootPath}/env.config.js`,
          overrides: firesteadCtx
        })
        try {
          //prepare build for firestead
          await prepareFirebase(firesteadContext)
          // init framework
          const frameworkInstance = await initFramework(firesteadContext)
          // build framework
          await frameworkInstance.build.call(null, firesteadContext)
          //build for firestead
          await buildFirebase(firesteadContext)
          // create firebase configuration files
          await createFirebaseConfig(firesteadContext)
        } catch (error) {
          console.error(error)
        }
    }
})