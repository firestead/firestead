import { relative, dirname, resolve } from 'pathe'
import virtual from '@rollup/plugin-virtual'
import commonjs from '@rollup/plugin-commonjs'
import { esbuild } from './plugins/esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import {externals} from './plugins/externals'

export function getRollupConfig(firesteadContext, type){
    const extensions = ['.ts', '.mjs', '.js', '.json', '.node']

    const rollupConfig = {
        input: `${firesteadContext._nuxt.srcDir}/${firesteadContext.buildDir}/entry.js`,
        output: {
            file: `${firesteadContext._nuxt.srcDir}/${firesteadContext.buildDir}/functions/index.mjs`,
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
    // Polyfill
    /*console.log(firesteadContext.watchFiles.map(p => `import {default as ${p.name}_import, config as ${p.name}_config} from "${p.path}";`).join('\n'))
    rollupConfig.plugins.push(virtual({
        '#polyfill': firesteadContext.watchFiles.map(p => `import {default as ${p.name}_import, config as ${p.name}_config} from "${p.path}";`).join('\n')
    }))*/
    const moduleDirectories = [
        resolve(firesteadContext._nuxt.rootDir, 'node_modules'),
        'node_modules'
      ]
    // Externals
    rollupConfig.plugins.push(externals({
        outDir: `${firesteadContext._nuxt.srcDir}/${firesteadContext.buildDir}/functions`,
        moduleDirectories,
        external: [
        ],
        inline: [
            `${firesteadContext._nuxt.srcDir}/${firesteadContext.buildDir}`,
            `${firesteadContext._nuxt.srcDir}/${firesteadContext.functionsDir}`
        ],
        trace: (type==='build')? true: false,
        traceOptions: {
            base: '/',
            processCwd: firesteadContext._nuxt.rootDir,
            exportsOnly: true
        }
    }))
      // https://github.com/rollup/plugins/tree/master/packages/node-resolve
    rollupConfig.plugins.push(nodeResolve({
        extensions,
        preferBuiltins: true,
        rootDir: firesteadContext._nuxt.rootDir,
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