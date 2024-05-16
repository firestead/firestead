<template>
    <div>
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div class="flex h-16 shrink-0 items-center">
              <slot name="logo">
                <Logo class="h-12 w-auto" alt="Firestead"></Logo>
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
            <div class="mt-auto">
              <FsUserProfile />
            </div>
          </nav>
        </div>
      </div>
      <main class="lg:pl-72">  
          <slot />
      </main>
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