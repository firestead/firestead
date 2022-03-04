import fse from 'fs-extra'
import { isDirectory } from './utils'
import { scanDirs, watchFunctionsFolder } from './firebase/watcher'
import { writeEntryFile, injectFrameworkHandle, writeFirebaseConfigs, writePackageJson } from './firebase/writer'
import { watchRollupEntry, buildRollup } from './rollup/bundler'
import { getRollupConfig } from './rollup/config'

export async function prepareFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:prepare', firesteadContext.options)
  const firesteadDir = await isDirectory(firesteadContext.options.buildConfig.path)
  if(firesteadContext.options.dev){
    if(firesteadDir){
        await fse.emptyDir(`${firesteadContext.options.buildConfig.path}/firebase`)
        await fse.emptyDir(`${firesteadContext.options.buildConfig.path}/console`)
    }
    await fse.mkdirp(`${firesteadContext.options.buildConfig.path}/firebase/functions`)
    await fse.mkdirp(`${firesteadContext.options.buildConfig.path}/firebase/runtime`)
    await fse.copy(firesteadContext.options.functions.runtimePath, `${firesteadContext.options.buildConfig.path}/firebase/runtime`, { overwrite: true })
  }else{
    if(firesteadDir){
        await fse.emptyDir(`${firesteadContext.options.buildConfig.path}/build`)
    }
    await fse.mkdirp(`${firesteadContext.options.buildConfig.path}/build/functions`)
    await fse.copy(firesteadContext.options.functions.runtimePath, `${firesteadContext.options.buildConfig.path}/build/runtime`, { overwrite: true })
  }
  //get all function handler on startup
  firesteadContext.options.functions.handler = await scanDirs(firesteadContext.options.functions)
}

export async function watchFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:watch:before', firesteadContext.options)
  // write default entry file
  await writeEntryFile(firesteadContext.options)
  // load rollup config in dev mode
  firesteadContext.options.rollupConfig = await getRollupConfig(firesteadContext)
  // watch and bundle firebase files
  watchRollupEntry(firesteadContext.options.rollupConfig)
  // watch firebase files
  firesteadContext.hooks.hook('functions:updated',async (functionHandler, updateContext)=>{
    firesteadContext.functions.handler = functionHandler
    //if a new function is added or removed, we need to rewrite the entry file
    if(['add', 'unlink'].indexOf(updateContext.event) !== -1){
      // write firebase build entry file
      await writeEntryFile(firesteadContext.options)
    }
  })
  //activate chokidar watcher for firebase folder
  watchFunctionsFolder(firesteadContext)
}

export async function createFirebaseConfig(firesteadContext){
  await firesteadContext.hooks.callHook('builder:config:before', firesteadContext.options)
  await writeFirebaseConfigs(firesteadContext.options)
  await writePackageJson(firesteadContext.options)
}

export function useEnviroment(firesteadContext, enviroment){
    let enviromentsRuntime = firesteadContext.options.enviroments.envs.filter(env => env.id === enviroment)[0]
    if(typeof enviromentsRuntime === 'undefined'){
      enviromentsRuntime = {
        id: "development",
        name: "Development",
        config: {
          projectId: "default"
        },
        envVariables: {}
      }
    }
    firesteadContext.options.enviroments.runtime = enviromentsRuntime
}

export async function buildFirebase(firesteadContext){
  await firesteadContext.hooks.callHook('builder:build:before', firesteadContext.options)
  // initialize build options
  if(firesteadContext.options.functions.handler.length === 0){
    firesteadContext.options.buildConfig.skip = true
  }
  // load rollup config in build mode
  firesteadContext.options.rollupConfig = await getRollupConfig(firesteadContext)
  // write firebase build entry file
  await writeEntryFile(firesteadContext.options)
  // build firebase file with rollup
  await buildRollup(firesteadContext.options)
  //inject Framework handle
  await injectFrameworkHandle(firesteadContext.options)
  //delete entry file and runtime folder
  await fse.remove(`${firesteadContext.options.buildConfig.path}/build/runtime`)
  await fse.remove(`${firesteadContext.options.buildConfig.path}/build/entry.js`)
}