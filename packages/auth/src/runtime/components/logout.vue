<template>
    <span
        @click.prevent="onLogout"> 
        {{ props.label ? props.label : t('auth.signOutButton') }} 
    </span>
</template>
<script setup lang="ts">
    import {  signOut } from "firebase/auth"
    import { useFirebaseAuth } from 'vuefire'
    import type { Locales } from '#build/locales'
    import { useI18n } from '#imports'


    const auth = useFirebaseAuth()!

    type Button = {
        label?: string
    }

    interface Props extends Button {

    }

    const { t } = useI18n<{message: Locales}>({
        useScope: 'global'
    })

    const props = withDefaults(defineProps<Props>(), {
    })

    const onLogout = () => {
        signOut(auth).then(() => {
            console.log('User signed out')
        }).catch((error) => {
            console.error(error)
        })
    } 
</script>