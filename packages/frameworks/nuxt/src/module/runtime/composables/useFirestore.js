import { useNuxtApp } from '#app'
import { onUnmounted, onBeforeMount, getCurrentInstance, toRefs, toRef, set } from '@vue/composition-api'
import { klona } from 'klona'

export const useFirestore = (key, options={}) => {
    if (typeof key !== 'string') {
        throw new TypeError('useFirestore key must be a string')
    }
    const { $fs, callHook, isHydrating, _asyncDataPromises, payload } = useNuxtApp()

    //add states
    if (!(`${key}FirestoreResult` in payload.state)) {
        set(payload.state, `${key}FirestoreResult`, payload.state[`${key}FirestoreResult`])
    }
    const result = toRef(payload.state, `${key}FirestoreResult`)
    if (!(`${key}FirestoreState` in payload.state)) {
        set(payload.state, `${key}FirestoreState`, {
            pending: false,
            fetching: false,
            creating: false,
            updating: false,
            deleting: false,
            error: false
        })
    }
    const state = payload.state[`${key}FirestoreState`]
    if (!(`${key}FirestoreFetchDetails` in payload.state)){
        if(payload.state[`${key}FirestoreFetchDetails`]){
            set(payload.state, `${key}FirestoreFetchDetails`, payload.state[`${key}FirestoreFetchDetails`])
        }else{
            set(payload.state, `${key}FirestoreFetchDetails`, {
                query: null,
                lastUpdate: null,
                subscription: null
            })
        }
    }
    const fetchDetails = payload.state[`${key}FirestoreFetchDetails`]

    const reFetch = {}

    const setState = (changedState, val) => {
        if(changedState==='error'){
            state.error = val
            state.pending = false
            state.fetching = false
            state.creating = false
            state.updating = false
            state.deleting = false
        }
        else{
            state[changedState] = val
            state.pending = val
            state.error = false
        }
    }

    
    const fsSetDoc = async (refPath, newData, options={timestamps:true}) => {
        try {
            const { doc, collection, setDoc, serverTimestamp } = await $fs.firestore.lib()
            setState('creating', true)
            const docRef = doc(collection($fs.firestore.connection,refPath))
            if(options.timestamps){
                newData = {
                    ...newData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
            //Todo: use functions set with options to change data
            //await callHook('fs:firestore:data', 'set' , refPath, newData)
            await setDoc(docRef, newData)
            setState('creating', false)
        } catch (error) {
            setState('error', error)
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
            setState('updating', true)
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
            setState('updating', false)
        } catch (error) {
            setState('error', error)
            console.log(error)
        }
    }

    const fsDeleteDoc = async (index=null, options = {}) => {
        try {
            const { deleteDoc } = await $fs.firestore.lib()
            setState('deleting', true)
            const refDoc = result.value[index].ref
            await deleteDoc(refDoc)
            setState('deleting', false)
        } catch (error) {
            setState('error', error)
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
        fetchDetails.query = isQuerySnapshot
        fetchDetails.lastUpdate = process.client ? new Date().getTime() : false
        if(process.client) {
            setState('fetching', false)
        }
    }

    const fsSubscribe = async (subFunc) => {
        if(process.client){
            let unsubscribeFunction = null
            onUnmounted(() => {
                if(unsubscribeFunction) {
                    fetchDetails.subscription = false
                    unsubscribeFunction()
                }
            })
            try{
                setState('fetching', true)
                //only allow one subscription at a time
                if(!fetchDetails.subscription){
                    fetchDetails.subscription = true
                    unsubscribeFunction = await subFunc($fs.firestore.connection, await $fs.firestore.lib())
                }
            } catch (error) {
                setState('error', error)
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
                setState('fetching', true)
                // TODO: Cancel previus promise
                // TODO: Handle immediate errors
                _asyncDataPromises[key] = Promise.resolve(fetchFunc($fs.firestore.connection, await $fs.firestore.lib()))
                  .then((fetchResult) => {
                    if(fetchResult){
                        updateResult(fetchResult)
                    }
                  })
                  .catch((fetchError) => {
                    setState('error', fetchError)
                    console.log(fetchError)
                  })
                  .finally(() => {
                    delete _asyncDataPromises[key]
                  })
                return _asyncDataPromises[key]
              }

            //only fetch if data are not hydrated yet 
            if(process.client && (!isHydrating || !result.value)){
                try{
                    instance._nuxtOnBeforeMountCbs.push(reFetch.call)
                } catch (error) {
                    setState('error', error)
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
                const fetchResult = await fetchFunc($fs.firestore.db)
                updateResult(fetchResult)
            } catch (error) {
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
        state: toRefs(state),
        fetchDetails: toRefs(fetchDetails)
    }
}