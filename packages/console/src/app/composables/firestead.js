import { inject, toRef, computed, onUnmounted } from 'vue'

export const useFirestead = (key) => {
    if (typeof key !== 'string') {
        throw new TypeError('useFirestead key must be a string')
    }
    const ws = inject('ws')
    /*
    *   Get global state for the given key
    */
    const firesteadResult = toRef(ws.state, `${key}FiresteadResult`, false)
    const firesteadPending = toRef(ws.state, `${key}FiresteadPending`,false)
    const firesteadSubscriptions = toRef(ws.state, `${key}FiresteadSubscriptions`,0)


    const subscribe = async (contextPath) => {
        let unsubscribeFunction = null
        onUnmounted(() => {
            /*
            *   unsubscribe only if only one subscription is left
            *   otherwise decrement the subscription count
            */
            if(unsubscribeFunction && firesteadSubscriptions.value === 1) {
                unsubscribeFunction()
            }else{
                firesteadSubscriptions.value--
            }
        })
        try{
            /*
            *   Subscribe to the contextPath on client if not already subscribed
            *   If already subscribed, increment the subscription count
            */
           if(firesteadSubscriptions.value === 0){
                unsubscribeFunction = ws.subscribe(contextPath,(payload) => {
                    firesteadResult.value = payload
                })
                firesteadSubscriptions.value++
           }else{
            firesteadSubscriptions.value++
           }
        } catch (error) {
            console.log(error)
        }
    }

    const post = (context, payload, options={}) => {
        if(options?.createObject){
            const createObject = function(key, value) {
                const obj = {}
                const parts = key.split('.')
                if(parts.length == 1) {
                    obj[parts[0]] = value
                } else if(parts.length > 1) {
                    // concat all but the first part of the key
                    const remainingParts = parts.slice(1,parts.length).join('.')
                    obj[parts[0]] = createObject(remainingParts, value)
                }
                return obj
            }
            payload = createObject(options.createObject, payload)
        }
        ws.send({
            method: 'post',
            context,
            payload
        })
    }

    const filter = (fn, options = {}) => {
        return computed(()=>{
            if(typeof fn === 'function' && firesteadResult.value){
                if(Array.isArray(firesteadResult.value)){
                    const returnValue = firesteadResult.value.filter(fn)
                    if(typeof options.pick === 'string'){
                            return returnValue.map(item => item[options.pick])
                    }
                    if(Array.isArray(options.pick)){
                        return returnValue.map((item) => {
                            return options.pick.reduce((result, key) => { 
                                result[key] = item[key] 
                                return result 
                            }, {})
                        })
                    }
                    return returnValue
                }
            }
        })
    }

    const find = (fn, options = {}) => {
        return computed(()=>{
            if(typeof fn === 'function' && firesteadResult.value){
                if(Array.isArray(firesteadResult.value)){
                    const retObj = firesteadResult.value.find(fn)
                    if(typeof options.pick === 'string'){
                        return [options.pick].reduce((result, key)=> result[key], retObj)
                    }
                    if(Array.isArray(options.pick)){
                        return options.pick.reduce((result, key) => { 
                            result[key] = retObj[key] 
                            return result 
                        }, {})
                    }
                    return retObj
                }
            }
        })
    }

    const pick = (fn) => {
        return computed(()=>{
            if(typeof fn === 'function' && firesteadResult.value){
                if(Object.prototype.toString.call(firesteadResult.value) === '[object Object]'){
                    return fn(firesteadResult.value)
                }
            }
        })
    }

    return {
        subscribe,
        filter,
        find,
        post,
        pick,
        pending: firesteadPending,
        result: firesteadResult
    }
}