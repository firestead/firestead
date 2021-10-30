import fse from 'fs-extra'
import chalk from 'chalk'
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { getRollupConfig } from './rollup/config'
import { getFiresteadContext } from './context'
import { isDirectory, scanDirs } from './utils'
import * as rollup from 'rollup'

let isScanRunning = false
const scanQueue = []

export async function prepare(nuxt){
    let firesteadContext =  getFiresteadContext(nuxt)
    const firesteadDir = await isDirectory(`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}`)
    if(firesteadDir){
        await fse.emptyDir(`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}`)
    }
    await fse.mkdirp(`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/functions`)
    await scanDirs(firesteadContext)
    await fse.copyFile(resolve(dirname(fileURLToPath(import.meta.url)), 'runtime/config.js'),`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/config.js`)
    //watch dir changes
    nuxt.hook('builder:watch',async (event,path)=>{
      if(['add', 'unlink'].indexOf(event) !== -1){
        for( const dir of firesteadContext.functionsWatchDirs){
          if(path.includes(`${firesteadContext.functionsDir}/${dir}`)){
            await addToScanQueue(firesteadContext, path, event)
            break
          }
        }
      }
    })
    return firesteadContext
}

export async function writeEntryFile(firesteadContext){
    let entryContent = firesteadContext.watchFiles.map(p => `import {default as ${p.name}_import, config as ${p.name}_config} from "${p.path}";`).join('\n')
    entryContent = entryContent.concat('\n', "import functions from 'firebase-functions'", '\n')
    entryContent = entryContent.concat('\n', "import {getDocument} from './config.js'", '\n', '\n')
    //entryContent = entryContent.concat('\n', "const getDocument = (config) => config?.document ? config.document : ''", '\n', '\n')
    for( const watchFile of firesteadContext.watchFiles){
      if(watchFile.type === 'schedule'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.pubsub.schedule("every 1 mins").onRun(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'http'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.https.onRequest(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'functions'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.https.onCall(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'firestore'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.firestore.document(getDocument(${watchFile.name}_config)).${watchFile.event?watchFile.event:'onWrite'}(${watchFile.name}_import)`, '\n')
      }
    }
    await fse.writeFile(`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/entry.js`, entryContent, 'utf-8')
}

export async function watch (firesteadContext) {
    const rollupConfig = getRollupConfig(firesteadContext, 'watch')
    return _watch(rollupConfig)
}

function startRollupWatcher (rollupConfig) {
    const watcher = rollup.watch(rollupConfig)
    let start = null
  
    watcher.on('event', (event) => {
      switch (event.code) {
        // The watcher is (re)starting
        case 'START':
          return
  
        // Building an individual bundle
        case 'BUNDLE_START':
          start = Date.now()
          return
  
        // Finished building all bundles
        case 'END':
          //nitroContext._internal.hooks.callHook('nitro:compiled', nitroContext)
          console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')}` + ' built', start ? `in ${Date.now() - start} ms` : '')
          return
  
        // Encountered an error while bundling
        case 'ERROR':
          consola.error('Firestead Rollup error: ' + event.error)
          // consola.error(event.error)
      }
    })
    return watcher
  }

function _watch(rollupConfig){
    let watcher = startRollupWatcher(rollupConfig)
}

async function addToScanQueue(firesteadContext, path, event){
  scanQueue.push({
    firesteadContext,
    path,
    event
  })
  if(!isScanRunning){
    const scanParams = scanQueue.shift()
    isScanRunning = true
    await rescan(scanParams.firesteadContext, scanParams.path, scanParams.event )
  }
}

async function rescan(firesteadContext, path, event){
  await scanDirs(firesteadContext)
  await writeEntryFile(firesteadContext)
  console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} ${(event==='add')?chalk.bold.green('Added new file: ' + path ):chalk.bold.red('Removed file: ' + path )}`)
  if(scanQueue.length>=1){
    const scanParams = scanQueue.shift()
    await rescan(scanParams.firesteadContext, scanParams.path, scanParams.event )
  }
  isScanRunning = false
}