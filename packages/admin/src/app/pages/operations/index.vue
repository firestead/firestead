<template>
    <div class="pt-4 px-6">
        <div class="pb-4 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">App</h3>
        </div>
    </div>
</template>
<script setup>
    import Firestead from '#assets/firestead/logo-logomark.svg'
    import NuxtLogo from '#assets/frameworks/nuxt-logo.svg'
    import Windicss from '#assets/modules/windicss.svg'
    import Vueuse from '#assets/modules/vueuse.svg'
    const { result: framework, subscribe } = useFirestead('getFramework')

    //subscribe('framework')
</script>