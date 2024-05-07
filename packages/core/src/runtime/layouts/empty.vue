<template>
    <div>
        <slot />
    </div>
</template>
<script setup lang="ts">
    import { useHead, firebaseAuthWatcher } from '#imports'

    useHead({
        htmlAttrs: {
            class: 'h-full bg-gray-50'
        },
        bodyAttrs: {
            class: 'h-full'
        }
    })
  
    firebaseAuthWatcher()
</script>