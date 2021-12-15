import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: false, //needs to be false until ssr fix in workspaces context
    buildModules: [
        'nuxt-windicss',
        'firestead'
    ],
    privateRuntimeConfig: {
        apiKey: 'TestKey'
    },
    firestead: {
        disableEmulator: false, 
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