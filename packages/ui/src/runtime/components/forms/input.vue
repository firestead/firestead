<template>
  <div :class="theme('wrapper', {}, $attrs.class)">
    <input
      ref="input"
      :name="name || fieldContext?.name"
      :value="modelValue || fieldContext?.value.value"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :disabled="disabled || loading"
      :class="theme('input',{
        size: size,
        rounded: rounded,
        padding: padded ? size : 'none',
        leadingPadding: (isLeading || $slots.leading) ? size : 'none',
        trailingPadding: (isTrailing || $slots.trailing) ? size : 'none',
        errorInput: transformBoolean(!fieldContext?.valid.value || false)
      }, props.inputClass)"
      v-bind="omit($attrs, ['class'])"
      @input="onInput"
      @blur="onBlur"
    >
    <slot />

    <span 
      v-if="(isLeading && leadingIconName) || $slots.leading" 
      :class="theme('wrapperIcon',{
        leadingPaddingIcon: size
      })">
      <slot name="leading" :disabled="disabled" :loading="loading">
        <FsIcon 
          :name="leadingIconName" 
          :class="theme('icon',{
            iconSize: size,
            loading: loading ? 'true' : 'false',
            errorIcon: transformBoolean(!fieldContext?.valid.value || false)
          })" />
      </slot>
    </span>

    <span 
      v-if="(isTrailing && trailingIconName) || $slots.trailing" 
      :class="theme('wrapperIcon',{
        trailingPaddingIcon: size  
      })">
      <slot name="trailing" :disabled="disabled" :loading="loading">
        <FsIcon :name="trailingIconName" :class="theme('icon',{
            iconSize: size,
            loading: loading && !isLeading ? 'true' : 'false',
          })" />
      </slot>
    </span>
  </div>
</template>
<script setup lang="ts">
  import { createTheme, inputTheme, tailwindColors, type PropType, computed, inject } from '#imports'
  import { omit } from '../../utils/omit'
  import { transformBoolean } from '../../utils/transformBoolean'
  import FsIcon from '../elements/icon.vue'
  import type { InputConfig, Input, TailwindColors  } from '#theme'
  import type { FielContext, FieldEmits } from '../../types/field'

  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    loadingIcon: {
      type: String,
      default: () => inputTheme.default.presets.loadingIcon
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
    loading: {
      type: Boolean,
      default: false
    },
    padded: {
      type: Boolean,
      default: true
    },
    size: {
      type: String as PropType<keyof InputConfig['options']['size']>,
      default: () => inputTheme.default.presets.size,
      validator (value: string) {
        return Object.keys(inputTheme.default.options.size).includes(value)
      }
    },
    rounded: {
      type: String as PropType<keyof InputConfig['options']['rounded']>,
      default: () => inputTheme.default.presets.rounded,
      validator (value: string) {
        return Object.keys(inputTheme.default.options.rounded).includes(value)
      }
    },
    color: {
      type: String as PropType<TailwindColors>,
      default: inputTheme.default.presets.color,
      validator (value: string) {
        return [...tailwindColors].includes(value)
      }
    },
    variant: {
      type: String as PropType<Input['variants']>,
      default: () => null,
      validator (value: string) {
        return [
          ...Object.keys(inputTheme.default.variants),
        ].includes(value)
      }
    },
    inputClass: {
      type: String,
      default: null
    },
    ui: {
      type: Object as PropType<Partial<InputConfig['base']>>,
      default: undefined
    }
  })

  defineOptions({
    inheritAttrs: false
  })
  
  const emit = defineEmits<FieldEmits>()

  const fieldContext = inject<FielContext | null>('fs-field-context', null)

  const theme = computed(() => createTheme<Input>(inputTheme, {
      variant: props.variant,
      overwrite: props.ui,
      extractors: {
          color: props.color
      }
  }))

  const input = ref<HTMLInputElement | null>(null)

  const autoFocus = () => {
    if (props.autofocus) {
      input.value?.focus()
    }
  }

  const onInput = (event: Event) => {
    if(fieldContext){
      fieldContext.updateValue((event.target as HTMLInputElement).value)
    }
    emit('update:modelValue', (event.target as HTMLInputElement).value)
  }

  const onBlur = (event: FocusEvent) => {
    //emitFormBlur()
    emit('blur', event)
  }

  onMounted(() => {
    setTimeout(() => {
      autoFocus()
    }, 100)
  })

  const isLeading = computed(() => {
    return (props.icon && props.leading) || (props.icon && !props.trailing) || (props.loading && !props.trailing) || props.leadingIcon
  })

  const isTrailing = computed(() => {
    return (props.icon && props.trailing) || (props.loading && props.trailing) || props.trailingIcon
  })

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
</script>