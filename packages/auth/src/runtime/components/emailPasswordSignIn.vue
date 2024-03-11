<template>
    <FsForm class="space-y-6" @submit="submit" :validate="formValidator">
          <FsField name="email" label="Email address" :validate-on-change="true">
            <FsInput icon="i-heroicons-at-symbol" size="md" type="email" placeholder="Email"></FsInput>
          </FsField>

          <FsField name="password" label="Passwort" :validate-on-change="true">
                <FsInput icon="i-heroicons-key" size="md" type="password" placeholder="Password"></FsInput>
          </FsField>

          <FsField 
            v-if="termsValidator" 
            name="terms" 
            :validate="termsValidator" 
            :validate-on-change="true" 
            help="You must accept our terms">
            <FsCheckbox name="terms" label="Accept terms" :value="false"></FsCheckbox>
          </FsField>

          <div>
            <FsButton type="submit" label="Sign in" block />
          </div>
    </FsForm>
</template>
<script setup lang="ts">
    import { type Input, object, string, email, endsWith, minLength, boolean, value, type BooleanSchema } from 'valibot'

    const props = defineProps({
        terms: {
            type: Boolean,
            required: false,
        }
    })

    const formSchema = object({
        email: string('Your email must be a string.',[
            email('The email address is badly formatted.')
        ]),
        password: string('Your password must be a string.',
        [
            minLength(8, 'Your password must be at least 8 characters long.'),
            endsWith('123', 'Your password must end with 123')
        ])
    })

    let termsValidator = null as null | BooleanSchema

    if(props.terms){
        const termsSchema = boolean([
            value(true, 'You must accept the terms and conditions.')
        ])
        termsValidator = useValibotValidator(termsSchema)
    }

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
