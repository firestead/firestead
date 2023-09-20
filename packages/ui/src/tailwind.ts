/**
 * Based on https://github.com/nuxtlabs/ui
 */
import type { Nuxt } from '@nuxt/schema'
import type { Config } from 'tailwindcss'
import { defaultExtractor as createDefaultExtractor } from 'tailwindcss/lib/lib/defaultExtractor'
import { omit, kebabCase, upperFirst, camelCase } from 'lodash-es'
import defaultColors from 'tailwindcss/colors.js'
import { iconsPlugin, getIconCollections } from '@egoist/tailwindcss-icons'

//To get rid of warning messages of deprecated colors
delete defaultColors.lightBlue
delete defaultColors.warmGray
delete defaultColors.trueGray
delete defaultColors.coolGray
delete defaultColors.blueGray

const colorsToExclude = [
  'inherit',
  'transparent',
  'current'
]

const safelistByComponent = {
  input: (colorsAsRegex: string) => [{
    pattern: new RegExp(`text-(${colorsAsRegex})-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-500`)
  },{
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`),
    variants: ['focus']
  },{
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['focus', 'dark']
  }],
  avatar: (colorsAsRegex: string) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex})-400`),
    variants: ['dark']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-500`)
  }],
  badge: (colorsAsRegex: string) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex})-50`),
    variants: []
  },{
    pattern: new RegExp(`bg-(${colorsAsRegex})-500`),
    variants: []
  },{
    pattern: new RegExp(`bg-(${colorsAsRegex})-400`),
    variants: ['dark']
  },{
    pattern: new RegExp(`text-(${colorsAsRegex})-500`),
    variants: []
  },{
    pattern: new RegExp(`text-(${colorsAsRegex})-400`),
    variants: ['dark']
  },{
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`),
    variants: []
  },{
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['dark']
  }],
  button: (colorsAsRegex: string) => [{
    pattern: new RegExp(`bg-(${colorsAsRegex})-50`),
    variants: ['hover', 'disabled']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-100`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-200`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-400`),
    variants: ['dark', 'dark:disabled']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-500`),
    variants: ['disabled', 'dark:hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-600`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-800`),
    variants: ['dark:hover']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-900`),
    variants: ['dark:hover','dark']
  }, {
    pattern: new RegExp(`bg-(${colorsAsRegex})-950`),
    variants: ['dark', 'dark:hover', 'dark:disabled']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-400`),
    variants: ['dark', 'dark:disabled']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-500`),
    variants: ['dark:hover', 'disabled']
  }, {
    pattern: new RegExp(`text-(${colorsAsRegex})-600`),
    variants: ['hover']
  }, {
    pattern: new RegExp(`outline-(${colorsAsRegex})-400`),
    variants: ['dark:focus-visible']
  }, {
    pattern: new RegExp(`outline-(${colorsAsRegex})-500`),
    variants: ['focus-visible']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-400`),
    variants: ['dark:focus-visible']
  }, {
    pattern: new RegExp(`ring-(${colorsAsRegex})-500`),
    variants: ['focus-visible']
  }]
}

type SafelistByComponent = typeof safelistByComponent

const colorsAsRegex = (colors: string[]): string => colors.join('|')

const excludeColors = (colors: object): string[] => {
  return Object.entries(omit(colors, colorsToExclude))
    .filter(([, value]) => typeof value === 'object')
    .map(([key]) => kebabCase(key))
}

const generateSafelist = (colors: string[], globalColors: any) => {
  return [
    ...safelistByComponent['button'](colorsAsRegex(colors))
  ]
}

export function initTailwind(nuxt: Nuxt, options: any, tailwindConfig: Partial<Config>) {
    const globalColors: any = {
        ...(tailwindConfig.theme?.colors || defaultColors),
        ...tailwindConfig.theme?.extend?.colors
      }

      tailwindConfig!.theme!.extend!.colors = tailwindConfig?.theme?.extend?.colors || {}

      // @ts-ignore
      globalColors.primary = tailwindConfig!.theme!.extend!.colors.primary = {
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

      const colors = excludeColors(globalColors)

      nuxt.options.appConfig.ui = {
        ...nuxt.options.appConfig?.ui || {},
        colors: {
          primary: 'yellow',
        },
        availableColors: colors
      }

      tailwindConfig.safelist = tailwindConfig.safelist || []
      tailwindConfig.safelist.push(...generateSafelist(options?.ui?.safelistColors || [], colors))

      tailwindConfig.plugins = tailwindConfig.plugins || []
      tailwindConfig.plugins.push(iconsPlugin({ 
        collections: getIconCollections(options.ui.icons as any[]) 
      }))
}

export const defaultExtractor = createDefaultExtractor({ tailwindConfig: { separator: ':' } })

export const customSafelistExtractor = (prefix: string, content: string, colors: string[], safelistColors: string[]) => {
  const classes = []
  const regex = /<([A-Za-z][A-Za-z0-9]*(?:-[A-Za-z][A-Za-z0-9]*)*)\s+(?![^>]*:color\b)[^>]*\bcolor=["']([^"']+)["'][^>]*>/gs

  const matches = content.matchAll(regex)

  for (const match of matches) {
    const [, component, color] = match

    const camelComponent = upperFirst(camelCase(component))

    if (!colors.includes(color) || safelistColors.includes(color)) {
      continue
    }

    const name = camelComponent.replace(prefix, '').toLowerCase() as keyof SafelistByComponent

    const matchClasses = safelistByComponent[name](color).flatMap(group => {
      return ['', ...(group.variants || [])].flatMap(variant => {
        const matches = group.pattern.source.match(/\(([^)]+)\)/g) || []

        return matches.map(match => {
          const colorOptions = match.substring(1, match.length - 1).split('|')
          return colorOptions.map(color => `${variant ? variant + ':' : ''}` + group.pattern.source.replace(match, color))
        }).flat()
      })
    })

    classes.push(...matchClasses)
  }

  return classes
}