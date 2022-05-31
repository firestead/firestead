import { resolve } from 'pathe'

export default {
    /**
     * functions directory, where all firebase functions are located
     */
    dir: {
        $resolve: (val, get) => {
            const rootDir = get('rootDir')
            return resolve(rootDir, val || 'functions')
        }
    },
    /**
     * Functions watch folders that are supported by firebase functions
     * 
     */
     watchDirs: ['onCall', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
    /**
     * functions handlers and config that are registered by firestead and other configs
     * @type {Record <string, typeof import('../src/types/functionHandler').FunctionHandler>}
     */
    handlers: null
}