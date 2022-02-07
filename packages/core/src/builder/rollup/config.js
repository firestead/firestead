import { resolve } from 'pathe'
import commonjs from '@rollup/plugin-commonjs'
import { esbuild } from './plugins/esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import {externals} from './plugins/externals'

export async function getRollupConfig(firesteadContext){

    await firesteadContext.hooks.callHook('builder:rollup:config', firesteadContext)

    const extensions = ['.ts', '.mjs', '.js', '.json', '.node']

    const entryPath = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/entry.js` : `${firesteadContext.buildPath}/build/entry.js`
    const outputPath = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/functions/index.mjs` : `${firesteadContext.buildPath}/build/functions/index.mjs`

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
        resolve(firesteadContext.rootPath, 'node_modules'),
        'node_modules'
      ]
    // Externals
    const externalsPath = firesteadContext.dev ? `${firesteadContext.buildPath}/firebase/functions` : `${firesteadContext.buildPath}/build/functions`
    rollupConfig.plugins.push(externals({
        outDir: externalsPath,
        moduleDirectories,
        external: [
        ],
        inline: [
            firesteadContext.dev ? `${firesteadContext.buildPath}/firebase` : `${firesteadContext.buildPath}/build`,
            firesteadContext.functionsPath
        ],
        trace: (!firesteadContext.dev)? true: false,
        traceOptions: {
            base: '/',
            processCwd: firesteadContext.rootPath,
            exportsOnly: true
        }
    }))
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    rollupConfig.plugins.push(nodeResolve({
        extensions,
        preferBuiltins: true,
        rootDir: firesteadContext.rootPath,
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

