import chalk from 'chalk'
import { writeEntryFile } from './writer'
import { scanDirs } from '../utils'

let isScanRunning = false
const scanQueue = []

export async function watchFirebaseFiles(firesteadContext){
  firesteadContext.hooks.hook('watch:event',async (event,path)=>{
      if(['add', 'unlink'].indexOf(event) !== -1){
        for( const dir of firesteadContext.functionsWatchDirs){
          if(path.includes(`${firesteadContext.functionsDir}/${dir}`)){
            await addToScanQueue(firesteadContext, path, event)
            break
          }
        }
      }
  })
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