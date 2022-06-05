import type { HostingTarget, Framework } from "@firestead/schema"
import { getFiles } from "../../utils"

interface FrameworkDetectionParams {
    pattern: RegExp,
    package: string,
    name: Framework
}
interface DetectedFrameworks extends Array<FrameworkDetectionParams>{}

interface FrameworkInstance {
    createServer: Function,
    build: Function
}

/*
* look into folder to find target config files e.g. nuxt.config.js, nuxt.config.ts, nitro.config.js etc
* return infos of framework that can be read from config
*/
export async function detectFramework(hostingPath: string, targetFolderName: string): Promise<HostingTarget>{
    const availableFrameworks: DetectedFrameworks = [{
        pattern: /nuxt.config.*$/,
        package: '@firestead/nuxt',
        name: 'nuxt'
    },{
        pattern: /remix.config.*$/,
        package: '@firestead/remix',
        name: 'remix'
    }]
    const targetFolderFiles = await getFiles(`${hostingPath}/${targetFolderName}`)
    const hostingTarget = {} as HostingTarget
    for (const file of targetFolderFiles) {
        availableFrameworks.forEach((framework) => {
            if(file.match(framework.pattern)){
                hostingTarget.framework = framework.name
                hostingTarget.package = framework.package
                hostingTarget.rootDir = `${hostingPath}/${targetFolderName}`
                hostingTarget.frameworkConfig = {}
                hostingTarget.hostingConfig = {}
            }
        })
    }
    //add target folder name to config if framework is detected
    if(hostingTarget.framework){
        hostingTarget.name = targetFolderName
    }else{
        return null
    }
    return hostingTarget
}

/*
* Function to import a framework instance by a given target
*
*/
export async function loadFramework(target: HostingTarget):  Promise<FrameworkInstance>{
    let frameworkInstance : FrameworkInstance = null
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