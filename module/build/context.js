import { resolveModule } from '@nuxt/kit-edge'
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

function getFullPath(dir){
    return resolve(dirname(fileURLToPath(import.meta.url)),dir)
}

export function getFiresteadContext({options, hooks, hook}){
    const firesteadContext = {
        hooks: hooks,
        hook: hook,
        buildDir: options?.firestead?.buildDir || '_firestead',
        moduleDir: dirname(resolveModule('firestead')),
        functionsDir: options?.firestead?.functionsDir || 'server/firebase',
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        firebase: {
            config: options?.firestead?.config || {},
            rollupConfig: undefined,
            runtimeDir: getFullPath('runtime/functions')
        },
        ui:{
            appDir: getFullPath('runtime/ui'),
            rollupConfig: undefined
        },
        _nuxt: {
            dev: options.dev,
            rootDir: options.rootDir,
            srcDir: options.srcDir,
        }
    }
    return firesteadContext
}