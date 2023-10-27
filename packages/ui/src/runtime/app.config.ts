import { defineAppConfig } from '#imports'
import type { TailwindColors } from '#theme'

export default defineAppConfig({
  title: 'My Firestead App',
  ui: {
    color: 'orange'
  }
})

type Ui = {
  color: TailwindColors,
}

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /** Project name */
    title?: string
    /** Project ui options */
    ui?: Ui
  }
}
