<template>
    <div>
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white pb-4">
          <div class="flex flex-col h-16 p-4 shrink-0 items-center">
              <slot name="logo">
                <Logo class="h-12 w-auto" alt="Firestead"></Logo>
                <h1>{{ t('test') }}</h1>
              </slot>
          </div>
          <nav class="flex flex-1 flex-col">
            <div>
              <h1>{{ t('login.title') }}</h1>
              <a
                href="#"
                v-for="locale in availableLocales"
                :key="locale.code"
                @click.prevent.stop="setLocale(locale.code)"
                >{{ locale.name }}</a
              >
            </div>
          </nav>
        </div>
      </div>
      <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <FsLogout />
      </div>
      <div class="lg:pl-72">
        <main>  
            <slot />
        </main>
      </div>
  </div>
</template>
<script setup lang="ts">
    import type { Locales } from '#build/locales'

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
    const { t, locale, locales, setLocale } = useI18n<{ message: Locales}>({
      useScope: 'global'
    })

    const availableLocales = computed(() => {
      return (locales.value).filter(i => i.code !== locale.value)
    })

    console.log(availableLocales.value)
</script>