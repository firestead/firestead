

export function getFiresteadContext({options, hooks}){
    const firesteadContext = {
        rollupConfig: undefined,
        hooks: hooks,
        buildDir: '_firestead',
        functionsDir: 'server/firebase',
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