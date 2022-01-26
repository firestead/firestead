import { dirname, resolve } from 'pathe'
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

        //add plugin utils
        addTemplate({
            src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/utils/auth.js'),
            filename: 'utils.auth.js',
            mode: 'client'
        })

        const firebaseConfig = {
          dev: nuxt.options.dev,
          config: options?.config || {}
        }
        //Firebase server client sdk for web
        addPluginTemplate({
          src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/firebase.web.js'),
          filename: 'firebase.web.js',
          mode: 'client',
          options: {...firebaseConfig}
        })
        
        //Firebase server admin sdk for web
        addPluginTemplate({
          src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/firebase.admin.js'),
          filename: 'firebase.admin.js',
          mode: 'server'
        })
    

        //add firestead composables -> Todo: fs plugins can add composables
        const composables = [{
          functions: ['useAuth','useFirestore','useStorage','useAsyncFunction'],
          file: resolve(dirname(fileURLToPath(import.meta.url)),'composables/index.js')
        }]
        nuxt.hook('autoImports:extend', (autoImports)=>{
          for(const composable of composables){
            for(const func of composable.functions){
              autoImports.push({
                name: func,
                as: func,
                from: composable.file
              })
            }
          }
        })
    },
  })

export default firesteadModule