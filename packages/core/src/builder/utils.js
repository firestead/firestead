import { createRequire } from 'module'
import fse from 'fs-extra'
import { join, resolve, dirname } from 'pathe'

export async function isDirectory (path) {
    try {
      return (await fse.stat(path)).isDirectory()
    } catch (_err) {
      return false
    }
}

export async function scanDirs (firesteadContext) {
    firesteadContext.functions = []
    for (const dir of firesteadContext.functionsWatchDirs){
        const dirPath = `${firesteadContext.functionsPath}/${dir}`
        if(await isDirectory(dirPath)){
            const functions = await getAllFiles(dirPath, [], dir)
            if(functions.length>0){
                firesteadContext.functions=[...firesteadContext.functions,...functions]
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

export async function isFile (file) {
  try {
    const stat = await fse.stat(file)
    return stat.isFile()
  } catch (err) {
    if (err.code === 'ENOENT') { return false }
    throw err
  }
}

export async function writeFile (file, contents, log = false) {
  await fse.mkdirp(dirname(file))
  await fse.writeFile(file, contents, 'utf-8')
  if (log) {
    consola.info('Generated', prettyPath(file))
  }
}

export async function resolveLinkedPath(path, dir) {
  path = resolve(path,dir)
  let isLink = false
  try {
      await fse.readlink(path)
      isLink = true
  } catch (error) {
      // nothing to do
  }
  if(isLink){
    path = await fse.realpath(path)
  }
  return path
}

// Based on https://github.com/nuxt/framework/blob/main/packages/nitro/src/utils/index.ts (MIT)
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

export async function mergeDirs (src, dest) {

  const files = await fse.readdir(src)

  files.forEach(async (file) => {
    const srcFile = '' + src + '/' + file
    const destFile = '' + dest + '/' + file
    const stats = fse.lstatSync(srcFile)
    if (stats.isDirectory()) {
     await mergeDirs(srcFile, destFile)
    } else {
      if (!fse.existsSync(destFile)) {
        await writeFile(destFile, fse.readFileSync(srcFile))
      }
    }
  })
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
      if(['onCreate','onUpdate','onDelete','onWrite','onArchive','onFinalize','onMetadataUpdate'].indexOf(splitName[1])!==-1){
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