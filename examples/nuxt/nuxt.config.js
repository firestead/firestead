import { defineNuxtConfig } from 'nuxt3'

export default defineNuxtConfig({
    ssr: true,
    modules: [
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