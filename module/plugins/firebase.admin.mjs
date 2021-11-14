import { defineNuxtPlugin  } from '#app'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { serverAuth } from '#build/utils.auth.js'

export default defineNuxtPlugin(async (nuxtApp) => {
    const apps = getApps()
    if (!apps.length) {
        initializeApp({ 
            projectId: 'default'
        })
    }
    const firestoreDb = getFirestore()
    //it is only allowed to set settings once
    if(!apps.length){
        firestoreDb.settings({
            host: "localhost:8080",
            ssl: false
        })
    }
    const { req, res } = nuxtApp.ssrContext
    await serverAuth(req, res)

    // firestore admin sdk can not be async loaded in composable, so it must be provided in the context
    // TODO: check if this is a bug in nuxt 3
    nuxtApp.provide('fs', {
        firestore: {
            db: firestoreDb
        }
    })
})