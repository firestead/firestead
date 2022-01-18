// Inspired by nuxt3 kit https://github.com/nuxt/framework/tree/main/packages/kit (MIT)
// Based on TODO
import { useFiresteadContext } from "../context"
import { resolveModule, importModule, requireModule } from "./cjs"

export async function installAddon (fsAddon) {
    const firestedCtx = useFiresteadContext()
    if (typeof fsAddon === 'string') {
        const _src = resolveModule(fsAddon)
        // TODO: also check with type: 'module' in closest `package.json`
        const isESM = _src.endsWith('.mjs')
        fsAddon = isESM ? await importModule(_src) : requireModule(_src)
      }
    // Call module
    await fsAddon.call(null, firestedCtx)
}