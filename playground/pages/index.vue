<template>
    <!-- Edit this file to play around with Nuxt but never commit changes! -->
    <section>
      <header class="shadow">
        <div class="flex justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight"> Firestead Playground</h1>
          <div>
            {{ t('test2') }}
          </div>
        </div>
      </header>
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
        </div>
    </section>
</template>
<script setup lang="ts">
    import type { Locales } from '#build/locales'
    
    useHead({
      bodyAttrs: {
        class: 'bg-white dark:bg-neutral-900 text-gray-900 dark:text-white'
      }
    })
  
    const error = ref<string | undefined>(undefined)
    const loading = ref(false)
    const showError = () => {
      error.value = 'This is an error'
      loading.value = !loading.value
    }

    const { t } = useI18n<{message: Locales}>({
    })
</script>