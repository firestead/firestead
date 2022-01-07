import fse from 'fs-extra'
import { isDirectory, scanDirs } from './utils'
import { watchFirebaseFiles } from './firebase/watcher'
import { writeEntryFile } from './firebase/entry'
import { watch } from './rollup/bundler'

export async function prepare(firesteadContext){
  const firesteadDir = await isDirectory(firesteadContext.buildPath)
  if(firesteadDir){
      await fse.emptyDir(firesteadContext.buildPath)
  }
  await fse.mkdirp(`${firesteadContext.buildPath}/firebase/functions`)
  await fse.mkdirp(`${firesteadContext.buildPath}/firebase/runtime`)
  await fse.copy(firesteadContext.firebase.runtimePath, `${firesteadContext.buildPath}/firebase/runtime`, { overwrite: true })
  await scanDirs(firesteadContext)
  //activate chokidar watcher from nuxt
  watchFirebaseFiles(firesteadContext)
}

export async function bundle(firesteadContext){
  // write firebase build entry file
  await writeEntryFile(firesteadContext)
  // watch and bundle firebase files
  watch(firesteadContext)
}