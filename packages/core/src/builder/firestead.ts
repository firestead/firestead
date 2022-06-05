import { createHooks } from 'hookable'
import { applyDefaults } from 'untyped'
import { version } from '../../package.json'
import { firesteadCtx } from '@firestead/kit'
import { prepareHosting } from './hosting'
import { FiresteadConfigSchema } from '@firestead/schema'

import type { FiresteadOptions, FiresteadContext } from '@firestead/schema'
import { loadEnvironmentConfig } from './config/environment'

export interface InitFiresteadOptions  {
    /** Load firestead with development mode */
    dev?: boolean
  
    /** root dir of firestead project */
    rootDir?: string
  
}

/*
*   Initialize firestead and return firestead context 
*   @param {InitFiresteadOptions} - firestead options
*   
*   returns firestead context
*   @returns Promise<FiresteadContext>
*/
export async function initFirestead(opts : InitFiresteadOptions): Promise<FiresteadContext> {

    const firesteadContext : FiresteadContext = {
        _version: version,
        hooks: createHooks()
    }
    //TODO: load config file firestead.config.js/ts if available
    firesteadContext.options = applyDefaults(FiresteadConfigSchema, {
        rootDir: opts.rootDir || process.cwd(),
    }) as FiresteadOptions

    /**
     * load environment configurations
     */
    await loadEnvironmentConfig(firesteadContext)

    //prepare firebase functions
    //await prepareFunctions(firesteadContext)

    //prepare hosting
    await prepareHosting(firesteadContext)

    // create firebase configuration
    //await createFirebaseConfig(firesteadContext)

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
export async function runDev({hooks, options}){
    /*
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
      */
}
