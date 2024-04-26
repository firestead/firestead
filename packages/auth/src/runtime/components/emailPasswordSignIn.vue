<template>
    <FsForm 
        class="space-y-6"
        :state="state"
        :validateOn="['submit', 'input', 'change']"
        @submit="onSubmit" 
        :schema="schema">
          <FsFormGroup name="email" :label="t('auth.email')">
                <FsInput v-model="state.email" icon="i-heroicons-at-symbol" size="md" type="email" :placeholder="t('auth.email')"></FsInput>
          </FsFormGroup>

          <FsFormGroup name="password" :label="t('auth.password')">
                <FsInput v-model="state.password" icon="i-heroicons-key" size="md" type="password" :placeholder="t('auth.password')"></FsInput>
          </FsFormGroup>

          <div>
            <FsButton type="submit" :label="t('auth.signInButton')" block />
          </div>
    </FsForm>
</template>
<script setup lang="ts">
    import { type Input, objectAsync, string, email, minLength } from 'valibot'
    import type { FormError, FormSubmitEvent } from '#ui/types'
    import type { Locales } from '#build/locales'
    import { useI18n } from '#imports'

    const props = defineProps({
        terms: {
            type: Boolean,
            required: false,
        }
    })

    const state = reactive({
        email: undefined,
        password: undefined,
        terms: false
    })

    const { t } = useI18n<{message: Locales}>({
        useScope: 'global'
    })

    const schema = objectAsync({
        email: string(t('auth.errorEmailEmpty'), [email(t('auth.errorEmailInvalid'))]),
        password: string(t('auth.errorPasswordEmpty'), [
            minLength(8, t('auth.errorPasswordMinLength', { length: 8 }))
        ])
    })

    type Schema = Input<typeof schema>

    async function onSubmit (event: FormSubmitEvent<Schema>) {
        // Do something with event.data
        console.log(event.data)
    }
</script>
