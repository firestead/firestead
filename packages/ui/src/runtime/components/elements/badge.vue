<template>
    <span :class="theme('badge', {
        size: size,
        rounded: rounded
    })" 
    v-bind="omit($attrs, ['class'])">
      <slot>{{ label }}</slot>
    </span>
  </template>
<script setup lang="ts">
    import { createTheme, badgeTheme, tailwindColors, type PropType, computed } from '#imports'
    import type { BadgeConfig, Badge, TailwindColors } from '#theme'
    import { omit } from '../../utils/omit'

    defineOptions({
        inheritAttrs: false
    })

    const props = defineProps({
        size: {
            type: String as PropType<keyof BadgeConfig['options']['size']>,
            default: () => badgeTheme.default.presets.size,
            validator (value: string) {
                return Object.keys(badgeTheme.default.options.size).includes(value)
            }
        },
        rounded: {
            type: String as PropType<keyof BadgeConfig['options']['rounded']>,
            default: () => badgeTheme.default.presets.rounded,
            validator (value: string) {
                return Object.keys(badgeTheme.default.options.rounded).includes(value)
            }
        },
        color: {
            type: String as PropType<TailwindColors>,
            default: badgeTheme.default.presets.color,
            validator (value: string) {
                return [...tailwindColors].includes(value)
            }
        },
        variant: {
            type: String as PropType<Badge['variants']>,
            default: () => null,
            validator (value: string) {
                return [
                    ...Object.keys(badgeTheme.default.variants),
                ].includes(value)
            }
        },
        label: {
            type: [String, Number],
            default: null
        },
        ui: {
            type: Object as PropType<Partial<BadgeConfig['base']>>,
            default: undefined
        }
    })

    const theme = computed(() => createTheme<Badge>(badgeTheme, {
        variant: props.variant,
        overwrite: props.ui,
        extractors: {
            color: props.color
        }
    }))
</script>