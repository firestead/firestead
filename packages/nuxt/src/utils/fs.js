import { promises as fsp } from 'fs'
import { dirname } from 'pathe'

// Check if a file exists
export async function exists (path) {
  try {
    await fsp.access(path)
    return true
  } catch {
    return false
  }
}

export async function clearDir (path) {
  await fsp.rm(path, { recursive: true, force: true })
  await fsp.mkdir(path, { recursive: true })
}

export function findup(rootDir, fn){
  let dir = rootDir
  while (dir !== dirname(dir)) {
    const res = fn(dir)
    if (res) {
      return res
    }
    dir = dirname(dir)
  }
  return null
}