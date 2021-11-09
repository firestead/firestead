import { useNuxtApp, useState } from '#app'
import { onUnmounted } from 'vue'
import { klona } from 'klona'

let firestore = null

export const useFirestore = async ($fs = null) => {
    let fsDoc = null
    let fsCollection = null
    //firebase web sdk is working only on client side
    if(process.client){
        if(!$fs) $fs = useNuxtApp().$fs
        if(!firestore) firestore = await import('@firebase/firestore').then(firestore => firestore.default || firestore)
        fsDoc = (docPathOrCollection) => {
            if(typeof docPathOrCollection === 'string') return firestore.doc($fs.firestore, docPathOrCollection)
            else return firestore.doc(docPathOrCollection)
        }
        fsCollection = (collectionPath) => firestore.collection($fs.firestore, collectionPath)
    }
    return {
        doc: fsDoc,
        setDoc: firestore?.setDoc || null,
        updateDoc: firestore?.updateDoc || null,
        deleteDoc: firestore?.deleteDoc || null,
        serverTimestamp: firestore?.serverTimestamp || null,
        getDocs: firestore?.getDocs || null,
        query: firestore?.query || null,
        orderBy: firestore?.orderBy || null,
        collection: fsCollection,
        onSnapshot: firestore?.onSnapshot || null,
    }
}

export const useFirestoreAdmin = () => {
    const { $fs } = useNuxtApp()
    return {
        db: $fs.firestore?.db || null
    }
}

export const useFirestoreFetch = (key='default', options={}) => {
    const { $fs, callHook } = useNuxtApp()
    const result = useState(`${key}FirestoreResult`)
    const fetchDetails = useState(`${key}FirestoreFetchDetails`,()=>{return {}})
    const state = useState(`${key}FirestoreState`)
    const error = useState(`FiresteadError`)
    
    
    const fsSetDoc = async (refPath, newData, options={timestamps:true}) => {
        try {
            const { doc, collection, setDoc, serverTimestamp } = await useFirestore($fs)
            state.value = 'create'
            const docRef = doc(collection(refPath))
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
            const { updateDoc, serverTimestamp } = await useFirestore($fs)
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
            const { deleteDoc } = await useFirestore($fs)
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
        fetchDetails.value.ssr = process.server
        fetchDetails.value.query = isQuerySnapshot
        fetchDetails.value.shouldSerialize = process.server
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
                    unsubscribeFunction = await subFunc({...await useFirestore($fs)})
                }
            } catch (error) {
                state.value = 'error'
                error.value = error
                console.log(error)
            }
        }
        //fetch should be called next time again if data are server side rendered
        if(fetchDetails.value?.ssr && process.client) fetchDetails.value.ssr = false
    }
    const fsFetch = async (fetchFunc) => {
        //only fetch if data are not hydrated yet 
        if(process.client && !fetchDetails.value?.ssr){
            try{
                state.value = 'fetch'
                const fetchResult = await fetchFunc({...await useFirestore($fs)})
                if(fetchResult){
                    updateResult(fetchResult)
                }
            } catch (error) {
                state.value = 'error'
                error.value = error
                console.log(error)
            }
        }
        //fetch should be called next time again if data are server side rendered
        if(process.client && fetchDetails.value?.ssr) fetchDetails.value.ssr = false
    }
    const fsServerFetch = async (fetchFunc) => {
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
        if(process.client && fetchDetails.value?.shouldSerialize){
            console.log('TODO: Serialize data')
            fetchDetails.value.shouldSerialize = false
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

const serializeData = (data) => {
    if(typeof data === 'object'){
        if(data.hasOwnProperty('createdAt')) data.createdAt = data.createdAt.toDate()
        if(data.hasOwnProperty('updatedAt')) data.updatedAt = data.updatedAt.toDate()
    }
    return data
}