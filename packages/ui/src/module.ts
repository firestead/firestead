import { defineNuxtModule, createResolver, installModule, addComponent, resolvePath, addPlugin } from '@nuxt/kit'
import { getDependencyModules } from './dependencies'
import { initTailwind } from './tailwind'
import {
   getComponents
} from './components'

// Module options TypeScript interface definition
export interface ModuleOptions {
  global: boolean
  prefix: string
  safelistColors: string[]
  icons: string[] | string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@firestead/ui',
    configKey: 'ui'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    global: false,
    prefix: 'Fs',
    safelistColors: ['primary', 'red'],
    icons: ['heroicons']
  },
  async setup (options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    const runtimeDir = resolve('./runtime')
    nuxt.options.build.transpile.push(runtimeDir)
    nuxt.options.build.transpile.push('@popperjs/core', '@headlessui/vue')

    nuxt.options.nitro.preset = resolve('runtime/nitro.preset')


    // default app config for core module
    const appConfigFile = await resolvePath(resolve(runtimeDir, 'app.config'))
    nuxt.hook('app:resolve', (app) => {
      app.configs.push(appConfigFile)
    })

    // add theming
    nuxt.hook('theme:extend', (themeDirs)=>{
      themeDirs.unshift({
        cwd: resolve('runtime'),
        dir: 'theme',
        priority: 10000
      })
    })
    // add tailwind
    nuxt.hook('tailwindcss:config', (tailwindConfig)=>initTailwind(nuxt, options, tailwindConfig))

    // Register dependencies
    const dependencyModules = getDependencyModules({
      nuxt: nuxt,
      options: options,
      cwd: resolve('runtime')
    })
    for(const dependencyModule of dependencyModules) {
      const moduleOptions = dependencyModule.options || {}
      await installModule(dependencyModule.name, moduleOptions, nuxt)
    }

    // add Plugins
    addPlugin({
      src: resolve(runtimeDir, 'plugins', 'colors')
    })

    //Add global firestead components
    const components = getComponents({
      cwd: resolve('runtime'),
      prefix: options.prefix,
      global: options.global
    })
    for(const component of components) {
      addComponent(component)
    }
  }
})
