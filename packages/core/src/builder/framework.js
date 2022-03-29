import defu from 'defu'

export function registerFrameworkHook(firesteadContext){
        /*
        * register hook for environment updates
        */
        firesteadContext.hooks.hook('framework:update', (framework)=>{
        /* 
        * merge framework object with latest state
        * arrays should be overwritten
        */
        const mergeFramework = defu.extend((obj, key, value) => {
            if(Array.isArray(obj[key])){
                obj[key] = value
                return true
            }
        })
        firesteadContext.options.framework = mergeFramework(framework,firesteadContext.options.framework)
        firesteadContext.hooks.callHook('framework:updated', firesteadContext.options)
    })
}
