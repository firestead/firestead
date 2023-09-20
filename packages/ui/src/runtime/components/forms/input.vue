<template>
    <div>
      <div :class="classes('wrapper')">
        <!-- Before Input -->
        <div
          v-if="hasSlot($slots.before)"
          :class="classes('addonBefore')"
        >
          <slot
            name="before"
            v-bind="{ 
                className: classes('addonClasses')
            }"
          />
        </div>
        <!-- Input -->
        <input
          :id="name"
          ref="root"
          v-model="localValue"
          :name="name"
          :autocomplete="props.autocomplete"
          :placeholder="placeholder"
          :class="
          classes('input', {
            addonBeforeInput: transformBoolean(hasSlot($slots.before)),
            addonAfterInput: transformBoolean(hasSlot($slots.after)),
            rounded: props.rounded,
            disabled: transformBoolean(props.disabled)
          })"
          :disabled="disabled"
          :type="localType"
          v-bind="$attrs"
        >
        <!-- After Input -->
        <div
          v-if="hasSlot($slots.after) || hasErrors || (type === 'password' || props.copiable)"
          :class="configuration.classesList.addonAfter"
        >
          <slot
            name="after"
            v-bind="{ hasErrors, type, showingPassword, className: configuration.classesList.addonClasses }"
          >
            <ExclamationCircleIcon
              v-if="hasErrors && (type !== 'password' && !props.copiable)"
              :class="configuration.classesList.addonClasses"
            />
            <EyeIcon
              v-if="type === 'password' && !showingPassword"
              :class="configuration.classesList.addonClasses"
              @click="togglePassword"
            />
            <EyeSlashIcon
              v-if="showingPassword"
              :class="configuration.classesList.addonClasses"
              @click="togglePassword"
            />
            <ClipboardIcon
              v-show="props.copiable && !copied"
              :class="configuration.classesList.addonClasses"
              @click="copy(localValue)"
            />
            <CheckIcon
              v-show="props.copiable && copied"
              :class="configuration.classesList.addonClasses"
            />
          </slot>
        </div>
      </div>
      <slot
        name="errors"
        v-bind="{ hasErrors, errors }"
      >
        <FormErrors
          v-if="hasErrors && props.showErrors"
          :errors="errors"
        />
      </slot>
      <slot
        name="feedback"
        v-bind="{ hasErrors, feedback: props.feedback }"
      >
        <FormFeedback
          v-if="!hasErrors && props?.feedback && props.showFeedback"
          :text="props.feedback"
        />
      </slot>
    </div>
</template>
<script setup lang="ts">
    import type { ComponentPublicInstance, Ref } from 'vue'
    import { useTheme, inputTheme } from '#imports'
    import type { InputConfig, Input  } from '#theme'
    import { useClipboard } from '@vueuse/core'
    import { transformBoolean } from '../../utils/transformBoolean'
    import { hasSlot } from '../../utils/hasSlot'
    import FormFeedback from '../forms/field/feedback.vue'
    import FormErrors from '../forms/field/errors.vue'
    import Icon from '../icons/icon.vue'

    type Props = {
      type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'
      modelValue?: string | number | undefined
      variant?: Input['variants'] | null
      overwrite?: {
          base?: InputConfig['base']
          defaults?: InputConfig['defaults']
          variants?: InputConfig['variants']
          options?: {
              [P in keyof NonNullable<InputConfig["options"]>]: Record<keyof NonNullable<InputConfig["options"][P]>, string>
          }
      }
      placeholder?: string
      copiable?: boolean
      disabled?: boolean
      rounded?: keyof InputConfig['options']['rounded']
    }

    defineOptions({
        inheritAttrs: true
    })

    const props = withDefaults(defineProps<Props>(),{
        as: 'input',
        type: 'text',
        placeholder: '',
        copiable: false,
        disabled: false
    })

    const classes = useTheme('input')

    const root = ref(null)
</script>