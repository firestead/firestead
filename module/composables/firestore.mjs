import { useNuxtApp } from '#app'
import { ref, reactive, onUnmounted } from 'vue'
import { klona } from 'klona'

let firestore = null

//const myLib = await import('my-lib').then(lib => lib.default || lib)
export const useFirestore = async () => {
    const { $fs } = useNuxtApp()
    firestore = firestore ? firestore : await import('@firebase/firestore').then(firestore => firestore.default || firestore)
    const fsDoc = (document) => firestore.doc($fs.firestore, document)
    const fsCollection = (collectionPath) => firestore.collection($fs.firestore, collectionPath)
    return {
        doc: fsDoc,
        setDoc: firestore.setDoc,
        updateDoc: firestore.updateDoc,
        deleteDoc: firestore.deleteDoc,
        serverTimestamp: firestore.serverTimestamp,
        getDocs: firestore.getDocs,
        query: firestore.query,
        orderBy: firestore.orderBy,
        collection: fsCollection,
        onSnapshot: firestore.onSnapshot
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
            const docRef = firestore.doc(firestore.collection($fs.firestore, refPath))
            if(options.timestamps){
                newData = {
                    ...newData,
                    createdAt: firestore.serverTimestamp(),
                    updatedAt: firestore.serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'set' , refPath, newData)
            await firestore.setDoc(docRef, newData)
            status.pending.create = false 
        } catch (error) {
            status.error.value = error
            console.log(error)
        }
    }
    //
    //    TODO: add options pick api to update only a few values of a document
    //    check merge strategie of firebase api
    //
    const fsUpdateDoc = async (index=null, options = {timestamps:true}) => {
        try {
            status.pending.update = true
            const refDoc = data.value[index].ref
            let dataUpdate = klona(data.value[index].data)
            if(options.timestamps){
                dataUpdate = {
                    ...dataUpdate,
                    updatedAt: firestore.serverTimestamp()
                }
            }
            await callHook('fs:firestore:data', 'update', refDoc.path ,dataUpdate)
            await firestore.updateDoc(refDoc, dataUpdate)
            status.pending.update = false
        } catch (error) {
            console.log(error)
        }
    }

    const fsDeleteDoc = async (index=null, options = {}) => {
        status.pending.delete = true
        const refDoc = data.value[index].ref
        await firestore.deleteDoc(refDoc)
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
        if(process.client){
            onUnmounted(() => {
                unsubscribeFunction()
            })
            status.pending.fetch = true
            const unsubscribeFunction = await subFunc()
        }
    }
    const fsFetch = async (fetchFunc, options = {}) => {
        if(process.client){
            status.pending.fetch = true
            const fetchData = await fetchFunc()
            onDataUpdate(fetchData)
        }
    }
    return {
        setDoc: fsSetDoc,
        updateDoc: fsUpdateDoc,
        deleteDoc: fsDeleteDoc,
        onDataUpdate: onDataUpdate,
        subscribe: fsSubscribe,
        fetch: fsFetch,
        data: data,
        status: status
    }
}