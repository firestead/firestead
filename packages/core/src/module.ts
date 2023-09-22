import { defineNuxtModule, createResolver, installModule, addLayout, addComponent } from '@nuxt/kit'
import { getDependencyModules } from './dependencies'
import {
    getComponents
} from './components'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
    meta: {
      name: 'firestead',
      configKey: 'firestead'
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
            src: resolve('runtime/layouts/default.vue'),
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
    }
})