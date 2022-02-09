import chalk from 'chalk'
import fse from 'fs-extra'
import { globby } from 'globby'
import { createRequire } from 'module'
import { join, resolve } from 'pathe'
import { mergeDirs, writeFile } from '../utils'
import { readPackageJSON } from 'pkg-types'
import {
  getFirebaseConfig, 
  getDefaultFirestoreIndexes,
  getDefaultFirestoreRules,
  getDefaultStorageRules } from './config'

/*
  Creates entry file for rollup bundler
*/
export async function writeEntryFile(firesteadContext){
  
  const entryFilePath = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/entry.js` : `${firesteadContext.buildPath}/build/entry.js`
  
  // no firebase functions to build - only import firebase-functions for framework
  if(firesteadContext.buildOptions?.skip && !firesteadContext.dev){
    let entryContent = `import functions from 'firebase-functions';\n`
    await fse.writeFile(entryFilePath, entryContent, 'utf-8')
    return
  }
  //add all created watch files to entry file
  let entryContent = firesteadContext.functions.map(p => `import {default as ${p.name}_import, config as ${p.name}_config} from "${p.path}";`).join('\n')
  //add imports e.g. runtime wrapper and config helper
  entryContent = entryContent.concat('\n', `
    import functions from 'firebase-functions'
    import httpWrapper from './runtime/wrappers/http.js'
    import { getDocument, getSchedule, getBucketName } from './runtime/config.js'    
    `, '\n')
    
  entryContent = entryContent.concat('\n', `const defaultBucketName = "${firesteadContext.firebase?.config?.storageBucket ? firesteadContext.firebase.config.storageBucket:'default'}"`, '\n')
    
  for( const functionItem of firesteadContext.functions){
    if(functionItem.type === 'schedule'){
      entryContent = entryContent.concat(`export const ${functionItem.name} = functions.pubsub.schedule(getSchedule(${functionItem.name}_config)).onRun(${functionItem.name}_import)`, '\n')
    }
    if(functionItem.type === 'http'){
      entryContent = entryContent.concat(`
      const ${functionItem.name}_httpRuntime = httpWrapper(${functionItem.name}_import)
      export const ${functionItem.name} = functions.https.onRequest(${functionItem.name}_httpRuntime)
      `, '\n')
    }
    if(functionItem.type === 'functions'){
      entryContent = entryContent.concat(`export const ${functionItem.name} = functions.https.onCall(${functionItem.name}_import)`, '\n')
    }
    if(functionItem.type === 'storage'){
      entryContent = entryContent.concat(`export const ${functionItem.name} = functions.storage.bucket(getBucketName(defaultBucketName,${functionItem.name}_config)).object().${functionItem.event?functionItem.event:'onFinalize'}(${functionItem.name}_import)`, '\n')
    }
    if(functionItem.type === 'firestore'){
      entryContent = entryContent.concat(`export const ${functionItem.name} = functions.firestore.document(getDocument(${functionItem.name}_config)).${functionItem.event?functionItem.event:'onWrite'}(${functionItem.name}_import)`, '\n')
    }
  }

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
    bundledFile = bundledFile.replace (/^/,`import { handle as frameworkHandle } from  './framework/server/index.mjs';\n`)
    bundledFile = bundledFile.concat(`export const frameworkApp = functions.https.onRequest(frameworkHandle);`)
    await fse.writeFile(filePath, bundledFile, 'utf-8')
  } catch (err) {
    console.error(err)
  }
}

export async function writeFirebaseConfigs(firesteadContext){
  console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} Create firebase configuration files`)
  const rootFBDir = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase` : `${firesteadContext.buildPath}/build`
  const firebaseConf = getFirebaseConfig(firesteadContext)
  await writeFile(`${rootFBDir}/firebase.json`, JSON.stringify(firebaseConf))
  const firestoreIndexes = getDefaultFirestoreIndexes()
  await writeFile(`${rootFBDir}/firestore.indexes.json`, JSON.stringify(firestoreIndexes))
  await writeFile(`${rootFBDir}/firestore.rules`, getDefaultFirestoreRules())
  await writeFile(`${rootFBDir}/storage.rules`, getDefaultStorageRules())
}

export async function writePackageJson(firesteadContext){
  const serverDir = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/functions` : `${firesteadContext.buildPath}/build/functions`
  const _require = createRequire(import.meta.url)

  // for production build write dependencies to package.json
  let dependencies = {}
  if(!firesteadContext.dev){
    // merge node modules from framework into main -> nuxt related build process
    try {
      console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} Merge duplicated modules`)
      await mergeDirs(`${serverDir}/framework/server/node_modules`, `${serverDir}/node_modules`)
      await fse.rm(`${serverDir}/framework/server/node_modules`, { recursive: true })
    } catch (e) {
      throw new Error(e)
    }
    // add dependencies to package.json
    console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} Create package.json`)
    const jsons = await globby(`${serverDir}/node_modules/**/package.json`)
    const prefixLength = `${serverDir}/node_modules/`.length
    const suffixLength = '/package.json'.length
    dependencies = jsons.reduce((obj, packageJson) => {
      const dirname = packageJson.slice(prefixLength, -suffixLength)
      if (!dirname.includes('node_modules')) {
        obj[dirname] = _require(packageJson).version
      }
      return obj
    }, {})
  }

  let nodeVersion = '14'
  try {
    const currentNodeVersion = fse.readJSONSync(join(firesteadContext.rootPath, 'package.json')).engines.node
    if (['16', '14'].includes(currentNodeVersion)) {
      nodeVersion = currentNodeVersion
    }
  } catch {}

  const getPackageVersion = async (id) => {
    const pkg = await readPackageJSON(id, { url: `${firesteadContext.rootPath}/node_modules` })
    return pkg.version
  }

  await writeFile(
    resolve(serverDir, 'package.json'),
    JSON.stringify(
      {
        private: true,
        type: 'module',
        main: './index.mjs',
        dependencies,
        devDependencies: {
          'firebase-admin': await getPackageVersion('firebase-admin'),
          'firebase-functions': await getPackageVersion('firebase-functions')
        },
        engines: { node: nodeVersion }
      },
      null,
      2
    )
  )
}