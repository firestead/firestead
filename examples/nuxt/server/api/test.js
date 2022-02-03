import { getFirestore } from '@firestead/nuxt'
import config from '#config'

export default async (req, res) => {
    // import firetore not working with jiti
    /*
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
    */
}