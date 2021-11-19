// add https://github.com/antfu/unplugin-auto-import
// add https://github.com/antfu/unplugin-vue-components
import { resolve } from 'pathe'
import commonjs from '@rollup/plugin-commonjs'
import vue from 'rollup-plugin-vue'
import { esbuild } from './plugins/esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import replace from '@rollup/plugin-replace'
import svgToVue from './plugins/svgToVue'

export function getUiRollupConfig(firesteadContext){
  
  const production = false

  const rollupConfig = {
      input: `${firesteadContext.ui.appDir}/index.js`,
      output: {
          dir: firesteadContext.ui.runtimeDir,
          format: 'iife',
          sourcemap: !production ? 'inline' : false,
          name: 'app'
      },
      makeAbsoluteExternalsRelative: false,
      plugins: []
  }

  rollupConfig.plugins.push(replace({
    'process.env.NODE_ENV': production ? '"production"' : '"development"',
    preventAssignment: true,
  }))

  rollupConfig.plugins.push(svgToVue())

  rollupConfig.plugins.push(vue({
    preprocessStyles: true,
    needMap: false,
    template: {
      compilerOptions: {
        isCustomElement: (tag) => tag.includes('-'),
      },
    },
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
    sourceMap: true
  }))

  return rollupConfig
}