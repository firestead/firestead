import chokidar from 'chokidar'
import { prepareFunctions, createFirebaseConfig } from './functions'
import { firesteadCtx } from '@firestead/kit'
import { prepareHosting } from './hosting'

import type { FiresteadOptions, FiresteadContext } from '@firestead/schema'

/*
*   Main function to run firestead
*   @param {Object} firesteadOptions - firestead options
*   
*   returns two functions that can build firebase functions and watch functions folder for changes
*   @returns { buildFunctions, watchFunctions }
*/

export async function loadFirestead(firesteadOptions : FiresteadOptions): Promise<FiresteadContext> {

    //TODO: load config file firestead.config.json and firestead.config.js/ts

    const firesteadContext : FiresteadContext = {}

    //prepare firebase functions
    await prepareFunctions(firesteadContext)

    //prepare hosting
    await prepareHosting(firesteadContext)

    // create firebase configuration
    await createFirebaseConfig(firesteadContext)

    /**
     * Set context for firestead kit
    */
   firesteadCtx.set(firesteadContext)

    return firesteadContext
}

/*
* build entire project with firestead
* 
*/
export async function build(target = null) {}


/*
*   Watch all firestead related folders in dev mode, including:
*  - functions -> any changes in functions will trigger a rebuild
*  - hosting -> create/remove new folders
*/
export async function watch({hooks, options}){
    //add chokidar watcher for functions and hosting targets
    const watcher = chokidar.watch([
        options.functions.path,
        options.hosting.path
    ], { 
        ignoreInitial: true, 
        depth: 3,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 100
        } 
    })

    watcher.on('all', async (event, path) => {
        // if a new file is added, add it to the scan queue
        if(['add', 'unlink', 'change'].indexOf(event) !== -1){
            //check if change is located in function or hosting folder
            if(path.includes(options.functions.dir) !== -1){
                for( const dir of options.functions.watchDirs){
                    if(path.includes(`${options.functions.dir}/${dir}`)){
                    await addToQueue(path, event)
                    break
                    }
                }
            }
            else if(path.includes(options.hosting.dir)){

            }
        }
      })
}
