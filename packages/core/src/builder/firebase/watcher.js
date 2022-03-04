import chalk from 'chalk'
import fse from 'fs-extra'
import { join } from 'pathe'
import { isDirectory } from '../utils'
import chokidar from 'chokidar'

let fileWatcher = {
  isScanRunning: false,
  queue: []
}

export function watchFunctionsFolder({hooks, options}){
  //set up watcher vars
  fileWatcher.watchDirs = options.functions.watchDirs
  fileWatcher.dir = options.functions.dir
  fileWatcher.path = options.functions.path
  fileWatcher.callHook = hooks.callHook
  //add chokidar watcher for firebase functions
  const watcher = chokidar.watch([fileWatcher.path], { ignoreInitial: true, depth: 3 })
  watcher.on('all', async (event, path) => {
    if(['add', 'unlink'].indexOf(event) !== -1){
      for( const dir of fileWatcher.watchDirs){
        if(path.includes(`${fileWatcher.dir}/${dir}`)){
          await addToScanQueue(path, event)
          break
        }
      }
    }
  })
}
// debounce events to queue to avoid multiple scans
async function addToScanQueue(path, event){
    fileWatcher.queue.push({
      path,
      event
    })
    if(!fileWatcher.isScanRunning){
      const scanParams = fileWatcher.queue.shift()
      fileWatcher.isScanRunning = true
      await rescan(scanParams.path, scanParams.event)
    }
  }
  
async function rescan(path, event){
    const functionHandler = await scanDirs(fileWatcher)
    //get updated function
    const updateContext = {
      event: event,
      handler: false
    }
    if(event==='add'){
      const newFunction = functionHandler.find(v=>v.path===path)
      if(newFunction){
        updateContext.handler = newFunction
      }
    }
    await fileWatcher.callHook('functions:updated', functionHandler, updateContext)
    console.log('info',`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} ${(event==='add')?chalk.bold.green('Added new file: ' + path ):chalk.bold.red('Removed file: ' + path )}`)
    if(fileWatcher.queue.length>=1){
        const scanParams = fileWatcher.queue.shift()
        await rescan(scanParams.path, scanParams.event )
    }
    fileWatcher.isScanRunning = false
}

export async function scanDirs ({ path, watchDirs}) {
  let retFunctions = []
  for (const dir of watchDirs){
      const dirPath = `${path}/${dir}`
      if(await isDirectory(dirPath)){
          const functions = await getAllFiles(dirPath, [], dir)
          if(functions.length>0){
            retFunctions = [...retFunctions,...functions]
          }
      }
  }
  return retFunctions
}

async function getAllFiles (dirPath, arrayOfFiles, dir) {
  const files = await fse.readdir(dirPath)
  for(const file of files){
      if (await isDirectory(dirPath + "/" + file)) {
          //ignore directories
          //arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
          arrayOfFiles.push({
            type: dir,
            path: join(dirPath, "/", file),
            ...splitFile(file)
          })
      }
  }
return arrayOfFiles
}


function splitFile(file){
  let event = false
  let name = file
  let ext = ''
  const extArr = /(?:\.([^.]+))?$/.exec(file)
  const validExt = ['js','ts','mjs'].indexOf(extArr[1])
  if(validExt!==-1) {
    name = file.split(extArr[0])[0]
    if(name.split('.').length > 1){
      const splitName = name.split('.')
      name = splitName[0]
      if(['onCreate','onUpdate','onDelete','onWrite','onArchive','onFinalize','onMetadataUpdate'].indexOf(splitName[1])!==-1){
        event = splitName[1]
      }
    }
    ext = extArr[1]
  }
  return {
    name: name,
    event: event,
    ext: ext
  }
}