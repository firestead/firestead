<template>
    <div class="pb-10 px-6 py-4">
        <div class="border-b pb-4 border-gray-200">
            <div class="flex items-center pt-3 pb-1">
                <NuxtLogo v-if="target?.framework === 'nuxt'" class="h-8 w-8"></NuxtLogo>
                <span class="ml-2">{{target?.name}}</span>
            </div>
        </div>
        <!-- 2 column wrapper -->
        <div class="flex-grow w-full max-w-7xl mx-auto lg:flex">
            <!-- Left sidebar & main wrapper -->
            <div class="flex-1 min-w-0 bg-white xl:flex">
                <div class="flex-1 min-w-0 bg-white">
                    <div class="h-full py-6 md:pr-4">
                        <!-- Start main area-->
                        <div class="relative h-full w-full">
                            <div class="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div class="flex justify-between px-4 py-5 sm:px-6">
                                    <div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900">Framework</h3>
                                        <span v-if="target?.framework === 'nuxt'" class="mt-1 max-w-2xl text-sm text-gray-500">Nuxt</span>
                                    </div>
                                    <div>
                                        <NuxtLogo v-if="target?.framework === 'nuxt'" class="h-10 w-10"></NuxtLogo>
                                    </div>
                                </div>
                                <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
                                    <dl class="sm:divide-y sm:divide-gray-200">
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">Version</dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{target?.details?.version}}</dd>
                                        </div>
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">Server Side Rendering</dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <svg v-if="target?.details?.ssr" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <svg v-if="!target?.details?.ssr" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </dd>
                                        </div>
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">Mode</dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{target?.details?.mode}}</dd>
                                        </div>
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">Target</dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{target?.details?.target}}</dd>
                                        </div>
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">Modules</dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <ul role="list" class="border border-gray-200 rounded-md divide-y divide-gray-200">
                                                    <li v-for="(module, key) in target?.details?.modules"
                                                        v-bind:key="key" 
                                                        class="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                                                        >
                                                        <div class="w-0 flex-1 flex items-center">
                                                            <Windicss v-if="module==='nuxt-windicss'" class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            <Firestead v-if="module==='@firestead/nuxt/module'" class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            <Vueuse v-if="module==='@vueuse/nuxt'" class="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                                                            <span class="ml-2 flex-1 w-0 truncate"> {{module}} </span>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <!-- End main area -->
                    </div>
                </div>
            </div>
             <div class="lg:h-screen pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                <div class="h-full pl-6 py-6 lg:w-120">
                    <!-- Start right column area -->
                    <div class="h-full relative">

                        <div class="absolute inset-0 border-2 border-gray-200 border-dashed rounded-lg" />
                    </div>
                    <!-- End right column area -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import FirebaseLogo from '#assets/firebase/logo-logomark.svg'
    import Firestead from '#assets/firestead/logo-logomark.svg'
    import NuxtLogo from '#assets/frameworks/nuxt-logo.svg'
    import Windicss from '#assets/modules/windicss.svg'
    import Vueuse from '#assets/modules/vueuse.svg'

    const { result, subscribe, pick } = useFirestead('getHostingTargets')
    const { params } = useRoute()

    const target = pick((data) => {
        return data.targets[params.id]
    })

    subscribe('hosting')
</script>