import { createDefu } from 'defu'
import { useFiresteadContext } from './context'

import type { FiresteadContext, HostingTarget, FrameworkConfig } from "@firestead/schema"

export function updateHostingTarget(target: string, hostingTarget: HostingTarget): void{
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.hosting.targets[target] === 'undefined'){
        throw new Error(`Hosting Target ${target} does not exist`)
    }
    /* 
    * merge hosting target object with latest state
    * arrays should be overwritten
    */
    const mergeHostingTarget = createDefu((obj, key, value) => {
        if(value === '__DELETE__'){
            delete obj[key]
            return true
        }
        if(Array.isArray(obj[key])){
            obj[key] = value
            return true
        }
    })
    firesteadContext.options.hosting.targets[target] = mergeHostingTarget(hostingTarget,firesteadContext.options.hosting.targets[target])
    /**
     * Call hook to trigger update 
     */
    firesteadContext.hooks.callHook('hosting:targetsUpdate', firesteadContext.options.hosting.targets)
}

export function removeHostingTarget(targetKey: string){
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.hosting.targets[targetKey] === 'undefined'){
        throw new Error(`Hosting Target ${targetKey} does not exist`)
    }
    delete firesteadContext.options.hosting.targets[targetKey]
    /**
     * Call hook to trigger update 
     */
    firesteadContext.hooks.callHook('hosting:targetsUpdate', firesteadContext.options.hosting.targets)
}

export function addFrameworkConfig(targetKey: string, frameworkConfig: FrameworkConfig){
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.hosting.targets[targetKey] === 'undefined'){
        throw new Error(`Hosting Target ${targetKey} does not exist`)
    }
    firesteadContext.options.hosting.targets[targetKey].frameworkConfig = frameworkConfig
    /**
     * Call hook to trigger update 
     */
    firesteadContext.hooks.callHook('hosting:targetsUpdate', firesteadContext.options.hosting.targets)
}