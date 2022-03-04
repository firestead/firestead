export async function initFramework({ framework }){
    //currently only nuxt3 is supported
    let frameworkInstance = null
    try {
        //TODO: check which firestead framework module is used(e.g. `@firestead/nuxt`) to detect which framework is used
        framework.name = 'nuxt'
        if(framework.name === 'nuxt'){
            const { createServer, build } = await import('@firestead/nuxt')
            frameworkInstance = {
              createServer,
              build
            }
        }
      } catch (e) {
        throw new Error('No framework detected: try installing `@firestead/nuxt`.')
      }
    return frameworkInstance
}