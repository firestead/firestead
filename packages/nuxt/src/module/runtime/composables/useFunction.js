import { useNuxtApp } from '#app'

export const useFunction = async(key,name,params={},options = {server: false, defer:true}) => {
    const { $fs } = useNuxtApp()

    return useAsyncData(key, async () => {
        const connection = await $fs.functions.connection()
        const { httpsCallable } = await $fs.functions.lib()
        const res = await httpsCallable(connection, name)(params)
        return res.data
    },options)
}