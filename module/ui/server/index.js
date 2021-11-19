//https://github.com/shamscorner/vue-3-stackter

export const buildFsUI = async () => {
    const rootDir = '.'
    //const { loadNuxt, build } = await loadNuxtModule(rootDir)
    const nuxt = await loadNuxt({ rootDir })
    await build(nuxt)
}