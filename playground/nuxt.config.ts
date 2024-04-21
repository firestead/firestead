export default defineNuxtConfig({
    ssr: false,
    modules: [
        'firestead',
        '@firestead/admin',
        '@firestead/auth'
    ],
    colorMode: {
        preference: 'light'
    },
    vuefire: {
    },
    i18n: {
        defaultLocale: 'de'
    }
})