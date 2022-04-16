import { resolve } from 'pathe'
import { createServer as createViteServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import svgImport from './plugins/svg-import'

export async function createServer({ contextPath, buildConfig }){

    const server = await createViteServer({
      configFile: false,
      plugins: [
          AutoImport({ 
            imports: [
              'vue',
              'vue-router',
              {
                '#console/composables':[
                  'useFirestead'
                ]
              }
            ],
            exclude: [/[\\/]node_modules[\\/].(?!firestead|)/, /[\\/]\.git[\\/]/]
           }),
          vue(),
          Components({
            directoryAsNamespace: true,
            globalNamespaces: [
              'navbar'
            ],
            resolvers: [
              /*
              * Auto import @firestead/ui
              */
              (name) => {
                if (name.startsWith('Fs')){
                  return { 
                    importName: name,
                    path: '@firestead/ui',
                    sideEffects: '@firestead/ui/style.css'
                  }
                }
              }
            ],
            dirs: [
              resolve(contextPath, 'app/components')
            ],
            exclude: [/[\\/]node_modules[\\/].(?!firestead|)/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
          }),
          svgImport(),
          WindiCSS({
            scan: {
                dirs: [
                  resolve(contextPath, 'app')
                ]
          }
        })
      ],
      resolve: {
          alias: {
            '#console': resolve(contextPath, 'app'),
            '#assets': resolve(contextPath, 'app/assets'),
            '#runtime': buildConfig.runtimePath
          },
          dedupe: ['vue'] // https://github.com/vuejs/core/issues/4344#issuecomment-1053636961 -> https://vitejs.dev/config/#resolve-dedupe
      },
      optimizeDeps: { 
          exclude: ["vue", "vue-router", "sockette", "@headlessui/vue"], 
        },
      root: buildConfig.runtimePath,
      server: {
        port: 1337
      }
    })
  
    await server.listen()
    server.printUrls()
  }