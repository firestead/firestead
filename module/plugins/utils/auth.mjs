import { useState } from '#app'

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

export const clientAuth = async (connection, options = {}) =>{
    const authState = useState('FiresteadAuth')
    if(!authState.value){
      authState.value =  {
        authenticated: false,
        user: null,
        claims: null
      }
    }
    const isAuthenticated = useState('FiresteadIsAuthenticated')
    if(!isAuthenticated.value) isAuthenticated.value = false
    const onAuthStateChanged = (await import('@firebase/auth')).onAuthStateChanged
    const onIdTokenChanged = (await import('@firebase/auth')).onIdTokenChanged
    const promises = []
    if (!unsubscribeAuthStateListener) {
      promises.push(new Promise(resolve => {
        unsubscribeAuthStateListener = onAuthStateChanged(connection, async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            authState.value.authenticated = authUser ? true : false
            isAuthenticated.value = authUser ? true : false
            if(authUser){
                authState.value.user = getUserData(authUser)
                authState.value.claims = claims
            }
            resolve()
        })
      }))
     } 
  
     if (!unsubscribeIdTokenListener) { 
      promises.push(new Promise(resolve => {
        unsubscribeIdTokenListener = onIdTokenChanged(connection, async authUser => {
            const claims = authUser ? (await authUser.getIdTokenResult(true)).claims : null
            authState.value.authenticated = authUser ? true : false
            isAuthenticated.value = authUser ? true : false
            if(authUser){
                authState.value.user = getUserData(authUser)
                authState.value.claims = claims
            }
            resolve()
        })
      }))
     } 
    return Promise.all(promises)
  }

  export const serverAuth = async (req, auth, options = {}) =>{
    const useCookie = (await import('h3')).useCookie
    const session = useCookie(req, 'session')
    if(session){
      try {
        const decodedClaims = await auth.verifySessionCookie(session)
        console.log(decodedClaims)
      } catch (error) {
        console.log(error)
      }

    }
  }