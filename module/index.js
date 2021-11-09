import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { addPluginTemplate, defineNuxtModule, isNuxt2, requireModulePkg, addServerMiddleware   } from '@nuxt/kit-edge'
import {runEmulator} from './emulator'
import { prepare, writeEntryFile, watch } from './build'
import { writePackageJson, writeFirebaseDefaults } from './build/config'
//import { default as firebaseMiddleware} from './middleware/firebase'

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
          console.log(`${chalk.bold.red('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Be careful, Firebase Web SDK does not support SSR. Firebase Web SDK is only available on client side!')}`)
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
          src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/firebase.web.mjs'),
          filename: 'firebase.web.js',
          mode: 'client',
          options: {...firebaseConfig}
        })

        //TODO: find a way to add init firebase-admin sdk to api server
        //currently plugins are not loaded on api server
        /*addServerMiddleware({
          route: '/api',
          handler: firebaseMiddleware
        })*/
        
        addPluginTemplate({
          src: resolve(dirname(fileURLToPath(import.meta.url)), 'plugins/firebase.admin.mjs'),
          filename: 'firebase.admin.js',
          mode: 'server'
        })

        //add firestead composables
        const composables = [{
          functions: ['useFirestore','useFirestoreAdmin','useFirestoreFetch'],
          file: 'composables/firestore.mjs'
        },{
          functions: ['useStorage','useStorageUpload'],
          file: 'composables/storage.mjs'
        },{
          functions: ['useAsyncFunction'],
          file: 'composables/functions.mjs'
        }]
        nuxt.hook('autoImports:extend', (autoImports)=>{
          for(const composable of composables){
            for(const func of composable.functions){
              autoImports.push({
                name: func,
                as: func,
                from: resolve(dirname(fileURLToPath(import.meta.url)),composable.file)
              })
            }
          }
        })

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
          'firebase-admin/app',
          'firebase-admin/firestore',
          '@firebase/app',
          '@firebase/functions',
          '@firebase/firestore',
          '@firebase/auth',
          '@firebase/storage',
          'tslib'
        ]
        firebaseDeps.forEach((dep) => {
          nuxt.options.build.transpile.push(dep)
        })
    },
  })

export default firestead   