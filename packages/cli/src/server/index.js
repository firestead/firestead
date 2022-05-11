import { WebSocketServer } from 'ws'
import contextHandler from './handler'


export function createWebsocketServer(firesteadContext){
    /*
    * Create a websocket server
    * TODO: use port from firesteadContext
    */
    const wss = new WebSocketServer({ port: 1338 })

    wss.on('connection', function connection(ws) {

        /*
        * handle all incoming messages, could be GET or POST methods
        */
        ws.on('message', function message(data) {
          const { context, payload, method } = JSON.parse(data)
          const contextInstance = contextHandler.find((h) => (h.method === method && h.context === context))
          /*
          * handle get methods if context instance is found
          */
          if(contextInstance && method === 'get'){
            const data = contextInstance.handler(firesteadContext.options)
            ws.send(JSON.stringify({
              context: context,
              payload: data
            }))
          }
          /*
          * handle post methods if context instance is found
          * in most cases handle calls a hook function, updates will be triggered with registered hook via getter
          */
          if(contextInstance && method === 'post'){
            contextInstance.handler(firesteadContext, payload)
          }
        })

        /*
        * register hooks for all getters
        * 
        */
        for(const contextInstance of contextHandler){
          if(contextInstance.hook && contextInstance.method === 'get'){
            firesteadContext.hooks.hook(contextInstance.hook, ()=>{
              const data = contextInstance.handler(firesteadContext.options)
              ws.send(JSON.stringify({
                context: contextInstance.context,
                payload: data
              }))
            })
          }
        }
    })
}