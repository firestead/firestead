<template>
  <nuxt-link
    v-for="nav of navs" 
    :to="nav.path"
    :key="nav.name"
    class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium no-underline leading-5 text-gray-800 focus:outline-none transition duration-150 ease-in-out hover:bg-gray-700  hover:text-gray-100 focus:text-gray-100 transition duration-150 ease-in-out"
  >
    {{nav.name}}
  </nuxt-link>
</template>
<script setup>
  const navs= [
    {
      name: 'Dashboard',
      path: '/'
    },
    {
      name: 'Auth',
      path: '/auth'
    },
    {
      name: 'Todos',
      path: '/todos'
    },
    {
      name: 'Upload',
      path: '/upload'
    }
  ]
</script>
<style scoped>
  .router-link-exact-active {
    @apply bg-green-400 text-gray-100;
  }
  .router-link-inactive {
    @apply bg-green-400 text-gray-100;
  }
</style>