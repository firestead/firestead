import { loadConfig } from 'c12'
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

export async function useEnvironment(firesteadContext, environment){
    if(typeof firesteadContext.options.environments.envs[environment] === 'undefined'){
      throw new Error(`Environment ${environment} does not exist`)
    }
    /*
    * set pointer to current environment
    */
    firesteadContext.options.environments.current = environment


    // add firestead enviroments to context
    const { config: envsConfig } = await loadConfig({
        configFile: `${firesteadContext.options.rootPath}/${firesteadContext.options.environments.fileName}`,
        defaults: firesteadContext.options.environments.envs
    })
    firesteadContext.options.environments.envs = envsConfig

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
      * currently firebase emulator does not support updating env vars on runtime
      */

      /*
      * write firestead env file with debouncer
      */
      callWriteFiresteadEnvFile(firesteadContext.options)
  
      firesteadContext.hooks.callHook('environments:updated', firesteadContext.options)
    })
  }