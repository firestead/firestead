import { createApp, createError, setCookie , useBody, useCookie} from "h3"
import { initializeApp, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const app = createApp()

app.use((req, res, next) => {
    const env = process.env.NODE_ENV || 'production'
    const apps = getApps()
    if (!apps.length) {
        if(env === 'development') initializeApp()
        if(env === 'production') initializeApp()
    }
    next()
})

app.use('/fs/auth/session', async (req, res) => {
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
            setCookie(res, '__session', sessionCookie, options)
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
})

app.use('/fs/auth/signout', async (req, res) => {
    if(req.method==='POST'){
        const session = useCookie(req, '__session')
        try {
            const decodedClaims = await getAuth().verifySessionCookie(session)
            await getAuth().revokeRefreshTokens(decodedClaims.sub)
            const options = { maxAge: 0, httpOnly: true, secure: true,  path: '/' }
            setCookie(res, '__session', null, options)
        } catch (error) {
            return createError({statusCode: 500, statusMessage: 'INTERNAL SERVER ERROR', error: error})
        }
        return {
            statusCode: 200
        }
    }else{
        return createError({statusCode: 405, statusMessage: 'Method Not Allowed'})
    }
})

export default app