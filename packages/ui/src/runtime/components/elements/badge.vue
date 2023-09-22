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
    import type { TailwindColors } from '../../types'
    import { createTheme, badgeTheme, type PropType, computed } from '#imports'
    import type { BadgeConfig, Badge  } from '#theme'
    import { twMerge } from 'tailwind-merge'
    import { omit } from '../../utils/omit'
      // TODO: Remove
      // @ts-ignore
    import appConfig from '#build/app.config'

    defineOptions({
        inheritAttrs: false
    })

    const props = defineProps({
        size: {
            type: String as PropType<keyof BadgeConfig['options']['size']>,
            default: () => appConfig.ui.defaults.badge.size,
            validator (value: string) {
                return Object.keys(badgeTheme.default.options.size).includes(value)
            }
        },
        rounded: {
            type: String as PropType<keyof BadgeConfig['options']['rounded']>,
            default: () => appConfig.ui.defaults.badge.rounded,
            validator (value: string) {
                return Object.keys(badgeTheme.default.options.rounded).includes(value)
            }
        },
        color: {
            type: String as PropType<TailwindColors>,
            default: appConfig.ui.defaults.badge.color,
            validator (value: string) {
                return [...appConfig.ui.availableColors].includes(value)
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
        params: {
            color: props.color
        },
        merge: twMerge
    }))
</script>