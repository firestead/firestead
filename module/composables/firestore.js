import {onUnmounted, ref, reactive} from 'vue'
import { klona } from 'klona'
import { doc, collection, query, orderBy, onSnapshot, setDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "@firebase/firestore"

export const useFirestore = () => {
    const { $fs } = useNuxtApp()
    const fsDoc = (document) => doc($fs.firestore, document)
    const fsCollection = (collectionPath) => collection($fs.firestore, collectionPath)
    return {
        doc: fsDoc,
        getDocs,
        query,
        orderBy,
        collection: fsCollection,
        onSnapshot
    }
}

export const useFirestoreFetch = () => {
    const { $fs, callHook } = useNuxtApp()
    const data = ref(null)
    const status = {
        pending: reactive({
            fetch: false,
            create: false,
            update: false,
            delete: false
        }),
        update: ref(null),
        error: ref(null)
    }
    const fsSetDoc = async (refPath, newData, options={timestamps:true}) => {
        try {
            status.pending.create = true
            const docRef = doc(collection($fs.firestore, refPath))
            if(options.timestamps){
                newData = {
                    ...newData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'set' , refPath, newData)
            await setDoc(docRef, newData)
            status.pending.create = false 
        } catch (error) {
            status.error.value = error
            console.log(error)
        }
    }
    /*
        TODO: add options pick api to update only a few values of a document
        check merge strategie of firebase api
    */
    const fsUpdateDoc = async (index=null, options = {timestamps:true}) => {
        try {
            status.pending.update = true
            const refDoc = data.value[index].ref
            let dataUpdate = klona(data.value[index].data)
            if(options.timestamps){
                dataUpdate = {
                    ...dataUpdate,
                    updatedAt: serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'update', refDoc.path ,dataUpdate)
            await updateDoc(refDoc, dataUpdate)
            status.pending.update = false
        } catch (error) {
            console.log(error)
        }
    }

    const fsDeleteDoc = async (index=null, options = {}) => {
        status.pending.delete = true
        const refDoc = data.value[index].ref
        await deleteDoc(refDoc)
        status.pending.delete = false
    }

    const onDataUpdate = (snapshot) => {
        let retValue = null
        const isQuerySnapshot = snapshot.query? true : false
        status.update.value = new Date().getTime()
        if(isQuerySnapshot){
            retValue = []
            snapshot.forEach((doc) => {
                retValue.push({
                    id: doc.id,
                    data: {
                        ...doc.data()
                    },
                    ref: doc.ref
                })
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
        data.value = retValue
        status.pending.fetch = false
    }
    const fsSubscribe = async (subFunc) => {
        onUnmounted(() => {
            unsubscribeFunction()
        })
        status.pending.fetch = true
        const unsubscribeFunction = await subFunc()
    }
    const fsFetch = async (fetchFunc, options = {}) => {
        status.pending.fetch = true
        const fetchData = await fetchFunc()
        onDataUpdate(fetchData)
    }
    return {
        setDoc: fsSetDoc,
        updateDoc: fsUpdateDoc,
        deleteDoc: fsDeleteDoc,
        onDataUpdate,
        subscribe: fsSubscribe,
        fetch: fsFetch,
        data,
        status
    }
}