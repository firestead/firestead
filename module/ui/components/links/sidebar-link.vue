<template>
  <app-link
    v-bind="$attrs"
    class="inline-flex px-3 py-0.5 text-sm font-normal no-underline text-gray-800 focus:outline-none transition duration-150 ease-in-out hover:text-gray-900 transition"
    active-class="border-l-2 text-orange-400 border-orange-400 hover:text-orange-400"
    inactive-class=""
    link-type="sidebar"
  >
    <slot />
  </app-link>
</template>
<script setup>
    import AppLink from './app-link.vue'
</script>