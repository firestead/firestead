import '#polyfill'

import functions from 'firebase-functions'
import { handle } from '@nuxt/nitro/dist/runtime/server'

export const server = functions.https.onRequest(handle)