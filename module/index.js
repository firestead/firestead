import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { addPluginTemplate, addServerMiddleware, addTemplate, defineNuxtModule, isNuxt2, requireModulePkg } from '@nuxt/kit-edge'
import {runEmulator} from './emulator'
import { createFiresteadContext } from './context'
import { prepare, bundleUI, bundleFirebase } from './build'
import { writePackageJson, writeFirebaseDefaults } from './build/config'
import fsApi from './middleware/fsApi'
import fsUi from './middleware/fsUi'

let firebaseEmulator = false

const firestead = defineNuxtModule({
    name: 'firestead',
    configKey: 'firestead',
    async setup(options, nuxt) {
        if (isNuxt2()) {
            console.log('Firestead does not supporting nuxt2')
            return
        }
        const { version } = requireModulePkg('firestead')
        console.log(`${chalk.bold.green('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.green('Running Firestead v' + version)}`)
        const firesteadContext = createFiresteadContext(nuxt)
        //add firestead build dir to node env -> TODO: find better way to add build dir to middleware
        process.env.FIRESTEAD_BUILD_DIR = `${nuxt.options.rootDir}/${firesteadContext.buildDir}`
        if(!firebaseEmulator && nuxt.options.dev){
          //set process envs for dev
          process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099'
          process.env.GCLOUD_PROJECT = 'default'
          //prepare build for firestead
          await prepare(firesteadContext)       
          // create firebase configuration
          writeFirebaseDefaults(firesteadContext)
          await writePackageJson(firesteadContext)
          // run rollup watch function to build firestead index.mjs
          await bundleFirebase(firesteadContext)
          //start firebase emulator and watch
          if(!options.disableEmulator){
            firebaseEmulator = await runEmulator(nuxt)
          } 
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
        //build fs ui
        await bundleUI(firesteadContext)
        // firestead ui server middleware
        addServerMiddleware({
          route: '/fs',
          handle: fsUi
        })
        // add firestead api
        addServerMiddleware({
          route: '/fsApi',
          handle: fsApi
        })
        //TODO: find a way to add init firebase-admin sdk to api server
        //currently plugins are not loaded on api server and middleware does not work
        //addServerMiddleware({
        //  route: '/api',
        //  handle: firebaseMiddleware
        //})
    

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

export default firestead   