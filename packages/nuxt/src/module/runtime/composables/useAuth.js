import { useNuxtApp } from '#app'
import { toRefs } from '@vue/composition-api'

const postSessionCookie = async (authResp) => {
    const { $fs } = useNuxtApp()
    const idToken = await authResp.user.getIdToken()
    //TODO: add csrfToken
    await fetch($fs.auth.options.sessionUrl, {
        method: 'POST',
        body: JSON.stringify({idToken})
    })
}

const fsSignInWithEmailAndPassword = async (email, password) => {
    const { $fs } = useNuxtApp()
    const { signInWithEmailAndPassword } = await $fs.auth.lib()
    const authResp = await signInWithEmailAndPassword(await $fs.auth.connection(), email, password)
    await postSessionCookie(authResp)
    return authResp
}

const fsCreateUserWithEmailAndPassword = async (email, password) => {
    const { $fs } = useNuxtApp()
    const { createUserWithEmailAndPassword } = await $fs.auth.lib()
    const authResp = await createUserWithEmailAndPassword(await $fs.auth.connection(), email, password)
    await postSessionCookie(authResp)
    return authResp
}

const fsSignOut = async () => {
    const { $fs } = useNuxtApp()
    const { signOut } = await $fs.auth.lib()
    await signOut(await $fs.auth.connection())
    await fetch($fs.auth.options.signOutUrl, {
        method: 'POST'
    })
}

export const useAuth = () => {
    const { payload } = useNuxtApp()
    const { FirebaseAuth } = payload.state

    return {
        signInWithEmailAndPassword: fsSignInWithEmailAndPassword,
        createUserWithEmailAndPassword: fsCreateUserWithEmailAndPassword,
        signOut: fsSignOut,
        ...toRefs(FirebaseAuth)
    }
}