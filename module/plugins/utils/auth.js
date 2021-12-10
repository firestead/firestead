import { set } from '@vue/composition-api'

let unsubscribeAuthStateListener = null
let unsubscribeIdTokenListener = null

export const authUnsubscribe = () => {
    if (unsubscribeAuthStateListener) {
      unsubscribeAuthStateListener()
      initAuthState()
      unsubscribeAuthStateListener = null
    }
    if (this.unsubscribeIdTokenListener) {
      this.unsubscribeIdTokenListener()
      initAuthState()
      unsubscribeIdTokenListener = null
    }
}

const getUserData = (authUser) => {
  return {
    uid: authUser.uid,
    email: authUser.email,
    displayName: authUser.displayName,
    photoURL: authUser.photoURL,
    emailVerified: authUser.emailVerified,
    isAnonymous: authUser.isAnonymous,
    metadata: authUser.metadata,
    photoURL: authUser.photoURL,
    phoneNumber: authUser.phoneNumber,
    providerId: authUser.providerId
  }
}

export const clientAuth = async (nuxtApp, connection, options = {}) =>{
    //init and hydrate auth state
    set(nuxtApp.payload.state, 'FiresteadAuth', nuxtApp.payload.state['FiresteadAuth'])
    const { FiresteadAuth } = nuxtApp.payload.state
    const onAuthStateChanged = (await import('@firebase/auth')).onAuthStateChanged
    const onIdTokenChanged = (await import('@firebase/auth')).onIdTokenChanged
    const promises = []
    if (!unsubscribeAuthStateListener) {
      promises.push(new Promise(resolve => {
        unsubscribeAuthStateListener = onAuthStateChanged(connection, async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            FiresteadAuth.isAuthenticated = authUser ? true : false
            if(authUser){
              FiresteadAuth.user = getUserData(authUser)
              FiresteadAuth.claims = claims
            }
            resolve()
        })
      }))
     } 
  
     if (!unsubscribeIdTokenListener) { 
      promises.push(new Promise(resolve => {
        unsubscribeIdTokenListener = onIdTokenChanged(connection, async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            FiresteadAuth.isAuthenticated = authUser ? true : false
            if(authUser){
              FiresteadAuth.user = getUserData(authUser)
              FiresteadAuth.claims = claims
            }
            resolve()
        })
      }))
     } 
    return Promise.all(promises)
  }

  export const serverAuth = async (nuxtApp, options = {}) =>{
    const { req, res } = nuxtApp.ssrContext
    //set initial auth state
    set(nuxtApp.payload.state, 'FiresteadAuth', {
      isAuthenticated: false,
      user: null,
      claims: null
    })
    const { FiresteadAuth } = nuxtApp.payload.state
    const { useCookie, setCookie } = await import('h3')
    const session = useCookie(req, 'session')
    if(session){
      try {
        const { getAuth } = await import('firebase-admin/auth')
        const auth = getAuth()
        const decodedClaims = await auth.verifySessionCookie(session)
        const authUser = await auth.getUser(decodedClaims.sub)
        FiresteadAuth.user = getUserData(authUser)
        FiresteadAuth.claims = decodedClaims
        FiresteadAuth.isAuthenticated = true
      } catch (error) {
        //TODO: better error management, check the reason of the error
        //remove session cookie
        const options = { maxAge: 0 }
        setCookie(res, 'session', null, options)
      }
    }else{
      //TODO: handle auth security
    }
  }