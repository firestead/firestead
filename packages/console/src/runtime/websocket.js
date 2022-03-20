import Sockette from 'sockette'
import { reactive } from 'vue'

const subscriptions = {
    'environments': {}
}

function callHandle(data){
    const {context, payload} = data
    if(typeof subscriptions[context] === 'undefined'){
        throw new Error(`Firestead Context ${context} does not exist or cannot be subscribed to`)
    }
    Object.keys(subscriptions[context]).forEach(id => {
        subscriptions[context][id](payload)
    })
}

export default {
    install: (app, options) => {
        let wsConnected = false
        const subscriptionQueue = []

        const ws = new Sockette('ws://localhost:1338', {
            timeout: 5000,
            maxAttempts: 100,
            onopen: () => {
                console.log('WS: Connected!')
                wsConnected = true
                subscriptionQueue.forEach(context => {
                    queryInitialData(context)
                })
            },
            onmessage: (event)=>{
                callHandle(JSON.parse(event.data))
            },
            onreconnect: () => {
                wsConnected = false
                console.log('WS: Reconnect!')
            },
            onmaximum: e => console.log('Stop Attempting!', e),
            onclose: () => {
                wsConnected = false
                console.log('WS: Closed!')
            },
            onerror: e => console.log('Error:', e)
        })

        function queryInitialData(context){
            ws.json({
                method: 'get',
                context
            })
        }

        function subscribe(context, handle){
            if(typeof subscriptions[context] === 'undefined'){
                throw new Error(`Firestead Context ${context} does not exist or cannot be subscribed to`)
            }
            //generate unique id for subscription
            const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
            subscriptions[context][id] = handle
            /*
            *   Subscriptions can happen before the websocket is connected
            *   so we need to queue them up until the websocket server is ready
            *   after connecting, initial data of subscription must be queried
            */
            if(!wsConnected){
                if(subscriptionQueue.indexOf(context) === -1){
                    subscriptionQueue.push(context)
                }
            }else{
                /*
                *   If the websocket is connected, we can query the initial data
                */
                queryInitialData(context)
            }
            //return unsubscribe function
            return function() {
                delete subscriptions[context][id]
            }
        }

        app.provide('ws', {
            state: reactive({}),
            send: ws.json,
            subscribe: subscribe
        })
    }
}