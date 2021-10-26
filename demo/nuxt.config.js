import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: false,
    buildModules: [
        [resolve(__dirname, '../src/module')]
    ],
    firestead: { 
        config: {
          apiKey: '123456789',
          authDomain: '',
          databaseURL: '',
          projectId: 'default',
          storageBucket: '',
          messagingSenderId: '',
          appId: ''
        }
    },
    build: {
        postcss: {
            postcssOptions: {
                plugins: {
                    tailwindcss: {},
                    autoprefixer: {},
                }
            }
        },
    },
    nitro: {
        preset: resolve(__dirname, '../src/nitro/preset')
      }
})