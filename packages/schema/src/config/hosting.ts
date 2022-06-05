import { resolve } from 'pathe'

export default {
    /**
     * hosting directory, where all hosting targets are located
     */
    dir: {
        $resolve: (val, get) => {
            const rootDir = get('rootDir')
            return resolve(rootDir, val || 'hosting')
        }
    },
    /**
     * current active target
     */
    current: '',
    /**
     * hosting targets
     * @type {Record <string, typeof import('../src/types/hostingTarget').HostingTarget>}
     */
    targets: {}
}