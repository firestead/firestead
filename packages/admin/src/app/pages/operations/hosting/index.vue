<template>
    <div class="px-6 py-4">
        <div class="flex justify-between pb-4 border-b border-gray-200">
            <h3 class="text-lg self-center leading-6 font-medium text-gray-900">Hosting Targets</h3> 
            <fs-button icon="add">Add</fs-button>
        </div>
        <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" class="divide-y divide-gray-200">
                <li 
                    v-for="(target, id) in result.targets"
                    v-bind:key="id"
                    >
                    <router-link :to="`/operations/environments/${id}`" class="block hover:bg-gray-50">
                        <div class="relative px-4 py-4 sm:px-6">
                            <div class="flex items-center justify-between">
                                <p class="text-sm font-medium text-gray-600 truncate">{{target.name}}</p>
                                <div v-if="result.current === id" class="mr-8 flex-shrink-0 flex">
                                    <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</p>
                                </div>
                            </div>
                            <div class="mt-2 sm:flex sm:justify-between">
                                <div class="text-xs ">
                                    <span class="text-gray-500">Project: </span>
                                    <span class="font-thin"></span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
    const { result, subscribe, post } = useFirestead('getHostingTargets')

    subscribe('hosting')
</script>