import chokidar from 'chokidar'
import { getFrameworkInstance } from './hosting/framework'

export async function build(target = null) {}



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

/*
* Function to import a framework instance by a given target
*
* params {Object} firesteadContext.options
* target {String} target name
* returns {Object} framework instance
*/
export async function loadFramework({ hosting }, target = null) {
    if(!target && hosting.activeTarget){
        target = hosting.activeTarget
    }else{
        throw new Error('No target provided and no active target found.')
    }
    const frameworkInstance = await getFrameworkInstance(hosting.targets[target])
    return frameworkInstance
}