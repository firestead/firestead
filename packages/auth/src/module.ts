import { defineNuxtModule, extendPages, createResolver, addComponent, addRouteMiddleware, addImportsDir } from '@nuxt/kit'
import { getComponents } from './components'

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

        nuxt.hook('tailwindcss:config', (tailwindConfig)=>{
            // @ts-ignore
            tailwindConfig.content?.files.push(resolve('./runtime/**/*.{vue,mjs,ts}'))
        })

        extendPages((pages) => {
            pages.push({
                name: 'login',
                path: '/login',
                file:  resolve('./runtime/pages/login.vue')
            })
            pages.push({
                name: 'register',
                path: '/register',
                file:  resolve('./runtime/pages/register.vue')
            })
        })
        //Add global firestead components
        const components = getComponents({
            cwd: resolve('runtime'),
            prefix: 'Fs',
            global: true
        })
        for(const component of components) {
            addComponent(component)
        }
        
        addImportsDir(resolve('./runtime/composables'))

        //Add global route middleware
        addRouteMiddleware({
            name: 'auth',
            path: resolve('./runtime/middleware/auth.global.ts'),
            global: true
        })
    }
})