import { defineAppConfig } from '#imports'

export default defineAppConfig({
  title: 'My Firestead App'
})

declare module '@nuxt/schema' {
  interface AppConfigInput {
    /** Project name */
    title?: string
  }
}
