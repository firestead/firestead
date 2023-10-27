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
  import { createTheme, kbdTheme, type PropType } from '#imports'
  import type { KbdConfig, Kbd  } from '#theme'

  const props = defineProps({
    value: {
        type: String,
        default: null
      },
      size: {
        type: String as PropType<keyof KbdConfig['options']['size']>,
        default: () => kbdTheme.default.presets.size,
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
      overwrite: props.ui
  }))
</script>