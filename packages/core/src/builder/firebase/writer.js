import chalk from 'chalk'
import fse from 'fs-extra'
import { createRequire } from 'module'
import { join, resolve } from 'pathe'
import { writeFile, readPackageJson } from '../utils'
import {
  getFirebaseConfig, 
  getDefaultFirestoreIndexes,
  getDefaultFirestoreRules,
  getDefaultStorageRules } from './config'

/*
  Creates entry file for rollup bundler
*/
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

  const entryFilePath = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/entry.js` : `${firesteadContext.buildPath}/build/entry.js`
  await fse.writeFile(entryFilePath, entryContent, 'utf-8')
}

  /*
  * adds framework handle to built file
  */
export async function injectFrameworkHandle({ buildPath }){
  const filePath = `${buildPath}/build/functions/index.mjs`
  try {
    await fse.ensureFile(filePath)
    let bundledFile = await fse.readFile(`${buildPath}/build/functions/index.mjs`, 'utf-8')
    bundledFile = bundledFile.replace (/^/,`import { handle as frameworkHandle } from  './framework/server/index.mjs;'\n`)
    bundledFile = bundledFile.concat(`export const frameworkApp = functions.https.onRequest(frameworkHandle);`)
    await fse.writeFile(filePath, bundledFile, 'utf-8')
  } catch (err) {
    console.error(err)
  }
}


export function writeFirebaseConfigs(firesteadContext){
  console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} Create default configuration`)
  const rootFBDir = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase` : `${firesteadContext.buildPath}/build`
  const firebaseConf = getFirebaseConfig(firesteadContext)
  writeFile(`${rootFBDir}/firebase.json`, JSON.stringify(firebaseConf))
  const firestoreIndexes = getDefaultFirestoreIndexes()
  writeFile(`${rootFBDir}/firestore.indexes.json`, JSON.stringify(firestoreIndexes))
  writeFile(`${rootFBDir}/firestore.rules`, getDefaultFirestoreRules())
  writeFile(`${rootFBDir}/storage.rules`, getDefaultStorageRules())
}

export async function writePackageJson(firesteadContext){
  const serverDir = `${firesteadContext.buildPath}/firebase/functions`
  const _require = createRequire(import.meta.url)

  let nodeVersion = '14'
  try {
    const currentNodeVersion = fse.readJSONSync(join(firesteadContext.rootPath, 'package.json')).engines.node
    if (['16', '14'].includes(currentNodeVersion)) {
      nodeVersion = currentNodeVersion
    }
  } catch {}

  await writeFile(
    resolve(serverDir, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'module',
        main: './index.mjs',
        dependencies: {},
        devDependencies: {
          'firebase-functions-test': 'latest',
          'firebase-admin': readPackageJson('firebase-admin', _require).version,
          'firebase-functions': readPackageJson('firebase-functions', _require).version
        },
        engines: { node: nodeVersion }
      },
      null,
      2
    )
  )
}