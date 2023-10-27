/**
 * Colors plugin
 * Injects CSS variables for primary colors
 * based on https://github.com/nuxtlabs/ui/blob/dev/src/runtime/plugins/colors.ts
 */
import { computed } from 'vue'
import { hexToRgb } from '../utils/hexToRgb'
import { defineNuxtPlugin, useAppConfig, useHead } from '#imports'
import colors from '#tailwind-config/theme/colors'

export default defineNuxtPlugin((nuxtApp) => {
  const appConfig = useAppConfig()

  const root = computed(() => {
    const primary: Record<string, string> | undefined = colors[appConfig.ui.color]

    if (!primary) {
      console.warn(`[firestead] Primary color '${appConfig.ui.color}' not found in Tailwind config`)
    }

    return `:root {
${Object.entries(primary || colors.orange).map(([key, value]) => `--color-primary-${key}: ${hexToRgb(value)};`).join('\n')}
--color-primary-DEFAULT: var(--color-primary-500);
}

.dark {
  --color-primary-DEFAULT: var(--color-primary-400);
}
`
  })

  // Head
  const headData: any = {
    style: [{
      innerHTML: () => root.value,
      tagPriority: -2,
      id: 'firestead-ui-colors'
    }]
  }

  // SPA mode
  if (process.client && nuxtApp.isHydrating && !nuxtApp.payload.serverRendered) {
    const style = document.createElement('style')

    style.innerHTML = root.value
    style.setAttribute('data-firestead-ui-colors', '')
    document.head.appendChild(style)

    headData.script = [{
      innerHTML: 'document.head.removeChild(document.querySelector(\'[data-firestead-ui-colors]\'))'
    }]
  }

  useHead(headData)
})