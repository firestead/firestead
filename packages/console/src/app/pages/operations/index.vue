<template>
    <div class="pt-4 px-6">
        <div class="pb-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Overview</h3>
        </div>
    </div>
</template>
<script setup>
    const { result: framework, subscribe } = useFirestead('getFramework')

    subscribe('framework')
</script>