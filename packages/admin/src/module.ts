import { defineNuxtModule, extendPages, createResolver, installModule } from '@nuxt/kit'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: '@firestead/admin',
      configKey: 'admin'
    },
    defaults: {
    },
    async setup (options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        nuxt.hook('tailwindcss:config', (tailwindConfig)=>{
            // @ts-ignore
            tailwindConfig.content?.files.push(resolve('./runtime/**/*.{vue,mjs,ts}'))
        })

        await installModule('@scalar/nuxt', {}, nuxt)

        extendPages((pages) => {
            pages.push({
                name: 'admin',
                path: '/admin',
                file:  resolve('./runtime/pages/admin.vue')
            })
        })

        nuxt.options.nitro.experimental = {
            ...nuxt.options.nitro.experimental,
            openAPI: true
        }
    }
})