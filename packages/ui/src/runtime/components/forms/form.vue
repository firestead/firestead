<template>
    <form @submit.prevent="onSubmit">
      <slot
        :reset="reset"
        :valid="valid"
        :updated="updated"
        :errors="errors"
      />
    </form>
  </template>
  <script setup lang="ts">
  import { useForm } from '#imports'
  import type { ValidatorAdapter, ValidationType } from 'nuxt-forms/dist/runtime/types'
  
  export type FormEmits = {
      (eventName: 'update:modelValue', value: object): void
      (eventName: 'submit', result: any): void
  }
  
  export type FormProps = {
    modelValue?: any
    clearOnSubmit?: boolean
    validate?: ValidatorAdapter<ValidationType> | ValidatorAdapter<ValidationType>[] | undefined
  }
  
  const props = withDefaults(defineProps<FormProps>(), {
    modelValue: null,
    validate: undefined,
    clearOnSubmit: false
  })
  
  const emits = defineEmits<FormEmits>()
  
  const { handleSubmit, reset, valid, errors, updated } = useForm({
    initialData: props.modelValue,
    clearOnSubmit: props.clearOnSubmit,
    validate: props.validate
  })
  
  const onSubmit = async () => {
    const result = await handleSubmit()
    if (props.modelValue) {
      emits('update:modelValue', result.value)
    }
    emits('submit', result)
  }
  </script>  