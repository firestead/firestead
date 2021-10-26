import { resolve } from 'path'
import chalk from 'chalk'
import { addPlugin, addTemplate, defineNuxtModule,getNuxtVersion, isNuxt2   } from '@nuxt/kit'
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
          console.log(`${chalk.bold.red('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Be careful, Firebase Web SDK does not support SSR. You should disable SSR for pages where Firebase SDK is used!')}`)
        }
        console.log('firestead module ' + getNuxtVersion())
        if(!firebaseEmulator){
          const firesteadContext = await prepare(nuxt)
          await writeEntryFile(firesteadContext)
          // create firebase configuration
          writeFirebaseDefaults(firesteadContext)
          await writePackageJson(firesteadContext)
          // run rollup watch function to build firestead index.mjs
          await watch(firesteadContext)
          //start firebase emulator and watch 
          firebaseEmulator = await runEmulator(nuxt)
        }
        //add firestead composables
        nuxt.hook('autoImports:dirs', (composablesDirs)=>{
          composablesDirs.push(resolve(__dirname, 'composables'))
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
          src: resolve(__dirname, './plugins/firebase.js')
        })
    },
  })


export default firestead