<template>
    <div class="pt-4 px-6">
        <div class="pb-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">App</h3>
        </div>
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mt-10">
            <div class="flex justify-between px-4 py-5 sm:px-6">
                <div>
                    <h3 class="text-lg leading-6 font-medium text-gray-900">Framework</h3>
                    <span class="mt-1 max-w-2xl text-sm text-gray-500">Nuxt 3</span>
                </div>
                <div>
                    <NuxtLogo class="h-10 w-10"></NuxtLogo>
                </div>
            </div>
            <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Version</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{framework.version}}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Server Side Rendering</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <svg v-if="framework.details?.ssr" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-if="!framework.details?.ssr" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Mode</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{framework.details?.mode}}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Target</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{framework.details?.target}}</dd>
                </div>
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt class="text-sm font-medium text-gray-500">Modules</dt>
                    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul role="list" class="border border-gray-200 rounded-md divide-y divide-gray-200">
                            <li v-for="(module, key) in framework.details?.modules"
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
</template>
<script setup>
    import Firestead from '#assets/firestead/logo-logomark.svg'
    import NuxtLogo from '#assets/frameworks/nuxt-logo.svg'
    import Windicss from '#assets/modules/windicss.svg'
    import Vueuse from '#assets/modules/vueuse.svg'
    const { result: framework, subscribe } = useFirestead('getFramework')

    subscribe('framework')
</script>