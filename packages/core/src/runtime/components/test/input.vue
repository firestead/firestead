<!--
    This components shows how to integrate a custom input component with nuxt-forms based on the vanilla-components Input component
    TODO: impement with @nuxt/ui and latest version of nuxt-forms
-->
<template>
    <Input
         v-bind="{...props, ...$attrs}" 
         :errors="errors.length > 0 ? errors[0] : undefined" 
         v-model="value" 
         @update:modelValue="(val: string) => updateValue(val)">
         <template #before="slotProps">
             <slot name="before" v-bind="slotProps || {}"></slot>
         </template>
         <template #after="slotProps">
             <slot name="after" v-bind="slotProps || {}"></slot>
         </template>
         <template #feedback="slotProps">
             <slot name="feedback" v-bind="slotProps || {}"></slot>
         </template>
         <template #errors="slotProps">
             <slot name="errors" v-bind="slotProps || {}"></slot>
         </template>
 </Input>
</template>
<script setup lang="ts">
 import type {
     Input
 } from '@flavorly/vanilla-components'
 import type { ValidationRule } from 'nuxt-forms/types'
 import type { ZodTypeAny } from 'zod'

 type InputEmits = {
     (eventName: 'update:modelValue', value: object): void
 }

 type InputProps = InstanceType<typeof Input>["$props"];
 
 interface Props extends InputProps {
     name?: string
     label?: string
     modelValue?: any
     schema?: ZodTypeAny
     validateOnChange?: boolean
     rules?: (ValidationRule | (() => ValidationRule))[]
 }

 const emits = defineEmits<InputEmits>()

 const props = withDefaults(defineProps<Props>(), {
     name: '',
     label: '',
     validateOnChange: false,
     modelValue: null
 })

 const { errors, value, updateValue } = useField(props.name, {
     initialData: props.modelValue,
     schema: props.schema,
     rules: props.rules,
     validateOnChange: props.validateOnChange,
     label: props.label,
     onValidate: (value) => {
         emits('update:modelValue', value)
     }
 })

</script>