//Based on (https://github.com/nuxt/framework/blob/main/packages/nuxi/src/utils/cjs.ts)
import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import { normalize, dirname } from 'pathe'

//TODO: check if needed
export function getModulePaths (paths) {
  return [].concat(
    // @ts-ignore
    global.__NUXT_PREPATHS__,
    ...(Array.isArray(paths) ? paths : [paths]),
    process.cwd(),
    // @ts-ignore
    global.__NUXT_PATHS__
  ).filter(Boolean)
}

const _require = createRequire(process.cwd())

export function resolveModule (id, paths) {
  return normalize(_require.resolve(id, { paths: getModulePaths(paths) }))
}

export function tryResolveModule (id, paths) {
  try {
    return resolveModule(id, paths)
  } catch { return null }
}

export function requireModule (id, paths) {
  return _require(resolveModule(id, paths))
}

export function importModule (id, paths) {
  const resolvedPath = resolveModule(id, paths)
  return import(pathToFileURL(resolvedPath).href)
}

export function getNearestPackage (id, paths) {
  while (dirname(id) !== id) {
    try { return requireModule(id + '/package.json', paths) } catch { }
    id = dirname(id)
  }
  return null
}