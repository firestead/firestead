<template>
  <!-- Edit this file to play around with Nuxt but never commit changes! -->
  <section>
    <header class="shadow">
      <div class="flex justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight"> Firestead Playground</h1>
        <div>
          <h1>Color mode: {{ $colorMode.value }}</h1>
          <select v-model="$colorMode.preference" class="text-gray-900">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="sepia">Sepia</option>
          </select>
        </div>
      </div>
    </header>
      <main class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <ExamplesForm></ExamplesForm>
          <ExamplesDropdown></ExamplesDropdown>
          <Block label="Avatar">
            <FsAvatarGroup size="sm" :max="3">
              <FsAvatar src="https://i.pravatar.cc/3000" img-class="imgTest" chip-color="red" chip-text="" class="test"/>
              <FsAvatar alt="Benjamin Button" chip-color="green" chip-text="" class="test"/>
              <FsAvatar src="https://i.pravatar.cc/1000" img-class="imgTest" chip-color="red" chip-text="" class="test"/>
              <FsAvatar src="https://i.pravatar.cc/2000" img-class="imgTest" chip-color="red" chip-text="" class="test"/>
            </FsAvatarGroup>
          </Block>
          <Block label="Badge">
              <FsBadge label="Test" size="sm" variant="subtle" color="green" />
          </Block>
          <Block label="Button" description="Button Tests">
              <FsButton 
                  label="Test"
                  @click="showError"
                  :loading="loading"
                  icon="i-heroicons-arrow-right-on-rectangle-solid"
                  size="2xs"
                  color="amber"
                />
                <div class="pt-4">
                  <FsButtonGroup size="2xs">
                    <FsButton label="Action" variant="light" color="neutral" />
                    <FsButton icon="i-heroicons-chevron-down-20-solid" variant="light" color="neutral" />
                  </FsButtonGroup>
                </div>
            </Block>
      </main>
  </section>
</template>
<script setup lang="ts">

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
</script>
<style scoped>

</style>