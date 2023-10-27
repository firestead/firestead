<template>
    <FsForm class="space-y-6" @submit="submit" :validate="formValidator">
          <FsField name="email" label="Email address" :validate-on-change="true">
            <FsInput icon="i-heroicons-at-symbol" size="md" type="email" placeholder="Email"></FsInput>
          </FsField>

          <FsField name="password" label="Passwort" :validate-on-change="true">
                <FsInput icon="i-heroicons-key" size="md" type="password" placeholder="Password"></FsInput>
          </FsField>

          <div class="flex items-center justify-between">
            <FsField name="remember">
              <FsCheckbox name="remember" label="Remember me"></FsCheckbox>
            </FsField>

            <div class="text-sm leading-6">
              <FsLink to="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</FsLink>
            </div>
          </div>

          <div>
            <FsButton type="submit" label="Sign in" block />
          </div>
    </FsForm>
</template>
<script setup lang="ts">
    import { type Input, object, string, email, endsWith, minLength, boolean, equal } from 'valibot'

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
