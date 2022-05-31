import fse from 'fs-extra'
import { join } from 'pathe'
import chalk from 'chalk'
import { isDirectory } from '../../utils'
import chokidar from 'chokidar'
import { analyzeFunction } from './analyzer'

let fileWatcher = {
  isQueueActive: false,
  queue: []
}

export function watchFunctionsFolder({hooks, options}){
  //set up watcher vars
  fileWatcher.watchDirs = options.functions.watchDirs
  fileWatcher.dir = options.functions.dir
  fileWatcher.path = options.functions.path
  fileWatcher.callHook = hooks.callHook
  //add chokidar watcher for firebase functions
  const watcher = chokidar.watch([fileWatcher.path], { 
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
      for( const dir of fileWatcher.watchDirs){
        if(path.includes(`${fileWatcher.dir}/${dir}`)){
          await addToQueue(path, event)
          break
        }
      }
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
  logWatchEvent(path, event)
  let functionHandler = null
  if(['add', 'change'].indexOf(event) !== -1){
    functionHandler = await createFunctionHandler(path, event)
  }
  await fileWatcher.callHook('functions:update', functionHandler, {path,event})
  //everything done -> run next queue item
  if(fileWatcher.queue.length>=1){
    const scanParams = fileWatcher.queue.shift()
    await watchEffect(scanParams.path, scanParams.event )
  }
  fileWatcher.isQueueActive = false
}

async function createFunctionHandler(path){
  const functionHandler = decomposeFile(path)
  //Analyze file
  const analysis = await analyzeFunction(path)
  return {
    ...functionHandler,
    ...analysis
  }
}

// do a complete scan of the functions folder
export async function scanDirs ({ path, watchDirs }) {
  fileWatcher.watchDirs = watchDirs
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
          //TODO: implement support for folders with index.js as function handler
          //arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
          const functionHandler = await createFunctionHandler(join(dirPath, "/", file))
          arrayOfFiles.push(functionHandler)
      }
  }
return arrayOfFiles
}

//decompose file to get all relevant infos like function type, name, extension
function decomposeFile(path){
  //type of function is the folder name defined in watchDirs
  const type = fileWatcher.watchDirs.find(v => path.includes(v))
  const file = path.replace(/^.*[\\\/]/, '')
  //split file name and extension
  let name = file
  let ext = ''
  const extArr = /(?:\.([^.]+))?$/.exec(file)
  const validExt = ['js','ts','mjs'].indexOf(extArr[1])
  if(validExt!==-1) {
    name = file.split(extArr[0])[0]
    if(name.split('.').length > 1){
      const splitName = name.split('.')
      name = splitName[0]
    }
    ext = extArr[1]
  }
  //remove unwanted characters from name
  name = name.replace(/[^a-zA-Z0-9 ]/g, '')
  return {
    type,
    name,
    ext,
    path
  }
}

function logWatchEvent(path, event){
  if(event === 'add'){
    console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.green('Added new file: ' + path )}`)
  }
  if(event === 'unlink'){
    console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Removed file: ' + path )}`)
  }
  if(event === 'change'){
    console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.green('Updated file: ' + path )}`)
  }
}