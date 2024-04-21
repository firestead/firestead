<template>
    <div>
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4">
          <div class="flex h-16 p-4 shrink-0 items-center">
            <slot name="logo">
              <Logo class="h-12 w-auto" alt="Firestead"></Logo>
            </slot>
          </div>
          <nav class="flex flex-1 flex-col">
          </nav>
        </div>
      </div>
      <div class="lg:pl-72">
        <main>
            <slot />
        </main>
      </div>
  </div>
</template>
<script setup lang="ts">
    const props = defineProps({
        headerbar: {
            type: Boolean,
            default: true
        }
    })

    useHead({
        htmlAttrs: {
            class: 'h-full'
        },
        bodyAttrs: {
            class: 'h-full'
        }
    })
</script>