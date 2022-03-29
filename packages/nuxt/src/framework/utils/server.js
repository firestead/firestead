// Based on https://github.com/nuxt/framework/blob/main/packages/nuxi/src/utils/server.ts
import { loading } from '@nuxt/design'

export function createServer (defaultApp) {
  const listener = createDynamicFunction(defaultApp || createLoadingHandler('Loading...'))

  async function listen (opts) {
    const { listen } = await import('listhen')
    return listen(listener.call, opts)
  }

  return {
    setApp: (app) => listener.set(app),
    listen
  }
}

export function createLoadingHandler (message) {
  return (_req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8')
    res.statusCode = 503 /* Service Unavailable */
    res.end(loading({ loading: message }))
  }
}

function createDynamicFunction (initialValue) {
  let fn = initialValue
  return {
    set: (newFn) => { fn = newFn },
    call: ((...args) => fn(...args))
  }
}