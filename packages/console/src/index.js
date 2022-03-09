import { addConsoleContext } from './context'
import { prepareRuntime, registerCoreOptions, bundleFiles, watchPages } from "./build"
import { createServer } from './build/vite/server'


export async function start(firesteadContext){
    /*
    *   add console context
    */
    addConsoleContext(firesteadContext)
    /*
    *   prepare console runtime
    *   default folder for runtime is '_firestead/console'
    */
    await prepareRuntime(firesteadContext.console)
    /*
    *   register console options like pages and navigation that are needed for core features
    */
    registerCoreOptions(firesteadContext)
    /*
    * this function initially writes the routes and navigation files to the console runtime folder
    */
    await bundleFiles(firesteadContext)
    /*
    * watch all pages folders to bundle files on change
    * only when files are added or removed
    */
    watchPages(firesteadContext)
    /*
    *   start vite server in dev mode
    */
    await createServer(firesteadContext.console)
}