import { resolve, dirname } from 'pathe'
import { fileURLToPath } from 'url'
import type { NitroPreset } from '@nuxt/nitro'

const firesteadPreset: NitroPreset = {
    entry: resolve(dirname(fileURLToPath(import.meta.url)),'entry.js'),
    externals: true
}

export default firesteadPreset