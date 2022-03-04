import fse from 'fs-extra'
import { resolvePagesRoutes } from './console/pages'
import { writeRoutesFile } from './console/routes'
import { writeNavigationFile } from './console/navigation'

export async function prepareRuntime({ contextPath, buildConfig }){
  await fse.mkdirp(buildConfig.appPath)
  await fse.mkdirp(buildConfig.runtimePath)
  await fse.copy(`${contextPath}/${buildConfig.runtimeDir}`, buildConfig.runtimePath, { overwrite: true })
}

export async function createFiles(firesteadContext){
    // get pages for fs ui
    await resolvePagesRoutes(firesteadContext)
    // write routes to file
    await writeRoutesFile(firesteadContext.console)
    // write navigation to file
    await writeNavigationFile(firesteadContext.console)
    // watch and bundle ui files
    //watch(firesteadContext)
  }

