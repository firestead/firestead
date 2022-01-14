import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let firestore = null

export default (req, res, next) => {
    console.log('Firebase Middleware')
    const apps = getApps()
    if (!apps.length) {
        initializeApp({ 
            projectId: 'default'
        })
    }
    if(!firestore) {
        firestore = getFirestore()
        firestore.settings({
            host: "localhost:8080",
            ssl: false
        })
    }
    next()
}