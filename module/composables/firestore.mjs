import { useNuxtApp, useState } from '#app'
import { onUnmounted, onBeforeMount, getCurrentInstance } from 'vue'
import { klona } from 'klona'

export const useFirestore = (key, options={}) => {
    if (typeof key !== 'string') {
        throw new TypeError('useFirestore key must be a string')
    }
    const { $fs, callHook, isHydrating, _asyncDataPromises } = useNuxtApp()
    const result = useState(`${key}FirestoreResult`)
    const fetchDetails = useState(`${key}FirestoreFetchDetails`,()=>{return {}})
    const state = useState(`${key}FirestoreState`)
    const error = useState(`FiresteadError`)
    const reFetch = {}
    
    const fsSetDoc = async (refPath, newData, options={timestamps:true}) => {
        try {
            const { doc, collection, setDoc, serverTimestamp } = await $fs.firestore.lib()
            state.value = 'create'
            const docRef = doc(collection($fs.firestore.connection,refPath))
            if(options.timestamps){
                newData = {
                    ...newData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'set' , refPath, newData)
            await setDoc(docRef, newData)
            state.value = 'created'
        } catch (error) {
            state.value = 'error'
            error.value = error
            console.log(error)
        }
    }
    //
    //    TODO: add options pick api to update only a few values of a document
    //    check merge strategie of firebase api
    //
    const fsUpdateDoc = async (index=null, options = {timestamps:true}) => {
        try {
            const { updateDoc, serverTimestamp } = await $fs.firestore.lib()
            state.value = 'update'
            const refDoc = result.value[index].ref
            let dataUpdate = klona(result.value[index].data)
            if(options.timestamps){
                dataUpdate = {
                    ...dataUpdate,
                    updatedAt: serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'update', refDoc.path ,dataUpdate)
            await updateDoc(refDoc, dataUpdate)
            state.value = 'updated'
        } catch (error) {
            state.value = 'error'
            error.value = error
            console.log(error)
        }
    }

    const fsDeleteDoc = async (index=null, options = {}) => {
        try {
            const { deleteDoc } = await $fs.firestore.lib()
            state.value = 'delete'
            const refDoc = result.value[index].ref
            await deleteDoc(refDoc)
            state.value = 'deleted'
        } catch (error) {
            state.value = 'error'
            error.value = error
            console.log(error)
        }
    }

    const updateResult = (snapshot) => {
        let retValue = null
        const isQuerySnapshot = snapshot.query? true : false
        if(isQuerySnapshot){
            retValue = []
            snapshot.forEach((docItem) => {
                let retDoc = {
                    id: docItem.id,
                    data: {
                        ...docItem.data()
                    },
                    ref: docItem.ref
                }
                retValue.push(retDoc)
            })
        }else{
            retValue = {
                id: snapshot.id,
                data: {
                    ...snapshot.data()
                },
                ref: snapshot.ref
            }
        }
        result.value = retValue
        fetchDetails.value.query = isQuerySnapshot
        fetchDetails.value.lastUpdate = process.client ? new Date().getTime() : false
        if(process.client) state.value = 'fetched'
    }

    const fsSubscribe = async (subFunc) => {
        if(process.client){
            let unsubscribeFunction = null
            onUnmounted(() => {
                if(unsubscribeFunction) {
                    fetchDetails.value.subscription = false
                    unsubscribeFunction()
                }
            })
            try{
                state.value = 'fetch'
                //only allow one subscription at a time
                if(!fetchDetails.value.subscription){
                    fetchDetails.value.subscription = true
                    unsubscribeFunction = await subFunc($fs.firestore.connection, await $fs.firestore.lib())
                }
            } catch (error) {
                state.value = 'error'
                error.value = error
                console.log(error)
            }
        }
    }
    const fsFetch = async (fetchFunc) => {
        if (typeof fetchFunc !== 'function') {
            if(typeof reFetch.call === 'function') {
                await reFetch.call()
                return
            }else{
                throw new TypeError('Fetch must be a function')
            }
        }
        //fetch uses firestore web sdk and is only available on client side
        if(process.client){
            // Setup hook callbacks once per instance
            // cc https://github.com/nuxt/framework/blob/main/packages/nuxt3/src/app/composables/asyncData.ts
            const instance = getCurrentInstance()
            if (!instance._nuxtOnBeforeMountCbs) {
                const cbs = instance._nuxtOnBeforeMountCbs = []
                if (instance && process.client) {
                onBeforeMount(() => {
                    cbs.forEach((cb) => { cb() })
                    cbs.splice(0, cbs.length)
                })
                onUnmounted(() => cbs.splice(0, cbs.length))
                }
            }
            // cc https://github.com/nuxt/framework/blob/main/packages/nuxt3/src/app/composables/asyncData.ts
            reFetch.call = async (force) => {
                // Avoid fetching same key more than once at a time
                if (_asyncDataPromises[key] && !force) {
                  return _asyncDataPromises[key]
                }
                state.value = 'fetch'
                // TODO: Cancel previus promise
                // TODO: Handle immediate errors
                _asyncDataPromises[key] = Promise.resolve(fetchFunc($fs.firestore.connection, await $fs.firestore.lib()))
                  .then((fetchResult) => {
                    if(fetchResult){
                        updateResult(fetchResult)
                    }
                  })
                  .catch((fetchError) => {
                    state.value = 'error'
                    error.value = fetchError
                    console.log(fetchError)
                  })
                  .finally(() => {
                    state.value = 'fetched'
                    delete _asyncDataPromises[key]
                  })
                return _asyncDataPromises[key]
              }

            //only fetch if data are not hydrated yet 
            if(process.client && (!isHydrating || !result.value)){
                try{
                    instance._nuxtOnBeforeMountCbs.push(reFetch.call)
                } catch (error) {
                    state.value = 'error'
                    error.value = error
                    console.log(error)
                }
            }
            /*
            //TODO: implement long polling
            window.setInterval(() => {
                refresh()
            },2000)
            */
        }
    }

    const fsServerFetch = async (fetchFunc) => {
        if (typeof fetchFunc !== 'function') {
            throw new TypeError('Fetch must be a function')
        }
        if(process.server){
            try{
                const fetchResult = await fetchFunc({...$fs.firestore})
                updateResult(fetchResult)
            } catch (error) {
                state.value = 'error'
                error.value = error
                console.log(error)
            }   
        }
        //TODO: add function that hydrates 
        //serialize data if they are server side rendered and not serialized
        if(process.client && isHydrating){
            console.log('TODO: Serialize data')
            /*
                if(typeof data === 'object'){
                    if(data.hasOwnProperty('createdAt')) data.createdAt = data.createdAt.toDate()
                    if(data.hasOwnProperty('updatedAt')) data.updatedAt = data.updatedAt.toDate()
                }
            */
        }
    }
    return {
        setDoc: fsSetDoc,
        updateDoc: fsUpdateDoc,
        deleteDoc: fsDeleteDoc,
        updateResult: updateResult,
        subscribe: fsSubscribe,
        fetch: fsFetch,
        serverFetch: fsServerFetch,
        result: result,
        state: state,
        fetchDetails: fetchDetails,
        error: error
    }
}