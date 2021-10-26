import { initializeApp, getApps } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { defineNuxtPlugin } from '#app'
import optionsLoader from '#build/firestead.options.js';

//https://github.com/vuejs/vuefire/blob/master/packages/vuefire/src/firestore.ts
//https://stackoverflow.com/questions/59114128/how-to-add-global-funtions-like-create-methods-mounted-from-a-plugin-in-vue
//https://thewebdev.info/2020/04/09/vue-js-mixins-global-mixins-and-custom-merge-strategies/

export default defineNuxtPlugin(async (nuxtApp) => {
    const firesteadOptions = await optionsLoader()
    const firebaseConfig = {
        apiKey: firesteadOptions?.config?.apiKey || '',
        authDomain: firesteadOptions?.config?.authDomain || '',
        databaseURL: firesteadOptions?.config?.databaseURL || '',
        projectId: firesteadOptions?.config?.projectId || '',
        storageBucket: firesteadOptions?.config?.storageBucket || '',
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
    if(firesteadOptions.dev){
        connectFunctionsEmulator(functions, "localhost", 5001)
        connectFirestoreEmulator(firestore, 'localhost', 8080)
        connectAuthEmulator(auth, "http://localhost:9099")
    }
    nuxtApp.vueApp.provide('fs', {
        auth,
        firestore,
        functions
    })
    nuxtApp.provide('fs', {
        auth,
        firestore,
        functions
    })
})