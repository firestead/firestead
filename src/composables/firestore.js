import {onUnmounted} from 'vue'
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

export const handleFirestoreData = (refEl,snapshot) => {
    refEl.value = snapshot
}

export const useFirestoreSubscribe = async (subFunc) => {
    onUnmounted(() => {
        unsubscribeFunctions()
        console.log("Component is onUnmounted!");
    })
    const unsubscribeFunctions = await subFunc()
    const save = () => {}
    const update = () => {}
    const remove = () => {}
    return {
        save,
        update,
        remove
    }
  }