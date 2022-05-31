import { resolve } from 'pathe'

export default {
    /**
     * The path to the firestead build directory
     */
    dir: {
        $resolve: (val, get) => {
            const rootDir = get('rootDir')
            return resolve(rootDir, val || '_firestead')
        }
    },
    /**
     * Rollup config
     */
    rollup: {},
    /**
     * Defines if firestead build process should be skipped
     */
    skip: false
}