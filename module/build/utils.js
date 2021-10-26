import { createRequire } from 'module'
import fse from 'fs-extra'
import { join, resolve, dirname } from 'path'

export async function isDirectory (path) {
    try {
      return (await fse.stat(path)).isDirectory()
    } catch (_err) {
      return false
    }
}

export async function scanDirs (firesteadContext) {
    firesteadContext.watchFiles = []
    for (const dir of firesteadContext.functionsWatchDirs){
        const dirPath = `${firesteadContext._nuxt.srcDir}/${firesteadContext.functionsDir}/${dir}`
        if(await isDirectory(dirPath)){
            const watchFiles = await getAllFiles(dirPath, [], dir)
            if(watchFiles.length>0){
                firesteadContext.watchFiles=[...firesteadContext.watchFiles,...watchFiles]
            }
        }
    }
    return firesteadContext
}

async function getAllFiles (dirPath, arrayOfFiles, dir) {
    const files = await fse.readdir(dirPath)
    for(const file of files){
        if (await isDirectory(dirPath + "/" + file)) {
            //ignore directories
            //arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles)
          } else {
            arrayOfFiles.push({
              type: dir,
              path: join(dirPath, "/", file),
              ...splitFile(file)
            })
        }
    }
  return arrayOfFiles
}

export async function writeFile (file, contents, log = false) {
  await fse.mkdirp(dirname(file))
  await fse.writeFile(file, contents, 'utf-8')
  if (log) {
    consola.info('Generated', prettyPath(file))
  }
}

export function readPackageJson (
  packageName,
  _require= createRequire(import.meta.url)
) {
  try {
    return _require(`${packageName}/package.json`)
  } catch (error) {
    if (error.code === 'ERR_PACKAGE_PATH_NOT_EXPORTED') {
      const pkgModulePaths = /^(.*\/node_modules\/).*$/.exec(_require.resolve(packageName))
      for (const pkgModulePath of pkgModulePaths) {
        const path = resolve(pkgModulePath, packageName, 'package.json')
        if (fse.existsSync(path)) {
          return fse.readJSONSync(path)
        }
        continue
      }

      throw error
    }
    throw error
  }
}

function splitFile(file){
  let event = false
  let name = file
  let ext = ''
  const extArr = /(?:\.([^.]+))?$/.exec(file)
  const validExt = ['js','ts','mjs'].indexOf(extArr[1])
  if(validExt!==-1) {
    name = file.split(extArr[0])[0]
    if(name.split('.').length > 1){
      const splitName = name.split('.')
      name = splitName[0]
      if(['onCreate','onUpdate','onDelete','onWrite'].indexOf(splitName[1])!==-1){
        event = splitName[1]
      }
    }
    ext = extArr[1]
  }
  return {
    name: name,
    event: event,
    ext: ext
  }
}