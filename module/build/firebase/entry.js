import fse from 'fs-extra'

export async function writeEntryFile(firesteadContext){
    //add all created watch files to entry file
    let entryContent = firesteadContext.watchFiles.map(p => `import {default as ${p.name}_import, config as ${p.name}_config} from "${p.path}";`).join('\n')
    //add imports e.g. runtime wrapper and config helper
    entryContent = entryContent.concat('\n', `
      import functions from 'firebase-functions'
      import httpWrapper from './runtime/wrappers/http.js'
      import { getDocument, getSchedule, getBucketName } from './runtime/config.js'    
      `, '\n')
      
    entryContent = entryContent.concat('\n', `const defaultBucketName = "${firesteadContext.firebaseConfig?.storageBucket ? firesteadContext.firebaseConfig?.storageBucket:'default'}"`, '\n')
      
    for( const watchFile of firesteadContext.watchFiles){
      if(watchFile.type === 'schedule'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.pubsub.schedule(getSchedule(${watchFile.name}_config)).onRun(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'http'){
        entryContent = entryContent.concat(`
        const ${watchFile.name}_httpRuntime = httpWrapper(${watchFile.name}_import)
        export const ${watchFile.name} = functions.https.onRequest(${watchFile.name}_httpRuntime)
        `, '\n')
      }
      if(watchFile.type === 'functions'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.https.onCall(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'storage'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.storage.bucket(getBucketName(defaultBucketName,${watchFile.name}_config)).object().${watchFile.event?watchFile.event:'onFinalize'}(${watchFile.name}_import)`, '\n')
      }
      if(watchFile.type === 'firestore'){
        entryContent = entryContent.concat(`export const ${watchFile.name} = functions.firestore.document(getDocument(${watchFile.name}_config)).${watchFile.event?watchFile.event:'onWrite'}(${watchFile.name}_import)`, '\n')
      }
    }
    await fse.writeFile(`${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/firebase/entry.js`, entryContent, 'utf-8')
  }