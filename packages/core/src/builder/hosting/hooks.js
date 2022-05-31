import { createDefu } from 'defu'
import { writeFiresteadConfig } from '../config'
import { debounce } from 'perfect-debounce'

export function registerHostingHooks(firesteadContext){
    /*
    * register debounce function for writing firestead config file
    * debouncer is needed to avoid writing env config file multiple times
    */
    const callWriteFiresteadEnvFile = debounce(writeFiresteadConfig, 500)
    /*
    * register hook for hosting targets updates
    */
    firesteadContext.hooks.hook('hosting:targets:update', (targets)=>{
        /* 
        * merge hosting target object with latest state
        * arrays should be overwritten
        */
        const mergeHostingTargets = createDefu((obj, key, value) => {
            if(Array.isArray(obj[key])){
                obj[key] = value
                return true
            }
        })
        firesteadContext.options.hosting.targets = mergeHostingTargets(targets,firesteadContext.options.hosting.targets)
        /*
        * write firestead config file with debouncer
        */
        callWriteFiresteadEnvFile(firesteadContext)
        /*
        * send hook to update firebase hosting targets
        */
        firesteadContext.hooks.callHook('hosting:targets:updated', firesteadContext.options.hosting.targets)
    })
}
