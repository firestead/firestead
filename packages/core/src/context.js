import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { firesteadCtx, resolveModule } from '@firestead/kit'
import { createHooks } from 'hookable'
import defu from 'defu'

export function createFiresteadContext(ctxOptions = { rootPath: process.cwd() }){

    const modulePath = dirname(resolveModule('firestead'))
    const contextPath = dirname(fileURLToPath(import.meta.url))

    const ctx = {
        hooks: createHooks(),
        console: false,
        options: defu(ctxOptions,{
            dev: true,
            rootPath: undefined,
            buildConfig: {
                dir: '_firestead',
                path: undefined,
                skip: false
            },
            rollupConfig: undefined,
            functions: {
                version: 1,
                dir: 'firebase',
                path: undefined,
                runtimePath: resolve(contextPath, 'runtime'),
                watchDirs: ['functions', 'http', 'schedule', 'firestore', 'database', 'remoteConfig', 'storage', 'auth', 'analytics', 'pubsub', 'testLab'],
                handler: []
            },
            modulePath: modulePath,
            contextPath: contextPath,
            environments: {
                current: null,
                fileName: 'firestead.env.json',
                envs: {
                    dev:{
                        name: 'Development',
                        config: {
                            projectId: 'demo-default'
                        },
                        envVariables: {}
                    },
                    prod:{
                        name: 'Production',
                        config: {},
                        envVariables: {}
                    }
                }
            },
            framework: {
                name: null,
                version: null
            },
            emulator: {
                services: ['functions', 'storage', 'auth', 'firestore', 'pubsub'],
                exportDir: 'emulator',
                exportPath: undefined,
            }
        })
    }

    //resolve paths that are relative to context, root or build
    ctx.options.buildConfig.path = resolve(ctx.options.rootPath, ctx.options.buildConfig.dir)
    ctx.options.emulator.exportPath = resolve(ctx.options.buildConfig.path, ctx.options.emulator.exportDir)
    ctx.options.functions.path = resolve(ctx.options.rootPath, ctx.options.functions.dir)

    //create global firestead context
    firesteadCtx.set(ctx)

    return ctx
}