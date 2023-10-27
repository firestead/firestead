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
    const prefix = 'Fs'
    const dependencyModules = [{
        name: 'nuxt-theming',
        options: {
          layers: {
            priority: 100
          },
          config: [
            {
              name: 'avatar',
              safelistExtractors:{ 
                color: {
                  component: `${prefix}Avatar`,
                  safelistByProp: true,
                  values: ['primary']
                }
              }
            },
            {
              name: 'badge',
              safelistExtractors:{ 
                color: {
                  component: `${prefix}Badge`,
                  safelistByProp: true,
                  values: ['primary']
                }
              }
            },
            {
              name: 'button',
              safelistExtractors:{ 
                color: {
                  component: `${prefix}Button`,
                  safelistByProp: true,
                  values: ['primary']
                }
              }
            },
            {
              name: 'input',
              safelistExtractors: { 
                color: {
                  component: `${prefix}Input`,
                  safelistByProp: true,
                  values: ['primary']
                }
              }
            },
            {
              name: 'checkbox',
              safelistExtractors: {
                color: {
                  component: `${prefix}Checkbox`,
                  safelistByProp: true,
                  values: ['primary']
                }
              }
            }
          ]
        }
    },{
      name: 'nuxt-forms',
      options: {
        registerComponents: false
      }
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
                ]
              }
            }
        }
    }] as DependencyModules

    return dependencyModules
}