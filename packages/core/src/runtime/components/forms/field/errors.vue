<template>
  <div
    v-if="hasErrors"
    :class="classes('errors')"
  >
    <span
      v-if="safe"
      v-html="errors"
    />
    <span v-else>{{ errors }}</span>
  </div>
</template>
<script setup lang="ts">
    import type { ComputedRef } from 'vue'
    import type { Field } from '#theme'
    import { createTheme, fieldTheme } from '#imports'

    type Props = {
        errors: string | undefined
        safe?: boolean
    }

    const props = withDefaults(defineProps<Props>(),{
        errors: undefined,
        safe: true
    })

    defineOptions({
      inheritAttrs: true
    })

    const classes = createTheme<Field>(fieldTheme)

    const errors = ref<string | undefined>(props?.errors as string | undefined)

    const hasErrors = computed(() => errors?.value !== undefined && errors?.value !== null && errors?.value !== '') as ComputedRef<boolean>

    // If the actual errors changes, we will also update it
    watch(() => props?.errors, (newErrors: any) => {
        errors.value = newErrors
    })
</script>