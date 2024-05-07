<template>
    <FsStackedSidebar>
      <slot />
    </FsStackedSidebar>
</template>
<script setup lang="ts">
  import { firebaseAuthWatcher } from '#imports'
  
  firebaseAuthWatcher()
</script>