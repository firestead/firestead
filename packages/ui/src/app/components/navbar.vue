<template>
    <navbar-link v-for="item in navbar" :to="item.path" :name="item.name">{{item.label}}</navbar-link>
</template>
<script setup>
    import navbarLink from './links/navbar-link.vue'
    import { inject } from 'vue'

    const { navbar } = inject('navigation')
</script>