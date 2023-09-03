<template>
    <div
        v-if="text"
        :class="classes('feedback')"
        @click="clicked"
    >
        <span
            v-if="safe"
            v-html="text"
        />
        <span v-else>{{ text }}</span>
  </div>
</template>
<script setup lang="ts">
    import type { Field } from '#theme'
    import { createTheme, fieldTheme } from '#imports'

    type Props = {
        text: string | undefined
        safe?: boolean
    }

    withDefaults(defineProps<Props>(),{
        safe: true
    })

    defineOptions({
      inheritAttrs: true
    })

    const emit = defineEmits(['feedbackClick', 'click'])

    const classes = createTheme<Field>(fieldTheme)

    const clicked = () => {
        emit('feedbackClick', true)
        emit('click', true)
    }
</script>