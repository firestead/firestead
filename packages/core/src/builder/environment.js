import defu from 'defu'
import { writeFile } from './utils'
import { debounce } from 'perfect-debounce'
import { resolve } from 'pathe'

async function writeFiresteadEnvFile({ rootPath, environments}){
  return await writeFile(
    resolve(rootPath, environments.fileName),
    JSON.stringify(
      {...environments.envs},
      null,
      4
    )
  )
}

export function useEnvironment(firesteadContext, environment){
    if(typeof firesteadContext.options.environments.envs[environment] === 'undefined'){
      throw new Error(`Environment ${environment} does not exist`)
    }
    /*
    * set pointer to current environment
    */
    firesteadContext.options.environments.current = environment

    /*
    * register debounce function for writing env config file
    * debouncer is needed to avoid writing env config file multiple times
    */
    const callWriteFiresteadEnvFile = debounce(writeFiresteadEnvFile, 500)
    /*
    * register hook for environment updates
    */
    firesteadContext.hooks.hook('environments:update', (updatedEnvironmentObj)=>{
      /* 
      * merge environment object with latest state
      * delete object if property is set to '__DELETE__'
      */
      const mergeEnvironments = defu.extend((obj, key, value) => {
        if(value === '__DELETE__'){
          delete obj[key]
          return true
        }
      })
      firesteadContext.options.environments = mergeEnvironments(updatedEnvironmentObj,firesteadContext.options.environments)
      /* 
      * TODO: check if framework or firebase env vars can be updated on runtime
      * currently firebase emulator does not support updating env vars
      */

      /*
      * write firestead env file with debouncer
      */
      callWriteFiresteadEnvFile(firesteadContext.options)
  
      firesteadContext.hooks.callHook('environments:updated', firesteadContext.options)
    })
  }