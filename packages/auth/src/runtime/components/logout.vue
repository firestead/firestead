<template>
    <FsButton v-bind="{...props, ...$attrs}" @click.prevent="onLogout"> {{ props.label ? props.label : t('auth.signOutButton') }} </FsButton>
</template>
<script setup lang="ts">
    import type Colors from '#ui-colors'
    import {  signOut } from "firebase/auth"
    import { useFirebaseAuth } from 'vuefire'
    import type { Locales } from '#build/locales'
    import { useI18n } from '#imports'


    const auth = useFirebaseAuth()!

    type Button = {
        color?: typeof Colors[number]
        label?: string
        variant?: 'solid' | 'outline' | 'ghost' | 'link' | 'soft'
    }

    interface Props extends Button {

    }

    const { t } = useI18n<{message: Locales}>({
        useScope: 'global'
    })

    const props = withDefaults(defineProps<Props>(), {
        color: 'primary',
        variant: 'link'
    })

    const onLogout = () => {
        signOut(auth).then(() => {
            console.log('User signed out')
        }).catch((error) => {
            console.error(error)
        })
    } 
</script>