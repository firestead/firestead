//import { getFirestore } from 'firebase-admin/firestore'
import runtimeConfig from '#config'

export default async (req, res) => {
    console.log(runtimeConfig)
    //const db = getFirestore()
    const snapshot = await req.firestore.collection('Todos').get()
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