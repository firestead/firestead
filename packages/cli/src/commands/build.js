import { defineFiresteadCommand } from "./index"
import { createFiresteadContext } from 'firestead'
import { initFramework } from '../utils/framwork'
import { resolve } from 'pathe'

export default defineFiresteadCommand({
    meta: {
      name: 'build',
      usage: 'npx firestead build',
      description: 'Build firestead'
    },
    async invoke (args) {
        process.env.NODE_ENV = process.env.NODE_ENV || 'production'
        const rootPath = resolve(args._[0] || '.')

        //Init Firestead
        const firesteadContext = createFiresteadContext({ rootPath , dev: true })
        // init framework
        const frameworkInstance = await initFramework(firesteadContext)
        // build framework
        try {
          await frameworkInstance.build.call(null, firesteadContext)
        } catch (error) {
          console.error(error)
        }
        //TODO build firebase functions with firestead and bundle all together
    }
})