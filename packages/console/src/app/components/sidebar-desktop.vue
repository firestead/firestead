<template>
    <div class="flex flex-col flex-grow pt-6 pl-8 overflow-y-auto">
        <h1 class="font-sans font-medium text-md mb-4">{{menuEntry.label}}</h1>
        <sidebar-link v-for="entry in menuEntry.sidebar" :to="entry.path" :name="entry.name">{{entry.label}}</sidebar-link>
    </div>
</template>
<script setup>
    import sidebarLink from './links/sidebar-link.vue'
    import { inject, computed } from 'vue'

    const { current, menu } = inject('navigation')

    const menuEntry = computed(
        () => {
            return menu.filter(entry => entry.name === current.value.name)[0]
        }
    )
</script>