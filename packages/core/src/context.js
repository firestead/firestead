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
        buildOptions: {},
        rollupConfig: undefined,
        runtimePath: undefined,
        hooks: createHooks(),
        modulePath: dirname(resolveModule('firestead')),
        contextPath: dirname(fileURLToPath(import.meta.url)),
        logger : null,
        functionsVersion: 1,
        functionsDir: 'firebase',
        functionsPath: undefined,
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        functions: [],
        enviromentsRuntime: null,
        enviromentsFileName: 'firestead.env.json',
        enviroments: [],
        framework: null,
        emulatorServices: ['functions', 'storage', 'auth', 'firestore', 'pubsub'],
        emulatorExportDir: 'emulator',
        emulatorExportPath: undefined
    })

    firesteadContext.buildPath = resolve(firesteadContext.rootPath, firesteadContext.buildDir)
    firesteadContext.emulatorExportPath = resolve(firesteadContext.buildPath, firesteadContext.emulatorExportDir)
    firesteadContext.functionsPath = resolve(firesteadContext.rootPath, firesteadContext.functionsDir)
    //add firebase runtime path
    firesteadContext.runtimePath =  resolve(firesteadContext.contextPath, 'runtime')

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}