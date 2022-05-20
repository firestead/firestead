<template>
    <div class="pt-4 px-6">
        <div class="pb-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Functions</h3>
        </div>
        <!-- 2 column wrapper -->
        <div class="flex-grow w-full max-w-7xl mx-auto lg:flex">
            <!-- Left sidebar & main wrapper -->
            <div class="flex-1 min-w-0 bg-white xl:flex">
                <div class="flex-1 min-w-0 bg-white">
                    <div class="h-full py-6 md:pr-4">
                        <!-- Start main area-->
                        <div class="relative h-full w-full">
                            <div class="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                                <ul role="list" class="divide-y divide-gray-200">
                                    <li 
                                        v-for="(env, id) in result.envs"
                                        v-bind:key="id"
                                        >
                                        <router-link :to="`/operations/environments/${id}`" class="block hover:bg-gray-50">
                                            <div class="px-4 py-4 sm:px-6">
                                                <div class="flex items-center justify-between">
                                                    <p class="text-sm font-medium text-gray-600 truncate">{{env.name}}</p>
                                                    <div v-if="result.current === id" class="ml-2 flex-shrink-0 flex">
                                                        <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</p>
                                                    </div>
                                                </div>
                                                <div class="mt-2 sm:flex sm:justify-between">
                                                    <div class="text-xs ">
                                                        <span class="text-gray-500">Project: </span>
                                                        <span class="font-thin">{{env?.config?.projectId}}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- End main area -->
                    </div>
                </div>
            </div>
            <div class="lg:h-screen pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                <div class="h-full pl-6 py-6 lg:w-80">
                    <!-- Start right column area -->
                    <div class="h-full relative" style="min-height: 16rem">
                        <div class="absolute inset-0 border-2 border-gray-200 border-dashed rounded-lg" />
                    </div>
                    <!-- End right column area -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    const { result, subscribe } = useFirestead('getEnviroments')

    subscribe('environments')
</script>