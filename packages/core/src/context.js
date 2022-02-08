import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { firesteadCtx, resolveModule } from '@firestead/kit'
import { createHooks } from 'hookable'
import defu from 'defu'

export function createFiresteadContext(defaultCtxOptions = {}){
    const firesteadContext = defu(defaultCtxOptions,{
        dev: true,
        rootPath: undefined,
        buildDir: '_firestead',
        buildPath: undefined,
        hooks: createHooks(),
        modulePath: dirname(resolveModule('firestead')),
        contextPath: dirname(fileURLToPath(import.meta.url)),
        functionsDir: 'firebase',
        functionsPath: undefined,
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        logger : undefined,
        framework: {
            name: undefined,
            server: undefined
        },
        firebase: {
            projectId: undefined,
            config: {},
            rollupConfig: undefined,
            runtimePath: undefined,
        },
        emulator: {
            active: true,
            services: ['functions', 'storage', 'auth', 'firestore', 'pubsub'],
            exportDir: 'emulator',
            exportPath: undefined,
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
    })

    firesteadContext.buildPath = resolve(firesteadContext.rootPath, firesteadContext.buildDir)
    firesteadContext.emulator.exportPath = resolve(firesteadContext.buildPath, firesteadContext.emulator.exportDir)
    firesteadContext.functionsPath = resolve(firesteadContext.rootPath, firesteadContext.functionsDir)

    //add firebase runtime path
    firesteadContext.firebase.runtimePath =  resolve(firesteadContext.contextPath, 'runtime')

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}