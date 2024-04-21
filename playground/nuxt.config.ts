export default defineNuxtConfig({
    ssr: false,
    modules: [
        'firestead',
        '@firestead/auth',
        '@firestead/admin'
    ],
    colorMode: {
        preference: 'light'
    },
    vuefire: {
    }
})