import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { firesteadCtx, resolveModule } from '@firestead/kit'
import { getRollupConfig } from './builder/rollup/config'
import { resolveLinkedPath } from './builder/utils'

export async function createFiresteadContext({rootPath, dev = false}){
    const firesteadContext = {
        dev: dev,
        rootPath: rootPath,
        buildDir: '_firestead',
        buildPath: undefined,
        modulePath: dirname(resolveModule('firestead')),
        contextPath: dirname(fileURLToPath(import.meta.url)),
        functionsDir: 'server/firebase',
        functionsPath: undefined,
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        logger : undefined,
        framework: {
            name: undefined,
            server: undefined
        },
        firebase: {
            config: {},
            rollupConfig: undefined,
            runtimePath: undefined
        },
        ui:{
            contextPath: undefined,
            runtimeDir: undefined,
            rollupConfig: undefined,
            buildRuntimePath: undefined,
            buildAppPath: undefined,
            pages: [],
            extensions: ['.js','.vue'],
            routes: [],
            navigation: {
                order: [],
                menu: []
            }
        }
    }
    firesteadContext.buildPath = resolve(firesteadContext.rootPath, firesteadContext.buildDir)
    firesteadContext.functionsPath = resolve(firesteadContext.rootPath, firesteadContext.functionsDir)

    //add firebase rollup configuration
    firesteadContext.firebase.runtimePath = await resolveLinkedPath(firesteadContext.modulePath,'runtime')
    firesteadContext.firebase.rollupConfig = getRollupConfig(firesteadContext)

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}