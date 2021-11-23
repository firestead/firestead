import fse from 'fs-extra'
import { resolve } from 'pathe'
import { isDirectory, scanDirs } from './utils'
import { resolvePagesRoutes } from './ui/pages'
import { writeRoutesFile } from './ui/routes'
import { watchFirebaseFiles } from './firebase/watcher'
import { writeEntryFile } from './firebase/entry'
import { rollupFirebase, rollupUI } from './rollup/bundler'

export async function prepare(firesteadContext){
  const firesteadDir = await isDirectory(firesteadContext.buildPath)
  if(firesteadDir){
      await fse.emptyDir(firesteadContext.buildPath)
  }
  await fse.mkdirp(`${firesteadContext.buildPath}/firebase/functions`)
  await fse.mkdirp(`${firesteadContext.buildPath}/firebase/runtime`)
  await fse.copy(resolve(firesteadContext.contextDir, 'runtime/functions'), `${firesteadContext.buildPath}/firebase/runtime`, { overwrite: true })
  await fse.mkdirp(`${firesteadContext.buildPath}/ui/app`)
  await fse.mkdirp(`${firesteadContext.buildPath}/ui/runtime`)
  await fse.copy(resolve(firesteadContext.contextDir, 'runtime/ui'), `${firesteadContext.buildPath}/ui/runtime`, { overwrite: true })
  await scanDirs(firesteadContext)
  //activate chokidar watcher from nuxt
  watchFirebaseFiles(firesteadContext)
}

export async function bundleUI(firesteadContext){
  // get pages for fs ui
  await resolvePagesRoutes(firesteadContext)
  // write routes to file
  await writeRoutesFile(firesteadContext)
  // watch and bundle ui files
  rollupUI(firesteadContext)
}

export async function bundleFirebase(firesteadContext){
  // write firebase build entry file
  await writeEntryFile(firesteadContext)
  // watch and bundle firebase files
  rollupFirebase(firesteadContext)
}