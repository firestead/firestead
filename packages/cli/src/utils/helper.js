import fse from 'fs-extra'

export function isDir(path) {
    try {
        var stat = fse.lstatSync(path)
        return stat.isDirectory()
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false
    }
}

export async function tryImportModule (id) {
    try {
      return await import(id)
    } catch{}
}