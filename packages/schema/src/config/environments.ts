import { resolve } from 'pathe'

export default {
    /**
     * Firestead env file 
     */
    configFile: {
        $resolve: (val, get) => {
            const fileName = val || '.firestead.env.json'
            const rootDir = get('rootDir')
            return resolve(rootDir, fileName)
        }
    },
    /**
     * Current active environment runtime
     */
    activeRuntime: '',

    /**
     * Defines environments like dev, staging, prod with Firebase config and env variables
     * @type {Record <string, typeof import('../src/types/environmentRuntime').EnvironmentRuntime>}
    */
    runtimes: null
}