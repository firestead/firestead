<template>
  <!-- Edit this file to play around with Nuxt but never commit changes! -->
  <div>
    Firestead Playground
    <div>
      <FsButton 
      label="Test"
      @click="showError"
      :loading="loading"
      icon="i-heroicons-arrow-right-on-rectangle-solid"
      size="sm"
      color="green"
      />
    </div>
    <div class="p-4">
      <FsButtonGroup size="xs">
        <FsButton label="Action" variant="light" />
        <FsButton icon="i-heroicons-chevron-down-20-solid" variant="light"/>
      </FsButtonGroup>
    </div>
    <FsFieldErrors :errors="error" />
    <FsFieldLabel label="Test" :disabled="error ? true: false" />
    <FsFieldFeedback text="This is a feedback" />
  </div>
</template>
<script setup lang="ts">
  const error = ref<string | undefined>(undefined)
  const loading = ref(false)
  const showError = () => {
    error.value = 'This is an error'
    loading.value = !loading.value
  }
</script>
<style scoped>

</style>