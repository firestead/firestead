import { defineFiresteadCommand } from "./index"
import { createFiresteadContext, prepare as prepareFirebase, build as buildFirebase } from 'firestead'
import { initFramework } from '../utils/framwork'
import { resolve } from 'pathe'

export default defineFiresteadCommand({
    meta: {
      name: 'build',
      usage: 'npx firestead build',
      description: 'Build firestead'
    },
    async invoke (args) {
        const rootPath = resolve(args._[0] || '.')

        //Init Firestead
        const firesteadContext = createFiresteadContext({ rootPath , dev: false })
        try {
          //prepare build for firestead
          await prepareFirebase(firesteadContext)
          // init framework
          const frameworkInstance = await initFramework(firesteadContext)
          // build framework
          await frameworkInstance.build.call(null, firesteadContext)
          //build for firestead
          await buildFirebase(firesteadContext)
        } catch (error) {
          console.error(error)
        }
    }
})