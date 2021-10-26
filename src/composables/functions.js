import { httpsCallable } from "firebase/functions"

export const useAsyncFunction = async(key,name,params={},options = {server: false}) => {
    const fs = useFirestead()
    return useAsyncData(key, async () => {
        const res = await httpsCallable(fs.functions, name)(params)
        return res.data
    },options)
}