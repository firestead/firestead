import fse from 'fs-extra'
import { isDirectory, scanDirs } from './utils'
import { watchFirebaseFiles } from './firebase/watcher'
import { writeEntryFile, injectFrameworkHandle, writeFirebaseConfigs, writePackageJson } from './firebase/writer'
import { watchRollupEntry, buildRollup } from './rollup/bundler'
import { getRollupConfig } from './rollup/config'

export async function prepareFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:prepare', firesteadContext)
  const firesteadDir = await isDirectory(firesteadContext.buildPath)
  if(firesteadContext.dev){
    if(firesteadDir){
        await fse.emptyDir(`${firesteadContext.buildPath}/firebase`)
        await fse.emptyDir(`${firesteadContext.buildPath}/ui`)
    }
    await fse.mkdirp(`${firesteadContext.buildPath}/firebase/functions`)
    await fse.mkdirp(`${firesteadContext.buildPath}/firebase/runtime`)
    await fse.copy(firesteadContext.firebase.runtimePath, `${firesteadContext.buildPath}/firebase/runtime`, { overwrite: true })
  }else{
    if(firesteadDir){
        await fse.emptyDir(`${firesteadContext.buildPath}/build`)
    }
    await fse.mkdirp(`${firesteadContext.buildPath}/build/functions`)
    await fse.copy(firesteadContext.firebase.runtimePath, `${firesteadContext.buildPath}/build/runtime`, { overwrite: true })
  }
  await scanDirs(firesteadContext)
}

export async function watchFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:watch:before', firesteadContext)
  // load rollup config in dev mode
  firesteadContext.firebase.rollupConfig = await getRollupConfig(firesteadContext)
  // write firebase build entry file
  await writeEntryFile(firesteadContext)
  // watch and bundle firebase files
  watchRollupEntry(firesteadContext)
  //activate chokidar watcher for firebase folder
  watchFirebaseFiles(firesteadContext)
}

export async function createFirebaseConfig(firesteadContext){
  await firesteadContext.hooks.callHook('builder:config', firesteadContext)
  await writeFirebaseConfigs(firesteadContext)
  await writePackageJson(firesteadContext)
}

export async function buildFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:build:before', firesteadContext)
  // initialize build options
  if(firesteadContext.functions.handler.length === 0){
    firesteadContext.buildOptions.skip = true
  }
  // load rollup config in build mode
  firesteadContext.firebase.rollupConfig = await getRollupConfig(firesteadContext)
  // write firebase build entry file
  await writeEntryFile(firesteadContext)
  // build firebase file with rollup
  await buildRollup(firesteadContext)
  //inject Framework handle
  await injectFrameworkHandle(firesteadContext)
  //delete entry file and runtime folder
  await fse.remove(`${firesteadContext.buildPath}/build/runtime`)
  await fse.remove(`${firesteadContext.buildPath}/build/entry.js`)
}