<template>
  <component
    :is="as"
    :for="props.for"
    :class="classes('label', { 
        labelDisabled: transformBoolean(props.disabled) 
    })"
  >
    <slot name="before" />
    <slot>
      <span
        v-if="safe"
        v-html="label"
      />
      <span
        v-else
        v-text="label"
      />
    </slot>
    <slot name="after" />
  </component>
</template>
<script setup lang="ts">
    import type { Field } from '#theme'
    import { createTheme, fieldTheme } from '#imports'
    import { transformBoolean } from '../../../utils/transformBoolean'

    type Props = {
        label: string
        disabled?: boolean
        for?: string | undefined
        safe?: boolean
        as?: string
    }

    const props = withDefaults(defineProps<Props>(),{
        disabled: false,
        for: undefined,
        safe: true,
        as: 'label'
    })

    defineOptions({
      inheritAttrs: true
    })

    const classes = createTheme<Field>(fieldTheme)
</script>