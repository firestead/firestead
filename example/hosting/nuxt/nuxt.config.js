import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
    experimental: {
        viteNode: true
    },
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