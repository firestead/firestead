<template>
  <!-- Edit this file to play around with Nuxt but never commit changes! -->
  <div>
    Firestead Playground
    <FsButton 
      label="Test"
      @click="showError" 
      size="sm"/>
    <FsFieldErrors :errors="error" />
    <FsFieldLabel label="Test" :disabled="error ? true: false" />
    <FsFieldFeedback text="This is a feedback" />
  </div>
</template>
<script setup lang="ts">
  const error = ref<string | undefined>(undefined)
  const showError = () => {
    error.value = 'This is an error'
  }
</script>
<style scoped>

</style>