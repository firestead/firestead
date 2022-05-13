import { prepareFunctions, watchFunctions, createFirebaseConfig, buildFunctions } from './functions'
import { getFrameworkInstance } from './hosting/framework'
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
        build: buildFunctions,
        watch: watchFunctions
    }
}

/*
* Function to import a framework instance by a given target
*
* params {Object} firesteadContext.options
* target {String} target name
* returns {Object} framework instance
*/
export async function loadFramework({ hosting }, target = null) {
    if(!target && hosting.current){
        target = hosting.current
    }else{
        throw new Error('No target provided and no active target found.')
    }
    const frameworkInstance = await getFrameworkInstance(hosting.targets[target])
    return frameworkInstance
}