// Inspired by nuxt3 kit https://github.com/nuxt/framework/tree/main/packages/kit (MIT)

export function defineFsAddon(definition){
    if (typeof definition !== 'object') {
        throw new Error('Addon definition must be an object')
    }
    async function initAddon(firesteadCtx) {
        console.log(definition)
        await definition.setup?.call(null, firesteadCtx)
    }
    return initAddon
}