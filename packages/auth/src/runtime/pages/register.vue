<template>
    <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <Logo class="flex justify-center h-28" layout="centered"></Logo>
        <h2 class="mt-8 text-center text-2xl font-medium leading-9 tracking-tight text-gray-700">{{ t('auth.pageRegisterTitle') }}</h2>
      </div>
  
      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <FsCard>
          <FsEmailPasswordSignUp terms></FsEmailPasswordSignUp>
        </FsCard>
      </div>
    </div>
  </template>
  <script setup lang="ts">
      import type { Locales } from '#build/locales'
      import { useI18n } from '#imports'
  
      definePageMeta({
          layout: 'empty'
      })
  
      const { t } = useI18n<{message: Locales}>({
          useScope: 'global'
      })
  </script>