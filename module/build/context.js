

export function getFiresteadContext({options, hooks}){
    const firesteadContext = {
        rollupConfig: undefined,
        firebaseConfig: options?.firestead?.config || {},
        hooks: hooks,
        buildDir: options?.firestead?.buildDir || '_firestead',
        functionsDir: options?.firestead?.functionsDir || 'server/firebase',
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        _nuxt: {
            dev: options.dev,
            rootDir: options.rootDir,
            srcDir: options.srcDir,
        }
    }
    return firesteadContext
}