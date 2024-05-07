import { defineNuxtModule, createResolver, installModule, addLayout, addComponent, resolvePath } from '@nuxt/kit'
import { getDependencyModules } from './dependencies'
import {
    getComponents
} from './components'
import type { DefaultColors } from 'tailwindcss/types/generated/colors'

type TWColors = keyof DefaultColors | 'primary'

export interface ModuleOptions {
    layout?: 'stacked' | 'sidebar'
    ui?: {
        prefix: string,
        safelistColors: TWColors[],
        icons: string[]
    }
    i18n?: {
        langDir: string
    }
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: 'firestead',
      configKey: 'firestead'
    },
    // Default configuration options of the Nuxt module
    defaults: {
        layout: 'sidebar',
        ui: {
            prefix: 'Fs',
            safelistColors: ['primary', 'red'],
            icons: ['heroicons']
        },
        i18n: {
            langDir: './lang'
        }
    },
    async setup (options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        await new Promise(r => setTimeout(r, 5000)); 

        // Transpile runtime
        const runtimeDir = resolve('./runtime')
        nuxt.options.build.transpile.push(runtimeDir)

        nuxt.options.nitro.preset = resolve('runtime/nitro.preset')

        nuxt.hook('tailwindcss:config', (tailwindConfig)=>{
            // @ts-ignore
            tailwindConfig.content?.files.push(resolve('./runtime/**/*.{vue,mjs,ts}'))
        })

        // default app config for core module
        const appConfigFile = await resolvePath(resolve(runtimeDir, 'app.config'))
        nuxt.hook('app:resolve', (app) => {
            app.configs.push(appConfigFile)
        })

        // Register dependencies
        const dependencyModules = getDependencyModules({
            options: options,
            cwd: resolve('runtime')
        })
        for(const dependencyModule of dependencyModules) {
            const moduleOptions = dependencyModule.options || {}
            await installModule(dependencyModule.name, moduleOptions, nuxt)
        }

        addLayout({
            filename: 'default.vue',
            src: resolve(`runtime/layouts/${options.layout}.vue`),
        })
        addLayout({
            filename: 'empty.vue',
            src: resolve(`runtime/layouts/empty.vue`),
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

        // enabled only in development
        if (nuxt.options.dev) {
            //add firebase emulator ui to dev tools
            nuxt.hook('devtools:customTabs', (tabs) => {
                tabs.push({
                title: 'Firebase Emulator',
                name: 'firestead',
                icon: 'logos-firebase',
                view: {
                    type: 'iframe',
                    src: 'http://localhost:4000/'
                }
                })
            })
        }
    }
})