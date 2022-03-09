<template>
  <app-link
    v-bind="$attrs"
    class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium no-underline leading-5 text-gray-800 focus:outline-none transition duration-150 ease-in-out hover:bg-gray-700  hover:text-gray-100 focus:text-gray-100 transition duration-150 ease-in-out"
    active-class="bg-orange-400 text-gray-100"
    inactive-class=""
    link-type="topbar"
  >
    <slot />
  </app-link>
</template>
<script setup>
    import AppLink from './app-link.vue'
</script>