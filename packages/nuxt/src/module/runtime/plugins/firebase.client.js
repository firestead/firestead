import { defineNuxtPlugin } from '#app'
import { clientAuth, authUnsubscribe } from '#build/utils.auth.js'

export default defineNuxtPlugin(async (nuxtApp) => {
    const firesteadOptions = JSON.parse('<%= JSON.stringify(options) %>')

    let firebaseApp = null

    /*
    *   Init Firebase in lazy mode
    */
    const initFirebase = async () => {
        if(!firebaseApp){
            const { initializeApp, getApps } = await import('@firebase/app')
            const firebaseConfig = {
                projectId: firesteadOptions?.config?.projectId || 'default',
                apiKey: firesteadOptions?.config?.apiKey || '123456789',    
                authDomain: firesteadOptions?.config?.authDomain || '',
                databaseURL: firesteadOptions?.config?.databaseURL || '',
                storageBucket: firesteadOptions?.config?.storageBucket || 'default-bucket',
                messagingSenderId: firesteadOptions?.config?.messagingSenderId || '',
                appId: firesteadOptions?.config?.appId || ''
            }
            const apps = getApps()
            if (!apps.length) {
                firebaseApp = initializeApp(firebaseConfig)
            } else {
                firebaseApp = apps[0]
            }
        }
        return firebaseApp
    }

    /*
    * storage can be initialized with different buckets
    */
    const storage = async (bucket = null) => {
        const { getStorage } = await import('@firebase/storage')
        const firebaseApp = await initFirebase()
        if(bucket) return getStorage(firebaseApp, bucket)
        else return getStorage(firebaseApp)
    }
    /*
    *   initialize firebase with emulator
    *   TODO: just connect to enabled emulator
    */
    if(firesteadOptions.dev){
        /*
        *   In dev mode we need to initialize firebase with emulator
        */
        const firebaseApp = await initFirebase()
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

    /*
    *   You have to activate auth on firebase project, default is false
    */
    if(firesteadOptions.auth){
        const firebaseApp = await initFirebase()
        await clientAuth(nuxtApp, firebaseApp)
    }


    nuxtApp.provide('fs', {
        auth: {
            unsubscribe: authUnsubscribe,
            connection: async () => {
                const firebaseApp = await initFirebase()
                return (await import('@firebase/auth')).getAuth(firebaseApp)
            },
            options: {
                sessionUrl: '/fs/auth/session',
                signOutUrl: '/fs/auth/signout'
            },
            lib: async () => await import('@firebase/auth')
        },
        firestore: {
            connection: async () => {
                const firebaseApp = await initFirebase()
                return (await import('@firebase/firestore')).getFirestore(firebaseApp)
            },
            lib: async () => await import('@firebase/firestore')
        },
        functions: {
            connection: async () => {
                const firebaseApp = await initFirebase()
                return (await import('@firebase/functions')).getFunctions(firebaseApp)
            },
            lib: async () => await import('@firebase/functions')
        },
        storage:{
            connection: async (bucket) => await storage(bucket),
            lib: async () => await import('@firebase/storage')
        }
    })
})