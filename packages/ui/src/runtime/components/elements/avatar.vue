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
    import { createTheme, avatarTheme, type PropType, computed, tailwindColors } from '#imports'
    import type { AvatarConfig, Avatar, TailwindColors  } from '#theme'
    import { transformBoolean } from '../../utils/transformBoolean'
    import { omit } from '../../utils/omit'
    import FsIcon from './icon.vue'

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
            default: () => avatarTheme.default.presets.icon
        },
        size: {
            type: String as PropType<keyof AvatarConfig['options']['size']>,
            default: () => avatarTheme.default.presets.size,
            validator (value: string) {
                return Object.keys(avatarTheme.default.options.size).includes(value)
            }
        },
        rounded: {
            type: String as PropType<keyof AvatarConfig['options']['rounded']>,
            default: () => avatarTheme.default.presets.rounded,
            validator (value: string) {
                return Object.keys(avatarTheme.default.options.rounded).includes(value)
            }
        },
        chipColor: {
            type: String as PropType<TailwindColors>,
            default: () => avatarTheme.default.presets.chipColor,
            validator (value: string) {
                return [...tailwindColors].includes(value)
            }
        },
        chipPosition: {
            type: String as PropType<keyof AvatarConfig['options']['chipPosition']>,
            default: () => avatarTheme.default.presets.chipPosition,
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

    const theme = computed(() => createTheme<Avatar>(avatarTheme, {
        overwrite: props.ui,
        extractors: {
          color: props.chipColor
        }
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