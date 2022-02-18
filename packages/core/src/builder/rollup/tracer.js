import fse from 'fs-extra'
import { resolve, dirname } from 'pathe'
import { isFile } from '../utils'
import { nodeFileTrace } from '@vercel/nft'

export async function traceFiles(modules = [], opts = {}){
    const tracedFiles = await nodeFileTrace(modules, opts.traceOptions)
    .then(r => Array.from(r.fileList).map(f => resolve(opts.traceOptions.base, f)))
    .then(r => r.filter(file => file.includes('node_modules')))

    // // Find all unique package names
    const pkgs = new Set()
    for (const file of tracedFiles) {
        const [, baseDir, pkgName, _importPath] = /^(.+\/node_modules\/)([^@/]+|@[^/]+\/[^/]+)(\/?.*?)?$/.exec(file)
        pkgs.add(resolve(baseDir, pkgName, 'package.json'))
    }

    for (const pkg of pkgs) {
        if (!tracedFiles.includes(pkg)) {
        tracedFiles.push(pkg)
        }
    }

    const writeFile = async (file) => {
        if (!await isFile(file)) { return }
        const src = resolve(opts.traceOptions.base, file)
        const dst = resolve(opts.outDir, 'node_modules', file.replace(/^.*?node_modules[\\/](.*)$/, '$1'))
        await fse.mkdir(dirname(dst), { recursive: true })
        await fse.copyFile(src, dst)
    }

    if (process.platform === 'win32') {
        // Workaround for EBUSY on windows (#424)
        for (const file of tracedFiles) {
            await writeFile(file)
        }
    } else {
        await Promise.all(tracedFiles.map(writeFile))
    }
}