import { createError, setCookie , useBody} from "h3"
import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

export const initFirebaseAdmin = (req, res, next) => {
    process.env.FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
    const apps = getApps()
    if (!apps.length) {
        initializeApp({ 
            projectId: 'default'
        })
        const firestore = getFirestore()
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