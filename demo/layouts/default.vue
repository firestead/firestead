<script setup>
  import '../assets/tailwind.css'
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main class="-mt-32">
      <div class="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>