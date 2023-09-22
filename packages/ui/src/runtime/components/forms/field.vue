<template>
    <div 
        :class="theme('wrapper', {}, $attrs.class)" 
        v-bind="omit($attrs, ['class'])">
        <div 
            v-if="label" 
            :class="theme('labelWrapper', {
                size: size
            })">
            <label 
                :for="name" 
                :class="theme('label', {
                    required: transformBoolean(required)
                })">{{ label }}</label>
            <span 
            v-if="hint" 
            :class="theme('hint')">{{ hint }}</span>
        </div>
        <p 
            v-if="description" 
            :class="theme('description', {
                size: size
            })">
            {{ description }}
        </p>
        <div :class="[label ? theme('container') : '']">
            <slot :errors="errors" :valid="valid" :value="value" :update-value="updateValue" />
            <p 
                v-if="errors.length > 0" 
                :class="theme('error', {
                    size: size
                })">
                {{ errors[0] }}
            </p>
            <p 
                v-else-if="help" 
                :class="theme('help', {
                    size: size
                })">
                {{ help }}
            </p>
        </div>
    </div>
  </template>
  <script setup lang="ts">
    import { twMerge } from 'tailwind-merge'
    import { useField, useFormContext, onBeforeUnmount, provide, createTheme, fieldTheme } from '#imports'
    import { omit } from '../../utils/omit'
    import { transformBoolean } from '../../utils/transformBoolean'
    import type { ValidatorAdapter, ValidationType } from 'nuxt-forms/dist/runtime/types'
    import type { FieldConfig, Field  } from '#theme'
  
    export type FieldProps = {
        name: string
        label?: string | null
        modelValue?: any
        validate?: ValidatorAdapter<ValidationType> | ValidatorAdapter<ValidationType>[] | undefined
        validateOnChange?: boolean | 'form' | 'field'
        bindFormData?: boolean
    }
  
    export type FieldEmits = {
        (eventName: 'update:modelValue', value: object): void
    }
  
  const emits = defineEmits<FieldEmits>()

  const props = defineProps({
        modelValue: {
            type: null,
            default: null
        },
        name: {
            type: String,
            required: true,
            default: null
        },
        size: {
            type: String as PropType<keyof FieldConfig['options']['size']>,
            default: () => fieldTheme.default.presets.size,
            validator (value: string) {
                return Object.keys(fieldTheme.default.options.size).includes(value)
            }
        },
        label: {
            type: String,
            default: null
        },
        description: {
            type: String,
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        help: {
            type: String,
            default: null
        },
        error: {
            type: [String, Boolean],
            default: null
        },
        hint: {
            type: String,
            default: null
        },
        validate: {
            type: [Object, Array] as PropType<ValidatorAdapter<ValidationType> | ValidatorAdapter<ValidationType>[] | undefined>,
            default: undefined
        },
        validateOnChange: {
            type: [Boolean, String] as PropType<boolean | 'form' | 'field'>,
            default: false
        },
        bindFormData: {
            type: Boolean,
            default: false
        },
        ui: {
            type: Object as PropType<Partial<FieldConfig['base']>>,
            default: undefined
        }
  })

  const theme = computed(() => createTheme<Field>(fieldTheme, {
      overwrite: props.ui,
      merge: twMerge
  }))
  
  const { valid, errors, value, updateValue, bindForm, unbindForm } = useField(props.name, {
    initialData: props.modelValue,
    validate: props.validate,
    validateOnChange: props.validateOnChange,
    bindFormData: props.bindFormData,
    label: props.label,
    onValidate: (value: any) => {
      emits('update:modelValue', value)
    }
  })

  provide('fs-field-context', {
    name: props.name,
    value,
    valid,
    updateValue
  })
  
  const form = useFormContext()
  
  bindForm(form)
  
  onBeforeUnmount(() => {
    unbindForm()
  })
  
  </script>
  