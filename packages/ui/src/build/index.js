import fse from 'fs-extra'
import { watch } from './rollup/bundler'
import { resolvePagesRoutes } from './ui/pages'
import { writeRoutesFile } from './ui/routes'
import { writeNavigationFile } from './ui/navigation'

export async function prepare(firesteadContext){
  await fse.mkdirp(firesteadContext.ui.buildAppPath)
  await fse.mkdirp(firesteadContext.ui.buildRuntimePath)
  await fse.copy(`${firesteadContext.ui.contextPath}/${firesteadContext.ui.runtimeDir}`, firesteadContext.ui.buildRuntimePath, { overwrite: true })
}

export async function bundle(firesteadContext){
    // get pages for fs ui
    await resolvePagesRoutes(firesteadContext)
    // write routes to file
    await writeRoutesFile(firesteadContext)
    // write navigation to file
    await writeNavigationFile(firesteadContext)
    // watch and bundle ui files
    watch(firesteadContext)
  }