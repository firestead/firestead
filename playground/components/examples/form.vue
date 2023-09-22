<template>
    <Block label="Form" description="Example form login based on card component">
        <FsCard v-model="formData" @submit="submit" :validate="formValidator">
            <FsField name="email" label="E-Mail" required :validate-on-change="true">
                <FsInput icon="i-heroicons-at-symbol" type="email" placeholder="Email"></FsInput>
            </FsField>
            <FsField name="password" label="Passwort" required :validate-on-change="true" class="pt-4">
                <FsInput icon="i-heroicons-key" type="password" placeholder="Password"></FsInput>
            </FsField>
            <FsField name="remember">
                <FsCheckbox name="remember" label="Remember me" class="pt-4"></FsCheckbox>
            </FsField>
            <template #footer>
                <div class="flex justify-end">
                    <FsButton label="Cancel" type="reset" color="red" class="mr-2"/>
                    <FsButton label="Submit" type="submit" :loading="formLoader"/>
                </div>
            </template>
        </FsCard>
    </Block>
</template>
<script setup lang="ts">
    import { type Input, object, string, email, endsWith, minLength, boolean, equal } from 'valibot'

    const formData = ref({
        email: 'jo@test.de'
    })

    const formSchema = object({
            email: string('Your email must be a string.',[
                email('The email address is badly formatted.'), 
                endsWith('@example.com', 'The email address must end with @example.com')]),
            password: string('Your password must be a string.',
            [
                minLength(8, 'Your password must be at least 8 characters long.'),
                endsWith('123', 'Your password must end with 123')
            ]),
            remember: boolean('Your remember must be a boolean.',[
                equal(true, 'You must accept the terms and conditions.')
            ])
    })
    const formValidator = useValibotValidator(formSchema)

    type Register = Input<typeof formSchema>;
    
    const { submit, loading: formLoader } = useFormSubmit<Register>((formResult) => {
        console.log(formResult.value)
    }, {
        onFormError: (error) => {
        console.log(error)
        }
    })
</script>