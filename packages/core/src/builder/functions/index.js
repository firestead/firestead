import fse from 'fs-extra'
import { isDirectory } from '../utils'
import { scanDirs, watchFunctionsFolder } from './watcher'
import { writeEntryFile, injectFrameworkHandle, writeFirebaseEnvVariables, writeFirebaseConfigs, writePackageJson } from './writer'
import { watchRollupEntry, buildRollup } from '../rollup/bundler'
import { getRollupConfig } from '../rollup/config'

export async function prepareFunctions(firesteadContext){
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


export async function watchFunctions(firesteadContext){
    await firesteadContext.hooks.callHook('builder:watch:before', firesteadContext.options)
    // write env file
    await writeFirebaseEnvVariables(firesteadContext.options)
    // write default entry file
    await writeEntryFile(firesteadContext.options)
    // load rollup config in dev mode
    firesteadContext.options.rollupConfig = await getRollupConfig(firesteadContext)
    // watch and bundle firebase files
    watchRollupEntry(firesteadContext.options.rollupConfig)
    // handle function updates
    firesteadContext.hooks.hook('functions:update',async (functionHandler, updateContext)=>{
      // rewrite entry file depends on case
      let rewriteEntryFile = false
  
      if(updateContext.event === 'add'){
        firesteadContext.options.functions.handler.push(functionHandler)
        if(functionHandler.active){
          rewriteEntryFile = true
        }
      }
      if(updateContext.event === 'unlink'){
        const index = firesteadContext.options.functions.handler.findIndex(v => v.path === updateContext.path)
        firesteadContext.options.functions.handler.splice(index, 1)
        rewriteEntryFile = true
      }
      if(updateContext.event === 'change'){
        const index = firesteadContext.options.functions.handler.findIndex(v => v.path === updateContext.path)
        // check if function turned active 
        // -> could happen if a function was previously added but without config and default function handler
        if(!firesteadContext.options.functions.handler[index].active && functionHandler.active){
          rewriteEntryFile = true
        }
        firesteadContext.options.functions.handler[index] = functionHandler
      }
  
      //if a new function is added or removed, we need to rewrite the entry file
      // also if a function turned active
      if(rewriteEntryFile) await writeEntryFile(firesteadContext.options)
    })
    //activate chokidar watcher for firebase folder
    watchFunctionsFolder(firesteadContext)
  }
  
  export async function createFirebaseConfig(firesteadContext){
    await firesteadContext.hooks.callHook('builder:config:before', firesteadContext.options)
    await writeFirebaseConfigs(firesteadContext.options)
    await writePackageJson(firesteadContext.options)
  }
  
  
  
  export async function buildFunctions(firesteadContext){
    await firesteadContext.hooks.callHook('builder:build:before', firesteadContext.options)
    // initialize build options
    if(firesteadContext.options.functions.handler.length === 0){
      firesteadContext.options.buildConfig.skip = true
    }
    // load rollup config in build mode
    firesteadContext.options.rollupConfig = await getRollupConfig(firesteadContext)
    // write env file
    await writeEnvVariables(firesteadContext.options)
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