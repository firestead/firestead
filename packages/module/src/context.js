import { resolveModule } from '@nuxt/kit-edge'
import { firesteadCtx } from '@firestead/kit'
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { getFirebaseRollupConfig, getUIRollupConfig } from './build/rollup/config'

function getFullPath(dir){
    return resolve(dirname(fileURLToPath(import.meta.url)),dir)
}

export function createFiresteadContext({options, hooks, hook}){
    const firesteadContext = {
        hooks: hooks,
        hook: hook,
        buildDir: options?.firestead?.buildDir || '_firestead',
        buildPath: undefined,
        moduleDir: dirname(resolveModule('firestead')),
        contextDir: dirname(fileURLToPath(import.meta.url)),
        extensions: ['.js','.vue'],
        functionsDir: options?.firestead?.functionsDir || 'server/firebase',
        functionsWatchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
        watchFiles: [],
        firebase: {
            config: options?.firestead?.config || {},
            rollupConfig: undefined,
            runtimeDir: getFullPath('runtime/functions')
        },
        ui:{
            runtimeDir: getFullPath('runtime/ui'),
            rollupConfig: undefined,
            buildRuntimeDir: undefined,
            pagesDir: undefined,
            routes: [],
            navbar: [],
            sidebar: []
        },
        _nuxt: {
            dev: options.dev,
            rootDir: options.rootDir,
            srcDir: options.srcDir,
        }
    }
    firesteadContext.buildPath = resolve(firesteadContext._nuxt.rootDir, firesteadContext.buildDir)

    //add UI context
    firesteadContext.ui.rollupConfig = getUIRollupConfig(firesteadContext)
    firesteadContext.ui.pagesDir = resolve(firesteadContext.moduleDir, 'ui/pages')
    firesteadContext.ui.buildRuntimeDir = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/ui/runtime`

    //add firebase context
    firesteadContext.firebase.rollupConfig = getFirebaseRollupConfig(firesteadContext)

    //create global firestead context
    firesteadCtx.set(firesteadContext)

    return firesteadContext
}