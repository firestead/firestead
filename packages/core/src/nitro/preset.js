import { resolve, dirname } from 'pathe'
import { fileURLToPath } from 'url'

const firesteadPreset = {
    entry: resolve(dirname(fileURLToPath(import.meta.url)),'entry.mjs'),
    externals: true
}

export default firesteadPreset