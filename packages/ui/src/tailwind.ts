import type { Config } from 'tailwindcss'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'
import { resolve } from 'node:path'
import type { ModuleOptions } from './types'


export function createTailwindConfig(tailwindConfig: Partial<Config>, options: ModuleOptions, cwd: string) {

  tailwindConfig.darkMode = 'class'
  tailwindConfig.plugins = tailwindConfig.plugins || []
  tailwindConfig.plugins.push(...[
    require('@tailwindcss/forms')({ 
      strategy: 'class' 
    }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    iconsPlugin({ 
      collections: getIconCollections(options.icons as any[]) 
    })
  ])
  // @ts-ignore
  tailwindConfig.content = tailwindConfig.content || {} as any
  // @ts-ignore
  tailwindConfig.content.files = tailwindConfig.content.files || []
  // @ts-ignore
  tailwindConfig.content.files.push(...[
    resolve(cwd, 'components/**/*.{vue,mjs,ts}'),
    resolve(cwd, 'theme/**/*.{json,mjs,js,ts}'),
    resolve(cwd, 'app.config.ts')
  ])

  tailwindConfig!.theme!.extend!.colors = tailwindConfig?.theme?.extend?.colors || {}

  // @ts-ignore
  tailwindConfig!.theme!.extend!.colors.primary = {
    50: 'rgb(var(--color-primary-50) / <alpha-value>)',
    100: 'rgb(var(--color-primary-100) / <alpha-value>)',
    200: 'rgb(var(--color-primary-200) / <alpha-value>)',
    300: 'rgb(var(--color-primary-300) / <alpha-value>)',
    400: 'rgb(var(--color-primary-400) / <alpha-value>)',
    500: 'rgb(var(--color-primary-500) / <alpha-value>)',
    600: 'rgb(var(--color-primary-600) / <alpha-value>)',
    700: 'rgb(var(--color-primary-700) / <alpha-value>)',
    800: 'rgb(var(--color-primary-800) / <alpha-value>)',
    900: 'rgb(var(--color-primary-900) / <alpha-value>)',
    950: 'rgb(var(--color-primary-950) / <alpha-value>)',
    DEFAULT: 'rgb(var(--color-primary-DEFAULT) / <alpha-value>)'
  }
}