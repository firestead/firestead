import { loadFramework } from './firestead'
import { prepareFunctions, watchFunctions, createFirebaseConfig, buildFunctions } from './functions'
import { prepareHosting } from './hosting'

export { useEnvironment } from './environment'

/*
*   Main function to run firestead
*   @param {Object} firesteadContext
*   
*   returns two functions that can build firebase functions and watch functions folder for changes
*   @returns { buildFunctions, watchFunctions }
*/

export async function loadFirestead(firesteadContext){


    //prepare firebase functions
    await prepareFunctions(firesteadContext)

    //prepare hosting
    await prepareHosting(firesteadContext)

    // create firebase configuration
    await createFirebaseConfig(firesteadContext)


    return {
        loadFramework: loadFramework,
        build: buildFunctions,
        watch: watchFunctions
    }
}