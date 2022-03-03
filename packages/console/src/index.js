import { addConsoleContext } from './context'
import { prepareRuntime, createFiles } from "./build"
import { createServer } from './build/vite/server'


export async function start(firesteadContext){
    addConsoleContext(firesteadContext)
    await prepareRuntime(firesteadContext)
    await createFiles(firesteadContext)
    await createServer(firesteadContext)
}