import { defineAppConfig } from '#imports'

export default defineAppConfig({
  title: 'My Firestead App',
  ui: {
    colors: {
      primary: 'stone',
    },
    availableColors: [],
    defaults: {
      button: {
        loadingIcon: 'i-heroicons-arrow-path-20-solid'
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
      loadingIcon?: string
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
