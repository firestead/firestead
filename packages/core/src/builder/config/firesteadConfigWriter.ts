import { writeFile } from '../../utils'
import { debounce } from 'perfect-debounce'
import type { FiresteadContext, EnvironmentRuntimes } from '@firestead/schema'

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