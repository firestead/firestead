import { addAdminContext } from './context'
import { prepareRuntime, registerCoreOptions, bundleFiles, watchPages } from "./build"
import { createServer } from './build/vite/server'


export async function start(firesteadContext){
    /*
    *   add admin context
    */
    addAdminContext(firesteadContext)
    /*
    *   prepare admin runtime
    *   default folder for runtime is '_firestead/admin'
    */
    await prepareRuntime(firesteadContext.options.admin)
    /*
    *   register admin options like pages and navigation that are needed for core features
    */
    registerCoreOptions(firesteadContext)
    /*
    * this function initially writes the routes and navigation files to the admin runtime folder
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
    await createServer(firesteadContext.options.admin)
}