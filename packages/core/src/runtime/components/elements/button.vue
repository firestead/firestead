<template>
  <component
    v-bind="$attrs"
    :is="props.as"
    :class="theme('button', {
      size: props.size,
      rounded: props.rounded,
      loading: transformBoolean(props.loading),
      disabled: transformBoolean(props.disabled)
    })"
    :type="props.type"
    :disabled="props.disabled"
    @click="handleClickEvent"
  >
    <div
      :class="theme('container')"
    >
      <slot name="default">
        <!-- Loading Icon -->
        <LoadingIcon
          v-if="loading"             
          :class="theme('spinner')" />
        <!-- If not loading, show the user provided icon -->
        <span v-if="!loading && hasSlot($slots.icon)">
          <slot name="icon"></slot>
        </span>
        <!-- Actual button label -->
        <slot name="label">
          <span>
            {{ label }}
          </span>
        </slot>
      </slot>
    </div>
  </component>
</template>
<script setup lang="ts">
  import type { ComponentPublicInstance, Ref } from 'vue'
  import { onMounted, ref, computed } from 'vue'
  import { transformBoolean } from '../../utils/transformBoolean'
  import { hasSlot } from '../../utils/hasSlot'
  import LoadingIcon from '../icons/loading.vue'
  import { twMerge } from 'tailwind-merge'
  import { createTheme, buttonTheme } from '#imports'
  import type { ButtonConfig, Button, DeepPartial  } from '#theme'
  import type { TailwindColors } from '../../types'
  // TODO: Remove
  // @ts-expect-error
  import appConfig from '#build/app.config'

  export type Props = {
      as?: string
      type?: string
      variant?: Button['variants'] | null
      ui?: DeepPartial<ButtonConfig['base']>
      color?:  TailwindColors
      disabled?: boolean
      loading?: keyof ButtonConfig['options']['loading'] | boolean
      focusOnMount?: boolean
      size?: keyof ButtonConfig['options']['size']
      rounded?: keyof ButtonConfig['options']['rounded']
      label?: string
  }
  const props = withDefaults(defineProps<Props>(),{
      loading: false,
      disabled: false,
      focusOnMount: false,
      as: 'button',
      type: 'button',
      size: 'md',
      color: 'primary',
      label: 'Button',
      rounded: 'full',
      variant: null
  })

  defineOptions({
    inheritAttrs: true
  })

  const emit = defineEmits(['click'])
  const root = ref(null) as Ref<ComponentPublicInstance<HTMLInputElement> | null>

  const theme = computed(() => createTheme<Button>(buttonTheme, {
      variant: props.variant,
      overwrite: props.ui,
      params: {
          color: props.color
      },
      merge: twMerge
  }))

  // If it's disable, just ignore it
  const handleClickEvent = (event: MouseEvent) => {
      if (props.disabled || props.loading) {
          event.preventDefault()
          event.stopPropagation()
          return
      }
      emit('click', event)
  }
  
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