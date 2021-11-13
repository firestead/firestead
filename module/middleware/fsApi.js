import { createApp } from 'h3'
import { initFirebaseAdmin, sessionHandler } from './utils/auth'
import { testCall } from './utils/test'

const app = createApp()

app.use(initFirebaseAdmin)
app.use('/session', sessionHandler)
app.use('/test', testCall)

export default app