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
        buildOptions: {},
        logger : undefined,
        functions: {
            dir: 'firebase',
            path: undefined,
            watchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
            handler: []
        },
        env: {
            path: null,
            fileName: '.firestead.env.js'
        },
        framework: {
            name: undefined,
            server: undefined,
            isReady: false
        },
        firebase: {
            projectId: undefined,
            config: {},
            rollupConfig: undefined,
            runtimePath: undefined,
        },
        emulator: {
            active: true,
            isReady: false,
            services: ['functions', 'storage', 'auth', 'firestore', 'pubsub'],
            exportDir: 'emulator',
            exportPath: undefined,
        },
        console:{
            active: true,
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
    
    firesteadContext.functions.path = resolve(firesteadContext.rootPath, firesteadContext.functions.dir)
    firesteadContext.env.path = firesteadContext.rootPath

    //add firebase runtime path
    firesteadContext.firebase.runtimePath =  resolve(firesteadContext.contextPath, 'runtime')

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}