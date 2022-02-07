import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from "@firebase/app"
import { getFirestore, connectFirestoreEmulator } from "@firebase/firestore"
import { getAuth, connectAuthEmulator } from "@firebase/auth"
import { getFunctions, connectFunctionsEmulator } from '@firebase/functions'
import { getStorage, connectStorageEmulator } from "@firebase/storage"
import { clientAuth, authUnsubscribe } from '#build/utils.auth.js'

export default defineNuxtPlugin(async (nuxtApp) => {
    const firesteadOptions = JSON.parse('<%= JSON.stringify(options) %>')
    const firebaseConfig = {
        apiKey: firesteadOptions?.config?.apiKey || '123456789',    
        authDomain: firesteadOptions?.config?.authDomain || '',
        databaseURL: firesteadOptions?.config?.databaseURL || '',
        projectId: firesteadOptions?.config?.projectId || 'default',
        storageBucket: firesteadOptions?.config?.storageBucket || 'default-bucket',
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

    const authConnection = getAuth(firebaseApp)
    const firestoreDb = getFirestore(firebaseApp)
    const functionsConnection = getFunctions(firebaseApp)
    const storage = (bucket = null) => {
        if(bucket) return getStorage(firebaseApp, bucket)
        else return getStorage(firebaseApp)
    }
    if(firesteadOptions.dev){
        connectFunctionsEmulator(functionsConnection, "localhost", 5001)
        connectFirestoreEmulator(firestoreDb, 'localhost', 8080)
        connectStorageEmulator(storage(), "localhost", 9199)
        connectAuthEmulator(authConnection, "http://localhost:9099")
    }

    //auth user
    await clientAuth(nuxtApp, authConnection)


    nuxtApp.provide('fs', {
        auth: {
            unsubscribe: authUnsubscribe,
            connection: authConnection,
            options: {
                sessionUrl: '/api/auth/session',
                signOutUrl: '/api/auth/signout'
            },
            lib: async () => await import('@firebase/auth')
        },
        firestore: {
            connection: firestoreDb,
            lib: async () => await import('@firebase/firestore')
        },
        functions: {
            connection: functionsConnection,
            lib: async () => await import('@firebase/functions')
        },
        storage:{
            connection: storage(),
            lib: async () => await import('@firebase/storage')
        }
    })
})