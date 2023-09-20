<template>
      <span :class="name" />
</template>
<script setup lang="ts">
    type Props = {
        name: string
    }
    defineProps<Props>()
</script>