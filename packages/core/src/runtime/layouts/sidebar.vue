<template>
  <FsLayoutSidebar>
    <slot />
  </FsLayoutSidebar>
</template>
<script setup lang="ts">
  import { firebaseAuthWatcher } from '#imports'
  
  firebaseAuthWatcher()
</script>