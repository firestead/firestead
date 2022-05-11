import {createFirestore} from '@firestead/nuxt/helper'

export default async (req, res) => {
    const db = createFirestore()
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