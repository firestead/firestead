//Based on https://github.com/nuxt/framework/blob/main/packages/kit/src/internal/cjs.ts (MIT)
import { pathToFileURL } from 'url'
import { join, normalize } from 'pathe'
import { interopDefault } from 'mlly'
import jiti from 'jiti'

const _require = jiti(process.cwd(), { interopDefault: true })

export function isNodeModules (id) {
    // TODO: Follow symlinks
    return /[/\\]node_modules[/\\]/.test(id)
  }
  
  export function clearRequireCache (id) {
    if (isNodeModules(id)) {
      return
    }
  
    const entry = getRequireCacheItem(id)
  
    if (!entry) {
      delete _require.cache[id]
      return
    }
  
    if (entry.parent) {
      entry.parent.children = entry.parent.children.filter(e => e.id !== id)
    }
  
    for (const child of entry.children) {
      clearRequireCache(child.id)
    }
  
    delete _require.cache[id]
  }
  
  export function scanRequireTree (id, files = new Set()) {
    if (isNodeModules(id) || files.has(id)) {
      return files
    }
  
    const entry = getRequireCacheItem(id)
  
    if (!entry) {
      files.add(id)
      return files
    }
  
    files.add(entry.id)
  
    for (const child of entry.children) {
      scanRequireTree(child.id, files)
    }
  
    return files
  }
  
  /** Access the require cache by module id. */
  export function getRequireCacheItem (id) {
    try {
      return _require.cache[id]
    } catch (e) {
    }
  }
  
  /** Resolve the `package.json` file for a given module. */
  export function requireModulePkg (id, opts = {}) {
    return requireModule(join(id, 'package.json'), opts)
  }
  
  /** Resolve the path of a module. */
  export function resolveModule (id, opts = {}) {
    return normalize(_require.resolve(id, {
      paths: [].concat(
        opts.paths,
        process.cwd()
      ).filter(Boolean)
    }))
  }
  
  /** Try to resolve the path of a module, but don't emit an error if it can't be found. */
  export function tryResolveModule (path, opts = {}) {
    try {
      return resolveModule(path, opts)
    } catch (error) {
      if (error.code !== 'MODULE_NOT_FOUND') {
        throw error
      }
    }
  }
  
  /** Require a module and return it. */
  export function requireModule (id, opts = {}) {
    // Resolve id
    const resolvedPath = resolveModule(id, opts)
  
    // Clear require cache if necessary
    if (opts.clearCache && !isNodeModules(id)) {
      clearRequireCache(resolvedPath)
    }
  
    // Try to require
    const requiredModule = _require(resolvedPath)
  
    return requiredModule
  }
  
  export function importModule (id, opts = {}) {
    const resolvedPath = resolveModule(id, opts)
    if (opts.interopDefault !== false) {
      return import(pathToFileURL(resolvedPath).href).then(interopDefault)
    }
    return import(pathToFileURL(resolvedPath).href)
  }
  
  export function tryImportModule (id, opts = {}) {
    try {
      return importModule(id, opts).catch(() => undefined)
    } catch { }
  }
  
  /** Try to require a module, but don't emit an error if the module can't be required. */
  export function tryRequireModule (id, opts = {}) {
    try {
      return requireModule(id, opts)
    } catch (e) {
    }
  }