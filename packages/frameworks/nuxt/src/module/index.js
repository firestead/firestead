import { resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { addPluginTemplate, addTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit'

const firesteadModule = defineNuxtModule({
    meta: {
      name: 'firestead',
      configKey: 'firestead',
    },
    name: 'firestead',
    configKey: 'firestead',
    defaults: {

    },
    async setup(options, nuxt) {
        if (isNuxt2()) {
            console.log('@firestead/nuxt does not supporting nuxt2')
            return
        }

        // Transpile runtime
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        nuxt.options.build.transpile.push(runtimeDir)

        //add plugin utils
        addTemplate({
            src: resolve(runtimeDir, 'plugins/utils/auth.js'),
            filename: 'utils.auth.js',
            mode: 'client'
        })

        const firebaseConfig = {
          dev: nuxt.options.dev,
          config: options?.config || {}
        }
        //Firebase server client sdk for web
        addPluginTemplate({
          src: resolve(runtimeDir, 'plugins/firebase.web.js'),
          filename: 'firebase.web.js',
          mode: 'client',
          options: {...firebaseConfig}
        })
        
        //Firebase server admin sdk for web
        addPluginTemplate({
          src: resolve(runtimeDir, 'plugins/firebase.admin.js'),
          filename: 'firebase.admin.js',
          mode: 'server'
        })
    

        //add firestead composables -> Todo: fs plugins can add composables
        nuxt.hook('autoImports:dirs', (dirs) => {
            dirs.push(resolve(runtimeDir, 'composables'))
        })
    },
})

export default firesteadModule