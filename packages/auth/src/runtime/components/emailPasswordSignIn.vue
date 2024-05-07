<template>
    <FsForm 
        class="space-y-6"
        :state="state"
        :validateOn="['submit', 'input', 'change']"
        @submit="onSubmit" 
        :schema="schema">
          <FsAlert 
            v-if="error"
            icon="i-heroicons-command-line"
            :close-button="{ 
                icon: 'i-heroicons-x-mark-20-solid', 
                color: 'gray', 
                variant: 'link', 
                padded: false,
            }"
            variant="subtle"
            title="Error"
            :description="errorMap[error.code] || ''"
            color="red"
            @close="() => error = undefined"
            />
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
    import { signInWithEmailAndPassword, type AuthError } from "firebase/auth"
    import { useI18n } from '#imports'

    const props = defineProps({
        terms: {
            type: Boolean,
            required: false,
        }
    })

    const auth = useFirebaseAuth()!

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

    const errorMap = {
        'auth/user-not-found': t('auth.errorUserNotFound')
    } as Record<string, string>

    const error = ref<AuthError | undefined>(undefined)

    async function onSubmit (event: FormSubmitEvent<Schema>) {
        const { email, password } = event.data

        signInWithEmailAndPassword(auth, email, password).catch((reason: AuthError) => {
            console.error('Failed signinRedirect', reason.code)
            error.value = reason
        })
    }
</script>
