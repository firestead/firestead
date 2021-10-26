import {onUnmounted, ref} from 'vue'
import { doc, collection, query, orderBy, onSnapshot, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"

export const useFirestore = () => {
    //TODO: import lazy??? 
    return {
        doc,
        query,
        orderBy,
        collection,
        onSnapshot
    }
}

export const useFirestoreCollection = (document) =>{
    const fs = useFirestead()
    return collection(fs.firestore, document)
}

export const useFirestoreData = () => {
    const data = ref(null)
    const save = () => {}
    const update = () => {}
    const remove = () => {}
    const firestoreUpdate = () => {}
    return {
        save,
        update,
        remove,
        firestoreUpdate,
        data
    }
}

export const useFirestoreSubscribe = async (subFunc) => {
    onUnmounted(() => {
        unsubscribeFunctions()
        console.log("Component is onUnmounted! 2");
    })
    const unsubscribeFunctions = await subFunc()
  }