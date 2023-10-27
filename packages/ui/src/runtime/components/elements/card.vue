
<template>
    <component
      :is="$attrs.onSubmit ? 'FsForm' : as"
      :class="theme('card', {}, $attrs.class)"
      v-bind="omit($attrs, ['class'])"
    >
        <div v-if="$slots.header" :class="theme('header')">
            <slot name="header" />
        </div>
        <div :class="theme('body')">
            <slot />
        </div>
        <div v-if="$slots.footer" :class="theme('footer')">
            <slot name="footer" />
        </div>
    </component>
</template>
<script setup lang="ts">
    import { createTheme, cardTheme, type PropType, computed } from '#imports'
    import { omit } from '../../utils/omit'
    import type { CardConfig, Card  } from '#theme'

    const props = defineProps({
        as: {
            type: String,
            default: 'div'
        },
        ui: {
            type: Object as PropType<Partial<CardConfig['base']>>,
            default: undefined
        }
    })

    defineOptions({
        inheritAttrs: false
    })

    const theme = computed(() => createTheme<Card>(cardTheme, {
        overwrite: props.ui
    }))
</script>