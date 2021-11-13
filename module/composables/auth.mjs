import { useNuxtApp, useState } from '#app'

let auth = null

const postSessionCookie = async (authResp) => {
    const idToken = await authResp.user.getIdToken()
    //TODO: add csrfToken
    await fetch('/fsApi/session', {
        method: 'POST',
        body: JSON.stringify({idToken})
    })
}

export const useAuth = async () => {
    const { $fs } = useNuxtApp()
    const isAuthenticated = useState('FiresteadIsAuthenticated')
    const authState = useState('FiresteadAuth')
    let fsSignInWithEmailAndPassword = null
    let fsCreateUserWithEmailAndPassword = null
    let fsSignOut = null
    if(process.client){
        if(!auth) auth = await import('@firebase/auth').then(auth => auth.default || auth)
        fsSignInWithEmailAndPassword = async (email, password) => {
            const authResp = await auth.signInWithEmailAndPassword($fs.auth.connection, email, password)
            await postSessionCookie(authResp)
            return authResp
        }
        fsCreateUserWithEmailAndPassword = async (email, password) => {
            const authResp = await auth.createUserWithEmailAndPassword($fs.auth.connection, email, password)
            await postSessionCookie(authResp)
            return authResp
        }
        fsSignOut = () => auth.signOut($fs.auth.connection)
    }
    return {
        signInWithEmailAndPassword: fsSignInWithEmailAndPassword,
        createUserWithEmailAndPassword: fsCreateUserWithEmailAndPassword,
        signOut: fsSignOut,
        isAuthenticated,
        authState
    }
}