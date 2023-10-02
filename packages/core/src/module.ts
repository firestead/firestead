import { defineNuxtModule, createResolver, installModule, addLayout, addComponent } from '@nuxt/kit'
import { getDependencyModules } from './dependencies'
import {
    getComponents
} from './components'

export interface ModuleOptions {
    defaultLayout?: 'stacked' | 'sidebar'
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: 'firestead',
      configKey: 'firestead'
    },
    // Default configuration options of the Nuxt module
    defaults: {
        defaultLayout: 'sidebar'
    },
    async setup (options, nuxt) {
        const { resolve } = createResolver(import.meta.url)

        // Transpile runtime
        const runtimeDir = resolve('./runtime')
        nuxt.options.build.transpile.push(runtimeDir)

        nuxt.hook('tailwindcss:config', (tailwindConfig)=>{
            // @ts-ignore
            tailwindConfig.content?.files.push(resolve('runtime/**/*.vue'))
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
            src: resolve(`runtime/layouts/${options.defaultLayout}.vue`),
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