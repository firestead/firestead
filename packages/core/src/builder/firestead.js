import chokidar from 'chokidar'

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