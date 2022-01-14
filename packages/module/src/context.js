import { resolveModule } from '@nuxt/kit'
import { firesteadCtx } from '@firestead/kit'
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { getRollupConfig } from './builder/rollup/config'

export function createFiresteadContext({options, hooks, hook}){
    const firesteadContext = {
        hooks: hooks,
        hook: hook,
        buildDir: options?.firestead?.buildDir || '_firestead',
        buildPath: undefined,
        modulePath: dirname(resolveModule('firestead')),
        contextPath: dirname(fileURLToPath(import.meta.url)),
        functionsDir: options?.firestead?.functionsDir || 'server/firebase',
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        firebase: {
            config: options?.firestead?.config || {},
            rollupConfig: undefined,
            runtimePath: resolve(dirname(fileURLToPath(import.meta.url)),'runtime')
        },
        ui:{
            contextPath: undefined,
            runtimeDir: undefined,
            rollupConfig: undefined,
            buildRuntimePath: undefined,
            buildAppPath: undefined,
            pagesDir: undefined,
            extensions: ['.js','.vue'],
            routes: [],
            navbar: [],
            sidebar: [],
            navigation: {
                order: [],
                menu: []
            }
        },
        _nuxt: {
            dev: options.dev,
            rootDir: options.rootDir,
            srcDir: options.srcDir,
        }
    }
    firesteadContext.buildPath = resolve(firesteadContext._nuxt.rootDir, firesteadContext.buildDir)

    //add firebase context
    firesteadContext.firebase.rollupConfig = getRollupConfig(firesteadContext)

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}