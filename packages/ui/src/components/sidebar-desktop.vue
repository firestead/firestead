<template>
    <div v-if="navigation" class="flex flex-col flex-grow pt-6 pl-8 overflow-y-auto">
        <h1 class="font-sans font-medium text-md mb-4">{{navigation.label}}</h1>
        <sidebar-link v-for="item in navigation.items" :to="item.path" :name="item.name">{{item.label}}</sidebar-link>
    </div>
</template>
<script setup>
    import sidebarLink from './links/sidebar-link.vue'
    import { inject, computed, watch } from 'vue'

    const { current, sidebar } = inject('navigation')

    const navigation = computed(
        () => sidebar.filter(nav => nav.name === current.navbar)[0]
    )
</script>