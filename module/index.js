import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { addPlugin, addTemplate, defineNuxtModule, isNuxt2   } from '@nuxt/kit-edge'
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
        nuxt.hook('autoImports:dirs', (composablesDirs)=>{
          composablesDirs.push(resolve(dirname(fileURLToPath(import.meta.url)), 'composables'))
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
          '@firebase/auth'
        ]
    
        firebaseDeps.forEach((dep) => {
          nuxt.options.build.transpile.push(dep);
        })
    },
  })


export default firestead