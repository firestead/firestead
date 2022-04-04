import { useNuxtApp } from '#app'
import { onUnmounted, onBeforeMount, getCurrentInstance, toRefs, toRef, computed } from 'vue'

export const useFirestore = (key, firestoreOptions={}) => {
    if (typeof key !== 'string') {
        throw new TypeError('useFirestore key must be a string')
    }
    const { $fs, _asyncDataPromises, payload } = useNuxtApp()

    //hydrate and get store from global payload -> firestoreData
    const firestoreData = toRef(payload.state, `${key}FirestoreResult`)

    //hydrate and get store from global payload -> fetchState
    if (!(`${key}FirestoreState` in payload.state)) {
        payload.state[`${key}FirestoreState`] = {
            pending: false,
            fetching: false,
            creating: false,
            updating: false,
            deleting: false,
            error: false
        }
    }
    const state = payload.state[`${key}FirestoreState`]

    //hydrate and get store from global payload -> fetchDetails
    if (!(`${key}FirestoreFetchDetails` in payload.state)){
        payload.state[`${key}FirestoreFetchDetails`]  = {
            query: null,
            lastUpdate: null,
            subscription: null,
            filter: false,
            isHydrating: process.server
        }
    }
    const fetchDetails = payload.state[`${key}FirestoreFetchDetails`]

    const reFetch = {}

    //handle correct fetching state
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
    /*
    * get the correct ref of the refIdentifier
    * allowed identifiers: index as number, id as string, object as firestoreData object
    */
    const getDocRef = (refIdentifier) => {
        let docRef = null
        if(fetchDetails.query){
            if((typeof refIdentifier === 'number')){
                docRef = firestoreData.value[refIdentifier].ref
            }
            if(typeof refIdentifier === 'string'){
                const selDoc = firestoreData.value.find(doc => doc.id === refIdentifier)
                if(typeof selDoc !== 'undefined'){
                    docRef = selDoc.ref
                }
            }
            if(typeof refIdentifier === 'object'){
                const selDoc = firestoreData.value.find(doc => doc.id === refIdentifier.id)
                if(typeof selDoc !== 'undefined'){
                    docRef = selDoc.ref
                }
            }
        }else{
            docRef = firestoreData.value.ref
        }
        if(!docRef) throw new Error('No valid refIdentifier given')
        return docRef
    }

    
    const fsSetDoc = async (refPath, newData, options={timestamps:true}) => {
        try {
            const connection = await $fs.firestore.connection()
            const { doc, collection, setDoc, serverTimestamp } = await $fs.firestore.lib()
            setState('creating', true)
            const docRef = doc(collection(connection,refPath))
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
    const fsUpdateDoc = async (refIdentifier=null, dataUpdate,options = {timestamps:true}) => {
        try {
            setState('updating', true)
            const { updateDoc, serverTimestamp } = await $fs.firestore.lib()
            const docRef = getDocRef(refIdentifier)
            if(options.timestamps){
                dataUpdate = {
                    ...dataUpdate,
                    updatedAt: serverTimestamp()
                }
            }
            //TODO: add callback function to change data before update
            await updateDoc(docRef, dataUpdate)
            setState('updating', false)
        } catch (error) {
            setState('error', error)
            console.log(error)
        }
    }

    const fsDeleteDoc = async (refIdentifier=null, options = {}) => {
        try {
            const { deleteDoc } = await $fs.firestore.lib()
            setState('deleting', true)
            const docRef = getDocRef(refIdentifier)
            await deleteDoc(docRef)
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
                // TODO: check if you need multiple subscriptions for different components
                if(!fetchDetails.subscription){
                    fetchDetails.isHydrating = false
                    fetchDetails.subscription = true
                    unsubscribeFunction = await subFunc(await $fs.firestore.connection(), await $fs.firestore.lib())
                }
            } catch (error) {
                setState('error', error)
                console.log(error)
            }
        }
    }
    const fsFetch = async (fetchFunc, options = {}) => {
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
                _asyncDataPromises[key] = Promise.resolve(fetchFunc(await $fs.firestore.connection(), await $fs.firestore.lib()))
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
              /* Keep for debugging             
              console.log('hydration',fetchDetails.isHydrating)
              console.log('Fetch - fetch always if foreceFetch is set',options.forceFetch ? true: false)
              console.log('Fetch - prevent fetch if preventFetch is set and data are available',((options.preventFetch ? true: false) && (firestoreData.value ? true: false)))
              console.log('Fetch - fetch if data are not hydrated and no data available',(!fetchDetails.isHydrating && !firestoreData.value))
              console.log('Fetch - fetch if data are hydrated but no data available',(fetchDetails.isHydrating && !firestoreData.value))
              console.log('Fetch - fetch if filter not set but data available and no hydration',(!fetchDetails.filter && ((firestoreData.value ? true: false) && !fetchDetails.isHydrating)))
              */
              //only fetch if fetch criteria are met
            const checkFetchCriteria = () => {
                // fetch always if foreceFetch is set
                if(options.forceFetch ? true: false) return true
                // prevent fetch if preventFetch is set and data are available
                if((options.preventFetch ? true: false) && (firestoreData.value ? true: false)) return false
                // fetch if data are not hydrated and no data available
                if(!fetchDetails.isHydrating && !firestoreData.value) return true
                // fetch if data are hydrated but no data available
                if(fetchDetails.isHydrating && !firestoreData.value) return true
                // fetch if filter not set but data available and no hydration
                if(!fetchDetails.filter && ((firestoreData.value ? true: false) && !fetchDetails.isHydrating)) return true
                // if criteria not met don't fetch
                return false
            }

            if(checkFetchCriteria()){
                try{
                    fetchDetails.isHydrating = false
                    //add debounce  or fetch immediately
                    if((options.debounce ? true: false)&&(typeof options.debounce === Number)){
                        window.setInterval(() => {
                            instance._nuxtOnBeforeMountCbs.push(reFetch.call)
                        },options.debounce)
                    }else{
                        instance._nuxtOnBeforeMountCbs.push(reFetch.call)
                    }
                } catch (error) {
                    setState('error', error)
                    console.log(error)
                }
            }
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
        if(process.client && fetchDetails.isHydrating){
            fetchDetails.isHydrating = false
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
        fetchDetails.filter = true
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