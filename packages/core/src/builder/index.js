import { prepareFunctions, watchFunctions, createFirebaseConfig, buildFunctions } from './functions'
import { registerFrameworkHook } from './framework'

export { useEnvironment } from './environment'

/*
*   Main function to run firestead
*   returns two functions build/watch
*/

export async function loadFirestead(firesteadContext){


    //prepare build for firestead
    await prepareFunctions(firesteadContext)

    registerFrameworkHook(firesteadContext)

    // create firebase configuration
    await createFirebaseConfig(firesteadContext)


    return {
        build: buildFunctions,
        watch: watchFunctions
    }
}