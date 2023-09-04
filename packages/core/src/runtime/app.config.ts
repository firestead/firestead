import { defineAppConfig } from '#imports'
import type { ButtonConfig, ButtonGroupConfig } from '#theme'

export default defineAppConfig({
  title: 'My Firestead App',
  ui: {
    colors: {
      primary: 'stone',
    },
    availableColors: [],
    defaults: {
      button: {
        color: 'primary',
        loadingIcon: 'i-heroicons-arrow-path-20-solid',
        size: 'md',
        rounded: 'md',
        shadow: 'none'
      },
      buttonGroup: {
        size: 'md',
        rounded: 'md',
        shadow: 'none'
      }
    }
  }
})

type Ui = {
  colors?: {
    primary?: string
  }
  availableColors?: string[]
  defaults?: {
    button?: {
      color?: string
      loadingIcon?: string
      size?: keyof ButtonConfig['options']['size']
      rounded?: keyof ButtonConfig['options']['rounded']
      shadow?: keyof ButtonConfig['options']['shadow']
    },
    buttonGroup?: {
      size?: keyof ButtonConfig['options']['size']
      rounded?: keyof ButtonConfig['options']['rounded']
      shadow?: keyof ButtonGroupConfig['options']['shadow']
    }
  }
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /** Project name */
    title?: string
    /** Project ui options */
    ui?: Ui
  }
}
