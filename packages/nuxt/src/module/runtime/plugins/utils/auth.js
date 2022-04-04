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

export const clientAuth = async (nuxtApp, firebaseApp, options = {}) =>{
    //init and hydrate auth state
    if(!nuxtApp.payload.state['FirebaseAuth']){
      nuxtApp.payload.state = {
        isAuthenticated: false,
        user: null,
        claims: null
      }
    }
    const {getAuth, onAuthStateChanged, onIdTokenChanged  } = await import('@firebase/auth')
    const promises = []
    if (!unsubscribeAuthStateListener) {
      promises.push(new Promise(resolve => {
        unsubscribeAuthStateListener = onAuthStateChanged(getAuth(firebaseApp), async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            nuxtApp.payload.state.FirebaseAuth.isAuthenticated = authUser ? true : false
            if(authUser){
              nuxtApp.payload.state.FirebaseAuth.user = getUserData(authUser)
              nuxtApp.payload.state.FirebaseAuth.claims = claims
            }
            resolve()
        })
      }))
     } 
  
     if (!unsubscribeIdTokenListener) { 
      promises.push(new Promise(resolve => {
        unsubscribeIdTokenListener = onIdTokenChanged(getAuth(firebaseApp), async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            nuxtApp.payload.state.FirebaseAuth.isAuthenticated = authUser ? true : false
            if(authUser){
              nuxtApp.payload.state.FirebaseAuth.user = getUserData(authUser)
              nuxtApp.payload.state.FirebaseAuth.claims = claims
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
    nuxtApp.payload.state['FirebaseAuth'] = {
      isAuthenticated: false,
      user: null,
      claims: null
    }
    const { FirebaseAuth } = nuxtApp.payload.state
    const { useCookie, setCookie } = await import('h3')
    const session = useCookie(req, '__session')
    if(session){
      try {
        const { getAuth } = await import('firebase-admin/auth')
        const auth = getAuth()
        const decodedClaims = await auth.verifySessionCookie(session)
        const authUser = await auth.getUser(decodedClaims.sub)
        FirebaseAuth.user = getUserData(authUser)
        FirebaseAuth.claims = decodedClaims
        FirebaseAuth.isAuthenticated = true
      } catch (error) {
        //TODO: better error management, check the reason of the error
        //remove session cookie
        const options = { maxAge: 0 }
        setCookie(res, '__session', null, options)
      }
    }else{
      //TODO: handle auth security
    }
  }