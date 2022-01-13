<template>
    <navbar-link v-for="entry in menu" :to="entry.path" :name="entry.name">{{entry.label}}</navbar-link>
</template>
<script setup>
    import navbarLink from './links/navbar-link.vue'
    import { inject } from 'vue'

    const { menu } = inject('navigation')
</script>