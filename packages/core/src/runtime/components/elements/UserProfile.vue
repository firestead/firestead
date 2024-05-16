<template>
     <FsDropdown :items="items" :ui="{ 
            item: { 
                disabled: 'cursor-text select-text' 
                } 
            }" 
            :popper="{ 
                placement: 'bottom-start' 
            }">
        <FsAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" />

        <template #account>
            <div class="text-left">
                <p>{{ t('profile.dropdownSignedInAs') }}</p>
                <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ user?.email }}
                </p>
            </div>
        </template>

        <template #item="{ item }">
          <FsLogout
            v-if="item.type === 'signout'" 
            class="text-left w-full font-normal text-sm" />
          <span v-else class="truncate">{{ item.label }}</span>
          <FsIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
        </template>
  </FsDropdown>
</template>
<script setup lang="ts">
    import type { Locales } from '#build/locales'
    import { useI18n } from '#imports'
    import { useCurrentUser } from '#imports'

    const items = [
      [{
        label: 'ben@example.com',
        slot: 'account',
        disabled: true
      }], [{
        label: 'Settings',
        icon: 'i-heroicons-cog-8-tooth'
      }], [{
        label: 'Documentation',
        icon: 'i-heroicons-book-open'
      }, {
        label: 'Changelog',
        icon: 'i-heroicons-megaphone'
      }, {
        label: 'Status',
        icon: 'i-heroicons-signal'
      }], [{
        label: 'Sign out',
        type: 'signout',
        icon: 'i-heroicons-arrow-left-on-rectangle'
      }]
    ]

    const { t } = useI18n<{message: Locales}>({
        useScope: 'global'
    })

    const user = useCurrentUser()
</script>