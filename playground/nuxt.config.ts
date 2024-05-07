export default defineNuxtConfig({
    ssr: false,
    modules: [
        'firestead',
        '@firestead/admin'
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