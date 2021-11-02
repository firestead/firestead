import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { addPlugin, addTemplate, defineNuxtModule, isNuxt2, requireModulePkg   } from '@nuxt/kit-edge'
import {runEmulator} from './emulator'
import { prepare, writeEntryFile, watch } from './build/index'
import { writePackageJson, writeFirebaseDefaults } from './build/config/index'

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
          console.log(`${chalk.bold.red('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Be careful, Firebase Web SDK does not support SSR. You should disable SSR for pages where Firebase SDK is used!')}`)
        }
        const { version } = requireModulePkg('firestead')
        console.log(`${chalk.bold.green('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.green('Running Firestead v' + version)}`)
        if(!firebaseEmulator){
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
        //add firestead composables
        const composables = [{
            name: 'useAsyncFunction',
            as: 'useAsyncFunction',
            from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/functions.js')
          },{
            name: 'useFirestore',
            as: 'useFirestore',
            from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/firestore.js')
          },{
            name: 'useFirestoreFetch',
            as: 'useFirestoreFetch',
            from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/firestore.js')
          },{
            name: 'useStorage',
            as: 'useStorage',
            from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/storage.js')
          },{
            name: 'useStorageUpload',
            as: 'useStorageUpload',
            from: resolve(dirname(fileURLToPath(import.meta.url)),'composables/storage.js')
        }]
        nuxt.hook('autoImports:extend', (autoImports)=>{
          for(const composable of composables){
            autoImports.push(composable)
          }
        })
        //add firestead options to firebase plugin
        addTemplate({
          filename: 'firestead.options.js',
          getContents: ({ utils }) => {
            const name = utils.importName(`firestead_options_obj`)
            const firebaseConfig = {
              dev: nuxt.options.dev,
              config: options?.config || {}
            }
            return `
              const ${name} = () => Promise.resolve(${JSON.stringify(firebaseConfig)})\n
              export default ${name}
            `;
          }
        })
        addPlugin({
          src: resolve(dirname(fileURLToPath(import.meta.url)), './plugins/firebase.js')
        })
        const firebaseDeps = [
          '@firebase/app',
          '@firebase/functions',
          '@firebase/firestore',
          '@firebase/auth',
          '@firebase/storage'
        ]
    
        firebaseDeps.forEach((dep) => {
          nuxt.options.build.transpile.push(dep);
        })
    },
  })


export default firestead