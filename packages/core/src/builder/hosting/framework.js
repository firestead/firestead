import { getFiles } from "../utils"

/*
* look into folder to find target config files e.g. nuxt.config.js, nuxt.config.ts, nitro.config.js etc
* return infos of framework that can be read from config
*/
export async function detectFramework(hostingPath, targetFolderName){
    const frameworksDetection = [{
        pattern: /nuxt.config.*$/,
        package: '@firestead/nuxt',
        name: 'nuxt'
    },{
        pattern: /remix.config.*$/,
        name: 'remix'
    }]
    const targetFolderFiles = await getFiles(`${hostingPath}/${targetFolderName}`)
    const targetConfig = {}
    for (const file of targetFolderFiles) {
        frameworksDetection.forEach((framework) => {
            if(file.match(framework.pattern)){
                targetConfig.framework = framework.name
                targetConfig.package = framework.package
                targetConfig.path = `${hostingPath}/${targetFolderName}`
                targetConfig.details = {}
            }
        })
    }
    //add target folder name to config if framework is detected
    if(targetConfig.framework){
        targetConfig.name = targetFolderName
    }else{
        return null
    }
    return targetConfig
}

/*
*   create framework instance, imports package
*   @param {Object} targetConfig
*   @returns {Object} framework instance
*/

export async function getFrameworkInstance(target){
    //currently only nuxt3 is supported
    let frameworkInstance = null
    try {
        const { createServer, build } = await import(target.package)
        frameworkInstance = {
          createServer,
          build
        }
      } catch (e) {
        throw new Error('No package for this framework detected: try installing a package that is supported by firestead e.g. `@firestead/nuxt`.')
      }
    return frameworkInstance
}