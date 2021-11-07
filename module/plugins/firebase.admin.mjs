import { defineNuxtPlugin  } from '#app'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export default defineNuxtPlugin(async (nuxtApp) => {
    let firebaseApp = null
    const apps = getApps()
    if (!apps.length) {
        firebaseApp = initializeApp()
    } else {
        firebaseApp = apps[0]
    }
    const firestore = getFirestore()

    nuxtApp.provide('fs', {
        firestore
    })
})