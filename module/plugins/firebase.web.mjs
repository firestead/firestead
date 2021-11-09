import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from "@firebase/app"
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore"
import { getAuth, connectAuthEmulator } from "@firebase/auth"
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getStorage, connectStorageEmulator } from "@firebase/storage"

export default defineNuxtPlugin((nuxtApp) => {
    const firesteadOptions = JSON.parse('<%= JSON.stringify(options) %>')
    const firebaseConfig = {
        apiKey: firesteadOptions?.config?.apiKey || '123456789',
        authDomain: firesteadOptions?.config?.authDomain || '',
        databaseURL: firesteadOptions?.config?.databaseURL || '',
        projectId: firesteadOptions?.config?.projectId || '',
        storageBucket: firesteadOptions?.config?.storageBucket || 'default',
        messagingSenderId: firesteadOptions?.config?.messagingSenderId || '',
        appId: firesteadOptions?.config?.appId || ''
    }

    let firebaseApp = null
    const apps = getApps()
    if (!apps.length) {
        firebaseApp = initializeApp(firebaseConfig)
    } else {
        firebaseApp = apps[0]
    }

    const auth = getAuth(firebaseApp)
    const firestore = getFirestore(firebaseApp)
    const functions = getFunctions(firebaseApp)
    const storage = (bucket = null) => {
        if(bucket) return getStorage(firebaseApp, bucket)
        else return getStorage(firebaseApp)
    }
    if(firesteadOptions.dev){
        connectFunctionsEmulator(functions, "localhost", 5001)
        connectFirestoreEmulator(firestore, 'localhost', 8080)
        connectStorageEmulator(storage(), "localhost", 9199)
        connectAuthEmulator(auth, "http://localhost:9099")
    }

    nuxtApp.provide('fs', {
        auth,
        firestore,
        functions,
        storage
    })
})