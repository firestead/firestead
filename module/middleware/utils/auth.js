import { createError, setCookie , useBody, useCookie} from "h3"
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

export const initFirebaseAdmin = (req, res, next) => {
    const apps = getApps()
    let adminApp = null
    if (!apps.length) {
        adminApp = initializeApp({ 
            projectId: 'default'
        })
    } else {
        adminApp = apps[0]
    }
    const firestore = getFirestore(adminApp)
    //sesttings can only be called once
    if(!apps.length){
        firestore.settings({
            host: "localhost:8080",
            ssl: false
        })
    }
    next()
}

export const sessionHandler = async (req, res) => {
    if(req.method==='POST'){
        const {idToken } = await useBody(req)
        //TODO: add csrf token
        //const csrfToken = req.body.csrfToken.toString()
        //if (csrfToken !== req.cookies.csrfToken) {
        //    return createError({statusCode: 401, statusMessage: 'UNAUTHORIZED REQUEST'})
        // }
        // Set session expiration to 5 days.
        const expiresIn = 60 * 60 * 24 * 5 * 1000
        try {
            const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn })
            const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' }
            setCookie(res, 'session', sessionCookie, options)
            return {
                statusCode: 200
            }
        } catch (error) {
            console.log(error)
            return createError({statusCode: 401, statusMessage: 'UNAUTHORIZED REQUEST'})
        }
    }else{
        return createError({statusCode: 405, statusMessage: 'Method Not Allowed'})
    }
}

export const signOut = async (req, res) => {
    if(req.method==='POST'){
        const session = useCookie(req, 'session')
        try {
            const decodedClaims = await getAuth().verifySessionCookie(session)
            await getAuth().revokeRefreshTokens(decodedClaims.sub)
            const options = { maxAge: 0 }
            setCookie(res, 'session', null, options)
        } catch (error) {
            return createError({statusCode: 500, statusMessage: 'INTERNAL SERVER ERROR', error: error})
        }
        return {
            statusCode: 200
        }
    }else{
        return createError({statusCode: 405, statusMessage: 'Method Not Allowed'})
    }
}