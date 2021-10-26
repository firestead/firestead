<template>
  <div class="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
    <div class="h-96 border-4 border-dashed border-gray-200 rounded-lg p-10">
        <h1 class="text-gray-300">Hallo Welt 2 {{ test }}</h1>
        <NuxtLink to="/test">Link</NuxtLink>
    </div>
  </div>
</template>
<script setup>
  defineProps({
    test: String
  })
  const dataOut = ref({})

  const login = (data) => {
    console.log('Test event', data)
  }
</script>

