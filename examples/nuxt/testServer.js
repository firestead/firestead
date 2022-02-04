import { Server } from 'http'
import {handle} from './.output/server/index.mjs'

const server = new Server(handle)
server.listen(8080,'localhost', () => {
    console.log('Node.js web server at port 8080 is running..')
})