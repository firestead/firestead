export async function initFramework(firesteadContext){
    //currently only nuxt3 is supported
    let frameworkInstance = null
    try {
        //TODO: check which firestead framework module is used(e.g. `@firestead/nuxt`) to detect which framework is used
        firesteadContext.framework.name = 'nuxt'
        if(firesteadContext.framework .name=== 'nuxt'){
            const { createServer } = await import('@firestead/nuxt')
            frameworkInstance = {
              createServer
            }
        }
      } catch (e) {
        throw new Error('No framework detected: try installing `@firestead/nuxt`.')
      }
    return frameworkInstance
}