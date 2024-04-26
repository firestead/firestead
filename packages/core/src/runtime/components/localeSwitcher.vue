<template>
    <FsSelectMenu 
        v-model="selected" 
        :options="locales"
        option-attribute="name">
        <template #leading>
            <FsIcon :name="iconMapping[selected?.code]" class="w-5 h-5" />
        </template>
    </FsSelectMenu>
</template>
<script setup lang="ts">
    import { useI18n, ref } from '#imports'
    import type { LocaleObject } from '@nuxtjs/i18n'

    type IconMapping = {
        [key: string]: string
    }

    const iconMapping = {
        'none': 'i-heroicons-user-circle',
        'de': 'i-flagpack-de',
        'en': 'i-flagpack-gb'
    } as IconMapping


    const { locale, locales, setLocale } = useI18n()

    const selected = ref({
            code: 'none',
            name: 'None'
    }) as Ref<LocaleObject>

    selected.value = locales.value.find(i => i.code === locale.value) || {
        code: 'none',
        name: 'None'
    }

    watch(selected, (value) => {
        if (value.code !== 'none') {
            setLocale(value.code)
        }
    })

</script>