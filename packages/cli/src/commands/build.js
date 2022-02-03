import { defineFiresteadCommand } from "./index"
import { createFiresteadContext } from 'firestead'
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
        const firesteadContext = createFiresteadContext({ rootPath , dev: true })

        console.log('end')
    }
})