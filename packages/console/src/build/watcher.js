import chokidar from 'chokidar'
import chalk from 'chalk'

let fileWatcher = {
    isQueueActive: false,
    queue: []
}

export function watch(firesteadContext){
    fileWatcher.callHook = firesteadContext.hooks.callHook
    const watchFolder = firesteadContext.console.pages.map(({ path }) => path)
    const watcher = chokidar.watch(watchFolder, {
        ignoreInitial: true, 
        depth: 3,
        awaitWriteFinish: {
          stabilityThreshold: 200,
          pollInterval: 100
        } 
      })
    watcher.on('all', async (event, path) => {
        // if a new file is added, add it to the scan queue
        if(['add', 'unlink'].indexOf(event) !== -1){
            await addToQueue(path, event)
        }
    })
}

// debounce watch event to queue to avoid multiple calls at once
async function addToQueue(path, event){
    fileWatcher.queue.push({
      path,
      event
    })
    if(!fileWatcher.isQueueActive){
      const scanParams = fileWatcher.queue.shift()
      fileWatcher.isQueueActive = true
      await watchEffect(scanParams.path, scanParams.event)
    }
}

async function watchEffect(path, event){
    if(event === 'add'){
        console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead Console:')} ${chalk.bold.green('Added new file: ' + path )}`)
    }
    if(event === 'unlink'){
        console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead Console:')} ${chalk.bold.red('Removed file: ' + path )}`)
    }
    if(event === 'change'){
        console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead Console:')} ${chalk.bold.green('Updated file: ' + path )}`)
    }
    await fileWatcher.callHook('console:pages:updated')
    //everything done -> run next queue item
    if(fileWatcher.queue.length>=1){
      const scanParams = fileWatcher.queue.shift()
      await watchEffect(scanParams.path, scanParams.event )
    }
    fileWatcher.isQueueActive = false
}