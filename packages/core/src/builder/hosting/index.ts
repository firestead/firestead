
import { getPort } from 'get-port-please'
import { getDirectories } from "../../utils"
import { detectFramework, loadFramework } from "./framework"

import type { FiresteadContext, HostingTarget } from "@firestead/schema"

/*
* Setup hosting for firestead
*/
export async function prepareHosting(firesteadContext: FiresteadContext) {
    /*
    * Check hosting folder to register all hosting targets
    */
    const targets = await getDirectories(firesteadContext.options.hosting.dir)

    // look into folder to find target config files e.g. nuxt.config.js, nuxt.config.ts, nitro.config.js etc
    for (const target of targets) {
        const detectedHostingTarget = await detectFramework(firesteadContext.options.hosting.dir, target) as HostingTarget
        // only register if target config is detected
        if(detectedHostingTarget){
            firesteadContext.options.hosting.targets[target] = detectedHostingTarget
        }
    }

    /* 
    * set active target
    * leave it empty if no target is available or if there are multiple targets
    */
   /*
    if(Object.keys(firesteadContext.options.hosting.targets).length === 1){
        firesteadContext.options.hosting.current = Object.keys(firesteadContext.options.hosting.targets)[0]
    }*/
}

/*
* 
*/
export async function runHostingTargets(firesteadContext: FiresteadContext) {
    for(const [targetKey, target] of Object.entries(firesteadContext.options.hosting.targets) ){
        /**
         * add server configuration to hosting target
         */
        const port = await getPort({
            port: 3001
        })
        target.server = {
            port,
            hostname: 'localhost',
        }
        const frameworkInstance = await loadFramework(target)
        /**
         * create dev server
         * returned value is the target with added frameworkConfig and serverConfig
         */
        const { reload } = await frameworkInstance.createServer(target)
        //add reload function to Firestead Context
        firesteadContext.options.hosting.targets[targetKey].server.reload = reload
    }
}