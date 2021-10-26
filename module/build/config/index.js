import chalk from 'chalk'
import { createRequire } from 'module'
import { join, resolve } from 'pathe'
import { writeFile, readPackageJson } from '../utils'
import {
    getDefaultFirebaseConfig, 
    getDefaultFirestoreIndexes,
    getDefaultFirestoreRules } from './defaults'

export function writeFirebaseDefaults(firesteadContext){
    console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')} Create default configuration`)
    const rootFBDir = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}`
    const firebaseConf = getDefaultFirebaseConfig()
    writeFile(`${rootFBDir}/firebase.json`, JSON.stringify(firebaseConf))
    const firestoreIndexes = getDefaultFirestoreIndexes()
    writeFile(`${rootFBDir}/firestore.indexes.json`, JSON.stringify(firestoreIndexes))
    writeFile(`${rootFBDir}/firestore.rules`, getDefaultFirestoreRules())
}

export async function writePackageJson(firesteadContext){
    const serverDir = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/functions`
    const _require = createRequire(import.meta.url)
  
    let nodeVersion = '14'
    try {
      const currentNodeVersion = fse.readJSONSync(join(firesteadContext._nuxt.rootDir, 'package.json')).engines.node
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