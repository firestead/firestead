import { addConsoleContext, prepareRuntime, createFiles, createServer } from '@firestead/console'

export async function initConsoleBundle(firesteadContext){
    firesteadContext = addConsoleContext(firesteadContext)
    await prepareRuntime(firesteadContext)
    await createFiles(firesteadContext)
    await createServer(firesteadContext)
}