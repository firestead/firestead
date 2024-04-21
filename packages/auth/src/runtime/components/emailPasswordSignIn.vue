<template>
    <FsForm 
        class="space-y-6"
        :state="state"
        :validateOn="['submit', 'input', 'change']"
        :validate="validate"
        @submit="onSubmit" 
        :schema="schema">
          <FsFormGroup name="email" label="Email address">
                <FsInput v-model="state.email" icon="i-heroicons-at-symbol" size="md" type="email" placeholder="Email"></FsInput>
          </FsFormGroup>

          <FsFormGroup name="password" label="Passwort">
                <FsInput v-model="state.password" icon="i-heroicons-key" size="md" type="password" placeholder="Password"></FsInput>
          </FsFormGroup>

          <FsFormGroup
            v-if="terms" 
            name="terms"
            help="You must accept our terms">
            <FsCheckbox v-model="state.terms" name="terms" label="Accept terms"></FsCheckbox>
          </FsFormGroup>

          <div>
            <FsButton type="submit" label="Sign in" block />
          </div>
    </FsForm>
</template>
<script setup lang="ts">
    import { type Input, objectAsync, string, email, endsWith, minLength, type BooleanSchema } from 'valibot'
    import type { FormError, FormSubmitEvent } from '#ui/types'

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

    const schema = objectAsync({
        email: string('Your email must be a string.', [email('Invalid email')]),
        password: string('Your password must be a string.', [
            minLength(8, 'Must be at least 8 characters'),
            endsWith('123', 'Your password must end with 123')
        ])
    })

    type Schema = Input<typeof schema>

    const validate = (state: any): FormError[] => {
        const errors = []
        if(props.terms && !state.terms) errors.push({ path: 'terms', message: 'You must accept the terms and conditions.' })
        return errors
    }

    async function onSubmit (event: FormSubmitEvent<Schema>) {
        // Do something with event.data
        console.log(event.data)
    }
</script>
