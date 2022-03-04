import { defineFiresteadCommand } from "./index"
import { createFiresteadContext, prepareFirebase, useEnviroment, buildFirebase, createFirebaseConfig } from 'firestead'
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
        const firesteadContext = createFiresteadContext({ dev: false, rootPath })
        // add firebase config and env vars to firesteadContext
        const { config: envsConfig } = await loadConfig({
          configFile: `${rootPath}/${firesteadContext.options.enviroments.fileName}`,
          overrides: firesteadContext.options.enviroments
        })
        firesteadContext.options.enviroments = envsConfig
        // init runtime enviroment
        useEnviroment(firesteadContext, 'production')
        try {
          //prepare build for firestead
          await prepareFirebase(firesteadContext)
          // init framework
          const frameworkInstance = await initFramework(firesteadContext.options)
          // build framework
          await frameworkInstance.build.call(null, firesteadContext.options)
          //build for firestead
          await buildFirebase(firesteadContext)
          // create firebase configuration files
          await createFirebaseConfig(firesteadContext)
        } catch (error) {
          console.error(error)
        }
    }
})