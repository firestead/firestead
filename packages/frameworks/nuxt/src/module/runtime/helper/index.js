import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps } from 'firebase-admin/app'

export const createFirestore = () =>{
    //TODO: use own env name for dev or production -> NODE_ENV can be different depending on os etc 
    const env = process.env.NODE_ENV || 'production'
    const apps = getApps()
    if (!apps.length) {
        if(env === 'development') initializeApp()
        if(env === 'production') initializeApp()
    }
    const db = getFirestore()
    if(!apps.length && (env === 'development')){
        db.settings({
            host: "localhost:8080",
            ssl: false
        })
    }
    return db
}