import { resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { addAutoImport, addPluginTemplate, addServerHandler, addTemplate, defineNuxtModule, isNuxt2 } from '@nuxt/kit'

const firesteadModule = defineNuxtModule({
    meta: {
      name: 'firestead',
      configKey: 'firestead',
    },
    name: 'firestead',
    configKey: 'firestead',
    defaults: {
      auth: true,
      config: {}
    },
    async setup(options, nuxt) {
        if (isNuxt2()) {
            console.log('@firestead/nuxt does not supporting nuxt2')
            return
        }
        // Transpile runtime
        const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url))
        nuxt.options.build.transpile.push(runtimeDir)

        addServerHandler({
          route: '/fs/auth/**',
          handler: resolve(runtimeDir, 'middleware/auth.js')
        })

        //add plugin utils
        addTemplate({
            src: resolve(runtimeDir, 'plugins/utils/auth.js'),
            filename: 'utils.auth.js'
        })

        const firebaseConfig = {
          dev: nuxt.options.dev,
          auth: options.auth,
          config: options.config
        }
        //Firebase server client sdk for web
        addPluginTemplate({
          src: resolve(runtimeDir, 'plugins/firebase.client.js'),
          filename: 'firebase.client.js',
          mode: 'client',
          options: {...firebaseConfig}
        })
        
        //Firebase server admin sdk for web
        addPluginTemplate({
          src: resolve(runtimeDir, 'plugins/firebase.server.js'),
          filename: 'firebase.server.js',
          mode: 'server',
          options: {...firebaseConfig}
        })
    
        //add firestead composables -> Todo: fs plugins can add composables
        addAutoImport({name: 'useFirestore', as: 'useFirestore', from: resolve(runtimeDir, 'composables/useFirestore.js')})
        addAutoImport({name: 'useAuth', as: 'useAuth', from: resolve(runtimeDir, 'composables/useAuth.js')})
        addAutoImport({name: 'useStorage', as: 'useStorage', from: resolve(runtimeDir, 'composables/useStorage.js')})
        addAutoImport({name: 'useFunction', as: 'useFunction', from: resolve(runtimeDir, 'composables/useFunction.js')})

    },
})

export default firesteadModule