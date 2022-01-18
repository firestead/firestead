import { getFirestore } from 'firebase-admin/firestore'
//TODO: Test if context is available -> import { useNuxtApp } from '#app'

export const testCall = async (req, res) => {
    const db = getFirestore()
    const snapshot = await db.collection('Todos').get()
    const retValue = []
    snapshot.forEach((doc) => {
        retValue.push({
            id: doc.id,
            data: {
                ...doc.data()
            }
        })
    })
    return retValue
}