<template>
    <div class="p-4">
        <div class="flex items-start">
        <div class="flex-shrink-0">
            <Icon name="i-heroicons-check-circle" class="h-6 w-6 text-green-400" aria-hidden="true"/>
        </div>
        <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">Test</p>
            <p class="mt-1 text-sm text-gray-500">Anyone with a link can now view this file.</p>
        </div>
        <div class="ml-4 flex flex-shrink-0">
            <button type="button" @click="show = false" class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span class="sr-only">Close</span>
                <Icon name="i-heroicons-x-mark" class="h-5 w-5" aria-hidden="true"/>
            </button>
        </div>
        </div>
    </div>
</template>
<script setup lang="ts">
    import Icon from '../icons/wrapper.vue'
</script>