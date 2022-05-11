import { createDefu } from 'defu'

export function registerHostingHooks(firesteadContext){
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
        firesteadContext.options.hosting.targets = mergeHostingTargets(targets,firesteadContext.options.hosting.targets[name])
        firesteadContext.hooks.callHook('hosting:targets:updated', firesteadContext.options.hosting.targets)
    })
}
