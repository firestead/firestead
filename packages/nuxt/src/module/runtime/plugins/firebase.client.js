import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from "@firebase/app"
import { clientAuth, authUnsubscribe } from '#build/utils.auth.js'

export default defineNuxtPlugin(async (nuxtApp) => {
    const firesteadOptions = JSON.parse('<%= JSON.stringify(options) %>')
    const firebaseConfig = {
        projectId: firesteadOptions?.config?.projectId || 'default',
        apiKey: firesteadOptions?.config?.apiKey || '123456789',    
        authDomain: firesteadOptions?.config?.authDomain || '',
        databaseURL: firesteadOptions?.config?.databaseURL || '',
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

    const storage = async (bucket = null) => {
        const { getStorage } = await import('@firebase/storage')
        if(bucket) return getStorage(firebaseApp, bucket)
        else return getStorage(firebaseApp)
    }
    /*
    *   initialize firebase with emulator
    *   TODO: just connect to enabled emulator
    */
    if(firesteadOptions.dev){
        /*
        * Connect to firebase function emulator
        * TODO: make port configurable
        */
        const { getFunctions, connectFunctionsEmulator } = await import('@firebase/functions')
        connectFunctionsEmulator(getFunctions(firebaseApp), "localhost", 5001)
        /*
        * Connect to firebase firestore emulator
        * TODO: make port configurable
        */
        const { getFirestore, connectFirestoreEmulator } =  await import('@firebase/firestore')
        connectFirestoreEmulator(getFirestore(firebaseApp), 'localhost', 8080)
        /*
        * Connect to firebase storage emulator
        * TODO: make port configurable
        */
        const { connectStorageEmulator } = await import('@firebase/storage')
        connectStorageEmulator(await storage(), "localhost", 9199)
        /*
        * Connect to firebase auth emulator
        * TODO: make port configurable
        */
        const { getAuth, connectAuthEmulator } = await import('@firebase/auth')
        connectAuthEmulator(getAuth(firebaseApp), "http://localhost:9099")
    }

    //auth user
    await clientAuth(nuxtApp, firebaseApp)


    nuxtApp.provide('fs', {
        auth: {
            unsubscribe: authUnsubscribe,
            connection: async () => (await import('@firebase/auth')).getAuth(firebaseApp),
            options: {
                sessionUrl: '/api/auth/session',
                signOutUrl: '/api/auth/signout'
            },
            lib: async () => await import('@firebase/auth')
        },
        firestore: {
            connection: async () => (await import('@firebase/firestore')).getFirestore(firebaseApp),
            lib: async () => await import('@firebase/firestore')
        },
        functions: {
            connection: async () => (await import('@firebase/functions')).getFunctions(firebaseApp),
            lib: async () => await import('@firebase/functions')
        },
        storage:{
            connection: async (bucket) => storage(bucket),
            lib: async () => await import('@firebase/storage')
        }
    })
})