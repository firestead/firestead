import { resolve } from 'pathe'
import commonjs from '@rollup/plugin-commonjs'
import { esbuild } from './plugins/esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import {externals} from './plugins/externals'

export async function getRollupConfig(firesteadContext){

    await firesteadContext.hooks.callHook('builder:rollup:config', firesteadContext)

    if(firesteadContext.options.buildConfig.skip) return null 

    const extensions = ['.ts', '.mjs', '.js', '.json', '.node']

    const entryPath = firesteadContext.options.dev ? `${firesteadContext.options.buildConfig.path}/firebase/entry.js` : `${firesteadContext.options.buildConfig.path}/build/entry.js`
    const outputPath = firesteadContext.options.dev ? `${firesteadContext.options.buildConfig.path}/firebase/functions/index.mjs` : `${firesteadContext.options.buildConfig.path}/build/functions/index.mjs`

    const rollupConfig = {
        input: entryPath,
        output: {
            file: outputPath,
            format: 'esm',
            exports: 'auto',
            intro: '',
            outro: '',
            preferConst: true
        },
        makeAbsoluteExternalsRelative: false,
        plugins: []
    }

    rollupConfig.plugins.push(esbuild({
        target: 'es2019',
        sourceMap: true
      }))

    const moduleDirectories = [
        resolve(firesteadContext.options.rootPath, 'node_modules'),
        'node_modules'
      ]
    // Externals
    const externalsPath = firesteadContext.options.dev ? `${firesteadContext.options.buildConfig.path}/firebase/functions` : `${firesteadContext.options.buildConfig.path}/build/functions`
    rollupConfig.plugins.push(externals({
        outDir: externalsPath,
        moduleDirectories,
        external: [
        ],
        inline: [
            firesteadContext.options.dev ? `${firesteadContext.options.buildConfig.path}/firebase` : `${firesteadContext.options.buildConfig.path}/build`,
            firesteadContext.options.functions.path
        ],
        trace: (!firesteadContext.options.dev)? true: false,
        traceOptions: {
            base: '/',
            processCwd: firesteadContext.options.rootPath,
            exportsOnly: true
        }
    }))
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    rollupConfig.plugins.push(nodeResolve({
        extensions,
        preferBuiltins: true,
        rootDir: firesteadContext.options.rootPath,
        moduleDirectories,
        // 'module' is intentionally not supported because of externals
        mainFields: ['main'],
        exportConditions: [
        'default',
        'module',
        'node',
        'import'
        ]
    }))
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    rollupConfig.plugins.push(commonjs({
        requireReturnsDefault: 'auto'
    }))
    return rollupConfig
}

