import { createRequire } from 'module'
import fse from 'fs-extra'
import { resolve, dirname } from 'pathe'


export async function isFile (file) {
  try {
    const stat = await fse.stat(file)
    return stat.isFile()
  } catch (err) {
    if (err.code === 'ENOENT') { return false }
    throw err
  }
}

export async function isDirectory (path) {
  try {
    return (await fse.stat(path)).isDirectory()
  } catch (_err) {
    return false
  }
}

export async function getDirectories(path) {
  const directories = await fse.readdir(path)
  return await directories.filter((file) => {
    return fse.statSync(resolve(path, file)).isDirectory()
  })
}

export async function getFiles(path){
  const files = await fse.readdir(path)
  return await files.filter((file) => {
    return !fse.statSync(resolve(path, file)).isDirectory()
  })
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
