import { defineNuxtModule, extendPages, createResolver } from '@nuxt/kit'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: '@firestead/auth',
      configKey: 'auth'
    },
    // Default configuration options of the Nuxt module
    defaults: {
    },
    async setup (options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        // Transpile runtime
        const runtimeDir = resolve('./runtime')
        nuxt.options.build.transpile.push(runtimeDir)

        // add theming
        nuxt.hook('theme:extend', (themeDirs)=>{
            themeDirs.unshift({
                cwd: resolve('runtime'),
                dir: 'theme',
                priority: 1000
            })
        })

        nuxt.hook('tailwindcss:config', (tailwindConfig)=>{
            // @ts-ignore
            tailwindConfig.content?.files.push(resolve('runtime/**/*.{vue,mjs,ts}'))
        })

        extendPages((pages) => {
            pages.push({
                name: 'login',
                path: '/login',
                file:  resolve('runtime/pages/login.vue')
            })
        })
    }
})