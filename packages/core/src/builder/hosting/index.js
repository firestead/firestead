import { getDirectories } from "../utils"
import { detectFramework } from "./framework"
import { registerHostingHooks } from "./hooks"

/*
*
*/
export async function prepareHosting(firesteadContext){
    /*
    * Check hosting folder to register all hosting targets
    */
    const targets = await getDirectories(firesteadContext.options.hosting.path)

    // look into folder to find target config files e.g. nuxt.config.js, nuxt.config.ts, nitro.config.js etc
    for (const target of targets) {
        const targetConfig = await detectFramework(firesteadContext.options.hosting.path, target)
        // only register if target config is detected
        if(targetConfig){
            firesteadContext.options.hosting.targets[target] = targetConfig
        }
    }
    /* 
    * set active target
    * leave it empty if no target is available or if there are multiple targets
    */
    if(Object.keys(firesteadContext.options.hosting.targets).length === 1){
        firesteadContext.options.hosting.activeTarget = Object.keys(firesteadContext.options.hosting.targets)[0]
    }
    
    console.log(firesteadContext.options.hosting)

    /*
    * Hosting configuration can be updated via hooks
    * This function registers all hooks that handle updates
    */
    registerHostingHooks(firesteadContext)
}