import { defineFiresteadCommand } from "./index"
import { createFiresteadContext, useEnvironment, loadFirestead, loadFramework } from 'firestead'
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
          const { build : buildFirestead } = await loadFirestead(firesteadContext)
          // init framework
          const { build : buildFramework } = await loadFramework(firesteadContext.options)
          // build framework
          await buildFramework.call(null, args, firesteadContext.options)
          //build for firestead
          await buildFirestead(firesteadContext)
        } catch (error) {
          console.error(error)
        }
    }
})