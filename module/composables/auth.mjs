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
    const authResp = await signInWithEmailAndPassword($fs.auth.connection, email, password)
    await postSessionCookie(authResp)
    return authResp
}

const fsCreateUserWithEmailAndPassword = async (email, password) => {
    const { $fs } = useNuxtApp()
    const { createUserWithEmailAndPassword } = await $fs.auth.lib()
    const authResp = await createUserWithEmailAndPassword($fs.auth.connection, email, password)
    await postSessionCookie(authResp)
    return authResp
}

const fsSignOut = async () => {
    const { $fs } = useNuxtApp()
    const { signOut } = await $fs.auth.lib()
    await signOut($fs.auth.connection)
    await fetch($fs.auth.options.signOutUrl, {
        method: 'POST'
    })
}

//First testing of an auth middleware
const secureMiddleware = async(guest = false) => {
    const { payload, ssrContext } = useNuxtApp()
    const { FiresteadAuth } = payload.state

    const redirect = async(path) => {
        if (!!ssrContext) {
            ssrContext.res.writeHead(302, {
                Location: path,
            })

            return ssrContext.res.end()
        }

        return await useRouter().push(path)
    }

    if (guest && !!FiresteadAuth.isAuthenticated) {
        return redirect('/')
    } else if (!guest && !FiresteadAuth.isAuthenticated) {
        return redirect('/auth')
    }
}

export const useAuth = () => {
    const { payload } = useNuxtApp()
    const { FiresteadAuth } = payload.state

    return {
        signInWithEmailAndPassword: fsSignInWithEmailAndPassword,
        createUserWithEmailAndPassword: fsCreateUserWithEmailAndPassword,
        signOut: fsSignOut,
        secureMiddleware,
        ...toRefs(FiresteadAuth)
    }
}