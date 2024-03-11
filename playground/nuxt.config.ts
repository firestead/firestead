export default defineNuxtConfig({
    ssr: false,
    modules: [
        'firestead',
        '@firestead/auth'
    ],
    devtools: true,
    colorMode: {
        preference: 'light'
    },
    vuefire: {
    }
})