import { createApp } from 'h3'
import { initFirebaseAdmin, sessionHandler, signOut } from './utils/auth'
import { testCall } from './utils/test'

const app = createApp()

app.use(initFirebaseAdmin)
app.use('/auth/session', sessionHandler)
app.use('/auth/signout', signOut)
app.use('/test', testCall)

export default app