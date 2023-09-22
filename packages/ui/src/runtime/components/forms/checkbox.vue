<template>
    <div :class="theme('wrapper', {}, $attrs.class)">
        <div class="flex items-center h-5">
            <input
                :id="name"
                v-model="toggle"
                :name="name"
                :required="required"
                :value="value || fieldContext?.value.value"
                :disabled="disabled"
                :checked="checked"
                :indeterminate="indeterminate"
                type="checkbox"
                class="form-checkbox"
                :class="theme('checkbox',{
                    rounded: rounded,
                }, inputClass)"
                v-bind="omit($attrs, ['class'])"
                @change="onChange"
            >
        </div>
        <div v-if="label || $slots.label" class="ms-3 text-sm">
            <label :for="name" :class="theme('label')">
                <slot name="label">{{ label }}</slot>
                <span v-if="required" :class="theme('required')">*</span>
            </label>
            <p v-if="help" :class="theme('help')">
                {{ help }}
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
    import { twMerge } from 'tailwind-merge'
    import { createTheme, checkboxTheme, PropType, computed, inject, type Ref } from '#imports'
    import { omit } from '../../utils/omit'
    import type { CheckboxConfig, Checkbox  } from '#theme'
    import type { TailwindColors } from '../../types'
    import type { FielContext, FieldEmits } from '../../types/field'

    // TODO: Remove, nuxt-theming should support presets and overwrite by app.config
    // @ts-ignore
    import appConfig from '#build/app.config'

    const props = defineProps({
        value: {
            type: [String, Number, Boolean, Object],
            default: null
        },
        modelValue: {
            type: [Boolean, Array],
            default: null
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        },
        checked: {
            type: Boolean,
            default: false
        },
        indeterminate: {
            type: Boolean,
            default: false
        },
        help: {
            type: String,
            default: null
        },
        label: {
            type: String,
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        color: {
            type: String as PropType<TailwindColors>,
            default: checkboxTheme.default.presets.color,
            validator (value: string) {
                return [...appConfig.ui.availableColors].includes(value)
            }
        },
        rounded: {
            type: String as PropType<keyof CheckboxConfig['options']['rounded']>,
            default: () => checkboxTheme.default.presets.rounded,
            validator (value: string) {
                return Object.keys(checkboxTheme.default.options.rounded).includes(value)
            }
        },
        inputClass: {
            type: String,
            default: ''
        },
        ui: {
            type: Object as PropType<Partial<CheckboxConfig['base']>>,
            default: undefined
        }
    })

    defineOptions({
        inheritAttrs: false
    })
  
    const emit = defineEmits<FieldEmits>()

    const fieldContext = inject<FielContext | null>('fs-field-context', null)

    const theme = computed(() => createTheme<Checkbox>(checkboxTheme, {
        overwrite: props.ui,
        params: {
            color: fieldContext?.valid?.value ? props.color : 'red'
        },
        merge: twMerge
    }))

    const toggle = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        if(fieldContext){
            fieldContext.updateValue(value)
        }
        emit('update:modelValue', value)
      }
    })

    const onChange = (event: Event) => {
        emit('change', event)
    }
</script>