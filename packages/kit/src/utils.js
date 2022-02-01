import fse from 'fs-extra'

export function createUUID(){
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))
}

export function isDir(path) {
    try {
        var stat = fse.lstatSync(path)
        return stat.isDirectory()
    } catch (e) {
        // lstatSync throws an error if path doesn't exist
        return false
    }
}