import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { addPluginTemplate, defineNuxtModule, isNuxt2, requireModulePkg, extendRoutes   } from '@nuxt/kit-edge'
import {runEmulator} from './emulator'
import { prepare, writeEntryFile, watch } from './build'
import { writePackageJson, writeFirebaseDefaults } from './build/config'

let firebaseEmulator = false

const firestead = defineNuxtModule({
    name: 'firestead',
    configKey: 'firestead',
    async setup(options, nuxt) {
        if (isNuxt2()) {
            console.log('Firestead does not supporting nuxt2')
            return
        }
        if(nuxt.options.ssr){ 
          console.log(`${chalk.bold.red('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Be careful, Firebase Web SDK does not support SSR. Firebase SDK is only available client side!')}`)
        }
        const { version } = requireModulePkg('firestead')
        console.log(`${chalk.bold.green('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.green('Running Firestead v' + version)}`)
        if(!firebaseEmulator && nuxt.options.dev){
          const firesteadContext = await prepare(nuxt)
          await writeEntryFile(firesteadContext)          
          // create firebase configuration
          writeFirebaseDefaults(firesteadContext)
          await writePackageJson(firesteadContext)
          // run rollup watch function to build firestead index.mjs
          await watch(firesteadContext)
          //start firebase emulator and watch
          if(!options.disableEmulator){
            firebaseEmulator = await runEmulator(nuxt)
          } 
        }
        const firebaseConfig = {
          dev: nuxt.options.dev,
          config: options?.config || {}
        }
        addPluginTemplate({
          src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/firebase.mjs'),
          filename: 'firebase.js',
          mode: 'client',
          options: {...firebaseConfig}
        })

        //add firestead composables
        const composables = [{
          name: 'useAsyncFunction',
          as: 'useAsyncFunction',
          from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/functions.mjs')
        },{
          name: 'useFirestore',
          as: 'useFirestore',
          from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/firestore.mjs')
        },{
          name: 'useFirestoreFetch',
          as: 'useFirestoreFetch',
          from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/firestore.mjs')
        },{
          name: 'useStorage',
          as: 'useStorage',
          from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/storage.mjs')
        },{
          name: 'useStorageUpload',
          as: 'useStorageUpload',
          from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/storage.mjs')
        }]
        nuxt.hook('autoImports:extend', (autoImports)=>{
          autoImports.push(...composables)
        })

        console.log(nuxt.options.router.extendRoutes)

         /*
        extendRoutes(()=>{
          return [{
            path: '/_fs',
            component: resolve(dirname(fileURLToPath(import.meta.url)), 'ui/pages/index.vue')
          }]
        })

       extendRoutes(routes, resolve) {
          *       routes.push({
          *         name: 'custom',
          *         path: '*',
          *         component: resolve(__dirname, 'pages/404.vue')
          *       })
          *     }
          * */
        const firebaseDeps = [
          '@firebase/app',
          '@firebase/functions',
          '@firebase/firestore',
          '@firebase/auth',
          '@firebase/storage'
        ]
        firebaseDeps.forEach((dep) => {
          nuxt.options.build.transpile.push(dep)
        })
    },
  })


export default firestead