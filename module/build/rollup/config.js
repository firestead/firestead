import { resolve } from 'pathe'
import commonjs from '@rollup/plugin-commonjs'
import { esbuild } from './plugins/esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import {externals} from './plugins/externals'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import svgToVue from './plugins/svgToVue'

export function getFirebaseRollupConfig(firesteadContext, type){
    const firesteadDirPath = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}`
    const extensions = ['.ts', '.mjs', '.js', '.json', '.node']

    const rollupConfig = {
        input: `${firesteadDirPath}/firebase/entry.js`,
        output: {
            file: `${firesteadDirPath}/firebase/functions/index.mjs`,
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
        resolve(firesteadContext._nuxt.rootDir, 'node_modules'),
        'node_modules'
      ]
    // Externals
    rollupConfig.plugins.push(externals({
        outDir: `${firesteadDirPath}/firebase/functions`,
        moduleDirectories,
        external: [
        ],
        inline: [
            `${firesteadDirPath}/firebase`,
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


export function getUIRollupConfig(firesteadContext){
    const firesteadDirPath = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}`
    const production = false
  
    const rollupConfig = {
        input: `${firesteadDirPath}/ui/runtime/index.js`,
        output: {
            dir: `${firesteadDirPath}/ui/app`,
            format: 'iife',
            sourcemap: !production ? 'inline' : false,
            name: 'app'
        },
        makeAbsoluteExternalsRelative: false,
        plugins: []
    }
  
    rollupConfig.plugins.push(alias({
      entries: {
        '#ui': resolve(firesteadContext.moduleDir, 'ui'),
      }
    }))
  
    rollupConfig.plugins.push(replace({
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
      preventAssignment: true,
    }))
  
    rollupConfig.plugins.push(svgToVue())
  
    rollupConfig.plugins.push(vue({
      preprocessStyles: true,
      needMap: false
    }))
  
    rollupConfig.plugins.push(postcss())
  
    rollupConfig.plugins.push(nodeResolve({
      jsnext: true,
      main: true,
      browser: true,
      moduleDirectories: [
        resolve(firesteadContext._nuxt.rootDir, 'node_modules'),
        'node_modules'
      ]
    }))
  
    rollupConfig.plugins.push(commonjs({
      requireReturnsDefault: 'auto'
    }))
  
    rollupConfig.plugins.push(esbuild({
      target: 'es2019',
      sourceMap: !production ? true : false,
    }))
  
    return rollupConfig
  }