<template>
    <span 
        :class="theme('wrapper', {
            background: transformBoolean(error || !url),
            size: size,
            rounded: rounded
        }, $attrs?.class)"
    >
        <img
            v-if="url && !error"
            :class="theme('image', {
                size: size,
                rounded: rounded
            }, imgClass)"
            :alt="alt"
            :src="url"
            v-bind="omit($attrs, ['class'])"
            @error="onError"
        >
        <span v-else-if="text" :class="theme('text')">{{ text }}</span>
        <FsIcon v-else-if="icon" :name="icon" :class="theme('icon', {
            iconSize: size
        })" />
        <span v-else-if="placeholder" :class="theme('placeholder')">{{ placeholder }}</span>
        <span v-if="chipColor" :class="theme('chip', {
            chipSize: size,
            chipPosition: chipPosition,
            chipBackground: transformBoolean(chipColor? true : false)
        })">
            {{ chipText }}
        </span>
        <slot />
    </span>
</template>
<script setup lang="ts">
    import { createTheme, avatarTheme, PropType } from '#imports'
    import type { AvatarConfig, Avatar as AvatarType  } from '#theme'
    import { twMerge } from 'tailwind-merge'
    import { transformBoolean } from '../../utils/transformBoolean'
    import { omit } from '../../utils/omit'
    import FsIcon from './icon.vue'
    import type { TailwindColors } from '../../types'
    // TODO: Remove
    // @ts-ignore
    import appConfig from '#build/app.config'

    defineOptions({
        inheritAttrs: false
    })

    const props = defineProps({
        src: {
            type: [String, Boolean],
            default: null
        },
        alt: {
            type: String,
            default: null
        },
        text: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: () => appConfig.ui.defaults.avatar.icon
        },
        size: {
            type: String as PropType<keyof AvatarConfig['options']['size']>,
            default: () => appConfig.ui.defaults.avatar.size,
            validator (value: string) {
                return Object.keys(avatarTheme.default.options.size).includes(value)
            }
        },
        rounded: {
            type: String as PropType<keyof AvatarConfig['options']['rounded']>,
            default: () => appConfig.ui.defaults.avatar.rounded,
            validator (value: string) {
                return Object.keys(avatarTheme.default.options.rounded).includes(value)
            }
        },
        chipColor: {
            type: String as PropType<TailwindColors>,
            default: () => appConfig.ui.defaults.avatar.chipColor,
            validator (value: string) {
                return [...appConfig.ui.availableColors].includes(value)
            }
        },
        chipPosition: {
            type: String as PropType<keyof AvatarConfig['options']['chipPosition']>,
            default: () => appConfig.ui.defaults.avatar.chipPosition,
            validator (value: string) {
                return Object.keys(avatarTheme.default.options.chipPosition).includes(value)
            }
        },
        chipText: {
            type: [String, Number],
            default: null
        },
        imgClass: {
            type: String,
            default: ''
        },
        ui: {
            type: Object as PropType<Partial<AvatarConfig['base']>>,
            default: undefined
        }
    })

    const theme = computed(() => createTheme<AvatarType>(avatarTheme, {
        overwrite: props.ui,
        params: {
          color: props.chipColor
        },
        merge: twMerge
    }))

    const url = computed(() => {
      if (typeof props.src === 'boolean') {
        return null
      }
      return props.src
    })

    const error = ref(false)

    const placeholder = computed(() => {
      return (props.alt || '').split(' ').map(word => word.charAt(0)).join('').substring(0, 2)
    })

    function onError () {
      error.value = true
    }
</script>