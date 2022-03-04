import { resolve } from 'pathe'
import { createServer as createViteServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

export async function createServer({ contextPath, buildConfig }){
    const server = await createViteServer({
      configFile: false,
      plugins: [
          vue(),
          WindiCSS({
            scan: {
                dirs: [resolve(contextPath, 'app')]
          }
        })
      ],
      resolve: {
          alias: {
            '#console': resolve(contextPath, 'app')
          }
      },
      optimizeDeps: { 
          exclude: ["vue", "vue-router"], 
        },
      root: buildConfig.runtimePath,
      server: {
        port: 1337
      }
    })
  
    await server.listen()
    server.printUrls()
  }