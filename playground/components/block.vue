<template>
    <div class="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
        <div class="px-4 sm:px-0">
            <h2 class="text-base font-semibold leading-7 ">{{ label }}</h2>
            <p class="mt-1 text-sm leading-6 text-gray-600">{{ description }}</p>
        </div>
        <div class="shadow-sm ring-1 ring-gray-900/5 dark:ring-gray-100 sm:rounded-xl md:col-span-2">
            <div class="px-4 py-6 sm:p-8">
                <slot />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    defineProps({
        label: {
            type: String,
            default: () => 'Label'
        },
        description: {
            type: String,
            default: () => ''
        }
    })
</script>