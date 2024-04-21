import { defineNuxtModule, createResolver, addTypeTemplate } from '@nuxt/kit'

export interface ModuleOptions {
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: '@firestead/i18n',
      configKey: 'fsi18n'
    },
    defaults: {
    },
    async setup (options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        addTypeTemplate({
          filename: 'locales.d.ts',
          getContents: () => `
            export type Locales  = typeof import('${resolve('runtime/lang/en.json')}')`
        })

        nuxt.hook('i18n:registerModule', register => {
            register({
              langDir: resolve('./runtime/lang'),
              locales: [
                {
                  code: 'en',
                  name: 'English',
                  file: 'en.json'
                },
                {
                  code: 'de',
                  name: 'Deutsch',
                  file: 'de.json'
                }
              ]
            })
        })
    }
})