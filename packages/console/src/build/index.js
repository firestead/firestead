import fse from 'fs-extra'
import { resolvePagesRoutes } from './console/pages'
import { writeRoutesFile } from './console/routes'
import { writeNavigationFile } from './console/navigation'

export async function prepareRuntime(firesteadContext){
  await fse.mkdirp(firesteadContext.console.buildAppPath)
  await fse.mkdirp(firesteadContext.console.buildRuntimePath)
  await fse.copy(`${firesteadContext.console.contextPath}/${firesteadContext.console.runtimeDir}`, firesteadContext.console.buildRuntimePath, { overwrite: true })
}

export async function createFiles(firesteadContext){
    // get pages for fs ui
    await resolvePagesRoutes(firesteadContext)
    // write routes to file
    await writeRoutesFile(firesteadContext)
    // write navigation to file
    await writeNavigationFile(firesteadContext)
    // watch and bundle ui files
    //watch(firesteadContext)
  }

