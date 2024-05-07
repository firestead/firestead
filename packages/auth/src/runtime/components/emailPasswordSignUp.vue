<template>
    <FsForm 
        class="space-y-6"
        :state="state"
        :validateOn="['submit', 'input', 'change']"
        :validate="validate"
        @submit="onSubmit" 
        :schema="schema">
          <FsFormGroup name="email" :label="t('auth.email')">
                <FsInput v-model="state.email" icon="i-heroicons-at-symbol" size="md" type="email" placeholder="Email"></FsInput>
          </FsFormGroup>

          <FsFormGroup name="password" :label="t('auth.password')">
                <FsInput v-model="state.password" icon="i-heroicons-key" size="md" type="password" placeholder="Password"></FsInput>
          </FsFormGroup>

          <FsFormGroup
            v-if="terms" 
            name="terms">
            <FsCheckbox v-model="state.terms" required name="terms" :label="t('auth.termsLabel')"></FsCheckbox>
            <template #help>
                <span>{{ t('auth.termsHelp') }}</span> <FsButton class="-ml-2" variant="link" :label="t('auth.termsLink')" />
            </template>
          </FsFormGroup>

          <div>
            <FsButton type="submit" :label="t('auth.signUpButton')" block />
          </div>
    </FsForm>
</template>
<script setup lang="ts">
    import { type Input, objectAsync, string, email, minLength } from 'valibot'
    import { reactive, useI18n } from '#imports'
    import type { FormError, FormSubmitEvent } from '#ui/types'
    import type { Locales } from '#build/locales'
    import {
        getRedirectResult,
        createUserWithEmailAndPassword
    } from 'firebase/auth'
    import { useFirebaseAuth } from 'vuefire'

    const auth = useFirebaseAuth()!

    const props = defineProps({
        terms: {
            type: Boolean,
            required: false,
        }
    })

    const { t } = useI18n<{message: Locales}>({
        useScope: 'global'
    })

    const state = reactive({
        email: undefined,
        password: undefined,
        terms: false
    })

    const schema = objectAsync({
        email: string(t('auth.errorEmailEmpty'), [email(t('auth.errorEmailInvalid'))]),
        password: string(t('auth.errorPasswordEmpty'), [
            minLength(8, t('auth.errorPasswordMinLength', { length: 8 }))
        ])
    })

    type Schema = Input<typeof schema>

    const validate = (state: any): FormError[] => {
        const errors = []
        if(props.terms && !state.terms) errors.push({ 
            path: 'terms', 
            message: t('auth.errorTermsText')
        })
        return errors
    }

    // display errors if any
    const error = ref(null)

    async function onSubmit (event: FormSubmitEvent<Schema>) {
        const { email, password } = event.data
        createUserWithEmailAndPassword(auth, email, password).catch((reason) => {
            console.error('Failed signinRedirect', reason)
            error.value = reason
        })
    }

    // only on client side
    onMounted(() => {
        getRedirectResult(auth).catch((reason) => {
            console.error('Failed redirect result', reason)
            error.value = reason
        })
    })
</script>
