import { loadConfig } from 'c12'
import { createDefu } from 'defu'
import { useFiresteadContext } from '@firestead/kit'

import type { FiresteadContext, EnvironmentRuntime } from '@firestead/schema'

export async function loadEnvironmentConfig(firesteadContext: FiresteadContext){
    // add firestead enviroments to context
    const { config: envsRuntimes }  = await loadConfig({
      configFile: firesteadContext.options.environments.configFile,
      defaults: firesteadContext.options.environments.runtimes
  })
  firesteadContext.options.environments.runtimes = envsRuntimes

  /**
   * add default environments for development and production if not available
   * these are the default environments that will be used when no environment is specified
   * default dev/prod environments can not be removed, because they are needed for the minimal local build process
   */
  if(!firesteadContext.options.environments.runtimes['development']){
    firesteadContext.options.environments.runtimes['development'] = {
      name: 'Development',
      config: {
        projectId: 'demo-default'
      },
      envVariables: {}
    }
  }
  if(!firesteadContext.options.environments.runtimes['production']){
    firesteadContext.options.environments.runtimes['production'] = {
      name: 'Production'
    }
  }
}

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