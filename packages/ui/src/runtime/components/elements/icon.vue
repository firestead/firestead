<template>
    <span :class="name" />
</template>
<script setup lang="ts">
    export type Props = {
        name?: string
    }
    
    withDefaults(defineProps<Props>(),{
        name: ''
    })
</script>