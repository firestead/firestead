import { resolve } from 'pathe'
import { isDevelopment } from 'std-env'

export default {
    /**
     * The path to the firestead root directory.
     * @type {string}
     */
    rootDir: {
        $resolve: val => typeof val === 'string' ? resolve(val) : process.cwd()
    },
    /**
     * Whether Firestead is running in development mode.
     *
     * Normally you should not need to set this.
     * @type {boolean}
     */
    dev: Boolean(isDevelopment),
    /**
     * Firestead config file
     */
     configFile: {
        $resolve: (val, get) => {
            const fileName = val || 'firestead.data.json'
            const rootDir = get('rootDir')
            return resolve(rootDir, fileName)
        }
    }
}