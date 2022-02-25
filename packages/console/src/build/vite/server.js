import { resolve } from 'pathe'
import { createServer as createViteServer } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'

export async function createServer(firesteadContext){
    const server = await createViteServer({
      configFile: false,
      plugins: [
          vue(),
          WindiCSS({
            scan: {
                dirs: [resolve(firesteadContext.console.contextPath, 'app')]
          }
        })
      ],
      resolve: {
          alias: {
            '#console': resolve(firesteadContext.console.contextPath, 'app')
          }
      },
      optimizeDeps: { 
          exclude: ["vue", "vue-router"], 
        },
      root: firesteadContext.console.buildRuntimePath,
      server: {
        port: 1337
      }
    })
  
    await server.listen()
    server.printUrls()
  }