import { useNuxtApp } from '#app'
import { onUnmounted, onBeforeMount, getCurrentInstance, toRefs, toRef, set, computed } from '@vue/composition-api'
import { klona } from 'klona'

export const useFirestore = (key, firestoreOptions={}) => {
    if (typeof key !== 'string') {
        throw new TypeError('useFirestore key must be a string')
    }
    const { $fs, isHydrating, _asyncDataPromises, payload } = useNuxtApp()

    //hydrate and get store from global payload -> firestoreData
    if (!(`${key}FirestoreResult` in payload.state)) {
        set(payload.state, `${key}FirestoreResult`, payload.state[`${key}FirestoreResult`])
    }
    const firestoreData = toRef(payload.state, `${key}FirestoreResult`)

    //hydrate and get store from global payload -> fetchState
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

    //hydrate and get store from global payload -> fetchDetails
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
    let filterActive = false

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
            const refDoc = firestoreData.value[index].ref
            let dataUpdate = klona(firestoreData.value[index].data)
            if(options.timestamps){
                dataUpdate = {
                    ...dataUpdate,
                    updatedAt: serverTimestamp()
                }
            }
            //TODO: add callback function to change data before update
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
            const refDoc = firestoreData.value[index].ref
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
        firestoreData.value = retValue
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
    const fsFetch = async (fetchFunc, options = {}) => {
        console.log('filter active',filterActive)
        //refetch
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

            //only fetch if fetch criteria are met
            const callFetchCriteria = () => {
                // fetch always if foreceFetch is set
                if(options.forceFetch ? true: false) return true
                // fetch if data are not hydrated and no data available
                if(!isHydrating && !firestoreData.value) return true
                // fetch if data are hydrated but no data available
                if(isHydrating && !firestoreData.value) return true
                // fetch if filter not set but data available and no hydration
                if(!filterActive && (firestoreData.value ? true: false && !isHydrating)) return true
                // if criteria not met don't fetch
                return false
            }

            if(callFetchCriteria()){
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

    const filter = (fn, returnFirst) => {
        filterActive = true
        return computed(()=>{
            if(typeof fn === 'function' && firestoreData.value){
                if(returnFirst) return firestoreData.value.filter(fn)[0]
                else return firestoreData.value.filter(fn)
            }
        })
    }

    return {
        setDoc: fsSetDoc,
        updateDoc: fsUpdateDoc,
        deleteDoc: fsDeleteDoc,
        updateResult: updateResult,
        subscribe: fsSubscribe,
        fetch: fsFetch,
        serverFetch: fsServerFetch,
        filter: filter,
        result: firestoreData,
        state: toRefs(state),
        fetchDetails: toRefs(fetchDetails)
    }
}