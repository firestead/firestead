import { loadConfig } from 'c12'
import { writeFile } from '../../utils'
import { debounce } from 'perfect-debounce'

import type { FiresteadContext, EnvironmentRuntimes } from '@firestead/schema'

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

async function writeFiresteadEnvFile(configFile: string, enviromentsRuntimes: EnvironmentRuntimes) {
  return await writeFile(
    configFile,
    JSON.stringify(
      {...enviromentsRuntimes},
      null,
      4
    )
  )
}

/**
* Registers a hook to be called when environment variables are updated
* hook: environments:runtimesUpdate
*/
export function registerEnvConfigWriter(firesteadContext: FiresteadContext){
  /*
  * register debounce function for writing env config file
  * debouncer is needed to avoid writing env config file multiple times
  */
  const callWriteFiresteadEnvFile = debounce(writeFiresteadEnvFile, 500)

  firesteadContext.hooks.hook('environments:runtimesUpdate', (enviromentsRuntimes: EnvironmentRuntimes) => {
      /*
      * write firestead env file with debouncer
      */
      callWriteFiresteadEnvFile(firesteadContext.options.environments.configFile, enviromentsRuntimes)
  })
}