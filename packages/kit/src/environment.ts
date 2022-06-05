import { createDefu } from 'defu'
import { useFiresteadContext } from './context'

import type { FiresteadContext, EnvironmentRuntime } from '@firestead/schema'

export function setEnvironment(environment : string){
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.environments.runtimes[environment] === 'undefined'){
        throw new Error(`Environment ${environment} does not exist`)
    }
    /*
    * set pointer to current environment
    */
    firesteadContext.options.environments.activeRuntime = environment
}
  
  
  
export async function updateEnvironmentRuntime(name : string, runtime : EnvironmentRuntime){
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.environments.runtimes[name] === 'undefined'){
    throw new Error(`Environment ${name} does not exist`)
    }
    /* 
    * merge environment object with latest state
    * delete object if property is set to '__DELETE__'
    */
    const mergeEnvironments = createDefu((obj, key, value) => {
    if(value === '__DELETE__'){
        delete obj[key]
        return true
    }
    })

    firesteadContext.options.environments.runtimes[name] = mergeEnvironments(runtime, firesteadContext.options.environments.runtimes[name])
    /* 
    * TODO: check if framework or firebase env vars can be updated on runtime
    * currently firebase emulator does not support updating env vars on runtime
    */

    firesteadContext.hooks.callHook('environments:runtimesUpdate', firesteadContext.options.environments.runtimes)
}
  
export function removeEnvironmentRuntime(name: string){
    const firesteadContext: FiresteadContext = useFiresteadContext()
    if(typeof firesteadContext.options.environments.runtimes[name] === 'undefined'){
    throw new Error(`Environment ${name} does not exist`)
    }
    delete firesteadContext.options.environments.runtimes[name]
    /**
     * Call hook to trigger update 
     */
    firesteadContext.hooks.callHook('environments:runtimesUpdate', firesteadContext.options.environments.runtimes)
}