<template>
  <kbd 
      :class="theme('wrapper', {
          size: size
      })" 
      v-bind="omit($attrs, ['class'])">
    <slot>{{ value }}</slot>
  </kbd>
</template>
<script setup lang="ts">
  import { computed } from 'vue'
  import { omit } from '../../utils/omit'
  import { twMerge } from 'tailwind-merge'
  import { createTheme, kbdTheme, PropType } from '#imports'
  import type { KbdConfig, Kbd  } from '#theme'
  // TODO: Remove
  // @ts-expect-error
  import appConfig from '#build/app.config'
  
  // const appConfig = useAppConfig()

  const props = defineProps({
    value: {
        type: String,
        default: null
      },
      size: {
        type: String as PropType<keyof KbdConfig['options']['size']>,
        default: () => appConfig.ui.defaults.kbd.size,
        validator (value: string) {
          return Object.keys(kbdTheme.default.options.size).includes(value)
        }
      },
      ui: {
        type: Object as PropType<Partial<KbdConfig['base']>>,
        default: undefined
      }
  })

  const theme = computed(() => createTheme<Kbd>(kbdTheme, {
      overwrite: props.ui,
      merge: twMerge
  }))
</script>