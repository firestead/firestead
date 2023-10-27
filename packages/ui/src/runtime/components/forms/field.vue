<template>
    <div 
        :class="theme('wrapper', {}, $attrs.class)" 
        v-bind="omit($attrs, ['class'])">
        <div 
            v-if="label || $slots.label" 
            :class="theme('labelWrapper', {
                size: size
            })">
            <label 
                :for="name" 
                :class="theme('label', {
                    required: transformBoolean(required)
                })">
                <slot v-if="$slots.label" name="label" v-bind="{ errors, label, name, hint, description, help }" />
                <template v-else>{{ label }}</template>
            </label>
            <span 
                v-if="hint || $slots.hint" 
                :class="theme('hint')">
                <slot v-if="$slots.hint" name="hint" v-bind="{ errors, label, name, hint, description, help }" />
                <template v-else>{{ hint }}</template>
            </span>
        </div>
        <p 
            v-if="description || $slots.description" 
            :class="theme('description', {
                size: size
            })">
            <slot v-if="$slots.description" name="description" v-bind="{ errors, label, name, hint, description, help }" />
            <template v-else>{{ description }}</template>
        </p>
        <div :class="[label ? theme('container') : '']">
            <slot :errors="errors" :valid="valid" :value="value" :update-value="updateValue" />
            <p 
                v-if="errors.length > 0 || $slots.error" 
                :class="theme('error', {
                    size: size
                })">
                <slot v-if="$slots.error" name="error" v-bind="{ errors, label, name, hint, description, help }" />
                <template v-else>
                    {{ errors[0] }}
                </template>
            </p>
            <p 
                v-else-if="help || $slots.help" 
                :class="theme('help', {
                    size: size
                })">
                <slot v-if="$slots.help" name="help" v-bind="{ errors, label, name, hint, description, help }" />
                <template v-else>
                    {{ help }}
                </template>
            </p>
        </div>
    </div>
  </template>
  <script setup lang="ts">
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
      overwrite: props.ui
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
  