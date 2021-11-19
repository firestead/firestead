import { useNuxtApp, useState } from '#app'

const postSessionCookie = async (authResp) => {
    const idToken = await authResp.user.getIdToken()
    //TODO: add csrfToken
    await fetch('/fsApi/auth/session', {
        method: 'POST',
        body: JSON.stringify({idToken})
    })
}

export const useAuth = () => {
    const { $fs } = useNuxtApp()
    const isAuthenticated = useState('FiresteadIsAuthenticated')
    const authState = useState('FiresteadAuth')

    const fsSignInWithEmailAndPassword = async (email, password) => {
        const { signInWithEmailAndPassword } = await $fs.auth.lib()
        const authResp = await signInWithEmailAndPassword($fs.auth.connection, email, password)
        await postSessionCookie(authResp)
        return authResp
    }

    const fsCreateUserWithEmailAndPassword = async (email, password) => {
        const { createUserWithEmailAndPassword } = await $fs.auth.lib()
        const authResp = await createUserWithEmailAndPassword($fs.auth.connection, email, password)
        await postSessionCookie(authResp)
        return authResp
    }

    const fsSignOut = async () => {
        const { signOut } = await $fs.auth.lib()
        await signOut($fs.auth.connection)
        await fetch('/fsApi/auth/signout', {
            method: 'POST'
        })
    }
    return {
        signInWithEmailAndPassword: fsSignInWithEmailAndPassword,
        createUserWithEmailAndPassword: fsCreateUserWithEmailAndPassword,
        signOut: fsSignOut,
        isAuthenticated,
        authState
    }
}