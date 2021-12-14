import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: true,
    buildModules: [
        'nuxt-windicss',
        'firestead'
    ],
    privateRuntimeConfig: {
        apiKey: 'TestKey'
    },
    firestead: {
        disableEmulator: true, 
        buildDir: '_firestead',
        functionsDir: 'server/firebase',
        config: {
          apiKey: '123456789',
          authDomain: '',
          databaseURL: '',
          projectId: 'default',
          storageBucket: 'default',
          messagingSenderId: '',
          appId: ''
        }
    }
})