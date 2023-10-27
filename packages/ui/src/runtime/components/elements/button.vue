<template>
  <FsLink 
    v-bind="omit($attrs, ['class'])"
    :type="type" 
    :class="theme('button', {
      size: size,
      gap: size,
      rounded: (!roundedStart && !roundedEnd) ? rounded : 'none',
      roundedStart: roundedStart ? rounded : 'none',
      roundedEnd: roundedEnd ? rounded : 'none',
      padding: props.padded ? size : undefined,
      square: isSquare ? size : undefined,
      loading: transformBoolean(loading),
      block: transformBoolean(block),
    }, $attrs.class)"
    :disabled="disabled"
  >
    <slot name="leading" :disabled="disabled" :loading="loading">
      <FsIcon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="theme('icon',{
        iconSize: size,
        iconLoading: loading && isLeading ? 'true' : 'false', 
      })" aria-hidden="true" />
    </slot>

    <slot>
      <span v-if="label" :class="theme('label', {
        truncate: transformBoolean(truncate)
      })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :disabled="disabled" :loading="loading">
      <FsIcon 
        v-if="isTrailing && trailingIconName" 
        :name="trailingIconName" 
        :class="theme('icon',{
          iconSize: size,
          iconLoading: transformBoolean(loading), 
        })" aria-hidden="true" />
    </slot>
  </FsLink>
</template>
<script setup lang="ts">
  import type { ComponentPublicInstance, Ref } from 'vue'
  import { onMounted, ref, computed, useSlots } from 'vue'
  import { transformBoolean } from '../../utils/transformBoolean'
  import { omit } from '../../utils/omit'
  import FsIcon from './icon.vue'
  import FsLink from './link.vue'
  import { createTheme, buttonTheme, tailwindColors, type PropType } from '#imports'
  import type { ButtonConfig, Button, TailwindColors } from '#theme'

  const props = defineProps({
    type: {
      type: String,
      default: 'button'
    },
    block: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    focusOnMount: {
      type: Boolean,
      default: false
    },
    shadow: {
      type: String as PropType<keyof ButtonConfig['options']['shadow']>,
      default: () => buttonTheme.default.presets.shadow,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.shadow).includes(value)
      }
    },
    rounded: {
      type: String as PropType<keyof ButtonConfig['options']['rounded']>,
      default: () => buttonTheme.default.presets.rounded,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.rounded).includes(value)
      }
    },
    roundedStart: {
      type: Boolean,
      default: false
    },
    roundedEnd: {
      type: Boolean,
      default: false
    },
    size: {
      type: String as PropType<keyof ButtonConfig['options']['size']>,
      default: () => buttonTheme.default.presets.size,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.size).includes(value)
      }
    },
    color: {
      type: String as PropType<TailwindColors>,
      default: buttonTheme.default.presets.color,
      validator (value: string) {
        return [...tailwindColors].includes(value)
      }
    },
    variant: {
      type: String as PropType<Button['variants']>,
      default: () => null,
      validator (value: string) {
        return [
          ...Object.keys(buttonTheme.default.variants),
        ].includes(value)
      }
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => buttonTheme.default.presets.loadingIcon
    },
    leadingIcon: {
      type: String,
      default: null
    },
    trailingIcon: {
      type: String,
      default: null
    },
    trailing: {
      type: Boolean,
      default: false
    },
    leading: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    },
    truncate: {
      type: Boolean,
      default: false
    },
    ui: {
      type: Object as PropType<Partial<ButtonConfig['base']>>,
      default: undefined
    }
  })

  defineOptions({
    inheritAttrs: false
  })

  const root = ref(null) as Ref<ComponentPublicInstance<HTMLInputElement> | null>

  const theme = computed(() => createTheme<Button>(buttonTheme, {
      variant: props.variant,
      overwrite: props.ui,
      extractors: {
          color: props.color
      }
  }))

  const slots = useSlots()

  const isLeading = computed(() => {
    return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
  })

  const isTrailing = computed(() => {
    return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
  })

  const isSquare = computed(() => props.square || (!slots.default && !props.label))

  const leadingIconName = computed(() => {
      if (props.loading) {
        return props.loadingIcon
      }

      return props.leadingIcon || props.icon
    })

    const trailingIconName = computed(() => {
      if (props.loading && !isLeading.value) {
        return props.loadingIcon
      }

      return props.trailingIcon || props.icon
    })
  
  // Focus on mount, (useful for modals )
  onMounted(() => {
    if (props.focusOnMount) {
        try {
            root?.value?.focus()
        }
        catch (e) {
            root?.value?.$el?.focus()
        }
    }
  })
</script>