import { useNuxtApp } from '#app'
import { httpsCallable } from "@firebase/functions"

export const useAsyncFunction = async(key,name,params={},options = {server: false, defer:true}) => {
    const { $fs } = useNuxtApp()
    return useAsyncData(key, async () => {
        const res = await httpsCallable($fs.functions, name)(params)
        return res.data
    },options)
}