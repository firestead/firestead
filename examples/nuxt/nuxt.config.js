import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: true,
    buildModules: [
        'nuxt-windicss'
    ],
    vite: {
        logLevel: 'info' 
    },
    privateRuntimeConfig: {
        apiKey: 'TestKey'
    },
    firestead: {
        auth: true
    }
})