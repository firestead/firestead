import { resolve } from 'node:path'
import type { ModuleOptions } from './module'
import type { Nuxt } from '@nuxt/schema'
import { defaultExtractor, customSafelistExtractor } from './tailwind'

type Modules = 
'nuxt-theming'
| '@nuxtjs/color-mode'
| 'nuxt-forms'
| '@nuxtjs/tailwindcss'

type DependencyModule = {
    name: Modules
    options?: Record<string, any>
}

type DependencyModules = DependencyModule[]

type DependencyConfig = {
    nuxt: Nuxt
    options: ModuleOptions
    cwd: string
}

export function getDependencyModules(config: DependencyConfig): DependencyModules {
    const dependencyModules = [{
        name: 'nuxt-theming',
    },{
      name: 'nuxt-forms',
    },{
      name: '@nuxtjs/color-mode',
      options: {
        classSuffix: ''
      }
    },{
        name: '@nuxtjs/tailwindcss',
        options: {
            viewer: false,
            exposeConfig: true,
            config: {
              darkMode: 'class',
              plugins: [
                require('@tailwindcss/forms')({ 
                  strategy: 'class' 
                }),
                require('@tailwindcss/aspect-ratio'),
                require('@tailwindcss/typography'),
                require('@tailwindcss/container-queries')
              ],
              content: {
                files: [
                  resolve(config.cwd, 'components/**/*.{vue,mjs,ts}'),
                  resolve(config.cwd, 'theme/**/*.{json,mjs,js,ts}'),
                  resolve(config.cwd, 'app.config.ts')
                ],
                transform: {
                  vue: (content: string) => {
                    return content.replaceAll(/(?:\r\n|\r|\n)/g, ' ')
                  }
                },
                extract: {
                  vue: (content: string) => {
                    return [
                      ...defaultExtractor(content),
                      ...customSafelistExtractor(config.options.ui.prefix, content, config.nuxt.options.appConfig.ui.availableColors, config.options.ui.safelistColors)
                    ]
                  }
                }
              }
            }
        }
    }] as DependencyModules

    return dependencyModules
}