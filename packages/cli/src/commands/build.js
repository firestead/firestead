import { defineFiresteadCommand } from "./index"
import { createFiresteadContext, useEnvironment, loadFirestead } from 'firestead'
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
        const firesteadContext = createFiresteadContext({ dev: false, rootPath })
        // init runtime enviroment
        await useEnvironment(firesteadContext, 'prod')
        try {
          const { build } = await loadFirestead(firesteadContext)
          // init framework
          const frameworkInstance = await initFramework(firesteadContext.options)
          // build framework
          await frameworkInstance.build.call(null, firesteadContext.options)
          //build for firestead
          await build(firesteadContext)
        } catch (error) {
          console.error(error)
        }
    }
})