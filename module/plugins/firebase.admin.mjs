import { defineNuxtPlugin  } from '#app'
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { serverAuth } from '#build/utils.auth.js'

let firestore = null
let auth = null

export default defineNuxtPlugin(async (nuxtApp) => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
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
    if(!auth) {
        auth = getAuth()
    }

    await serverAuth(nuxtApp.ssrContext.req, auth)

    nuxtApp.provide('fs', {
        firestore: {
            connection: firestore
        },
        auth:{
            connection: auth
        }
    })
})