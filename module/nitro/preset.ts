import { resolve } from 'path'
import type { NitroPreset } from '@nuxt/nitro'

const firesteadPreset: NitroPreset = {
    entry: resolve(__dirname, 'entry.js'),
    externals: true
}

export default firesteadPreset