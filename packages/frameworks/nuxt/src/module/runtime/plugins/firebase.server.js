import { defineNuxtPlugin  } from '#app'
import { serverAuth } from '#build/utils.auth.js'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineNuxtPlugin(async (nuxtApp) => {
    const firesteadOptions = JSON.parse('<%= JSON.stringify(options) %>')
    const apps = getApps()
    if(!apps.length) initializeApp()
    const firestoreDb = getFirestore()
    //it is only allowed to set settings once
    if(firesteadOptions.dev && !apps.length){
        firestoreDb.settings({
            host: "localhost:8080",
            ssl: false
        })
    }

    await serverAuth(nuxtApp)
    // firestore admin sdk can not be async loaded in composable, so it must be provided in the context
    // TODO: check if this is a bug in nuxt 3
    nuxtApp.provide('fs', {
        firestore: {
            db: firestoreDb
        }
    })
})