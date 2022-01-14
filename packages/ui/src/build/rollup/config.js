import { resolve } from 'pathe'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import svgToVue from './plugins/svgToVue'

export function getRollupConfig(firesteadContext){
    const production = !firesteadContext._nuxt.dev
  
    const rollupConfig = {
        input: `${firesteadContext.ui.buildRuntimePath}/index.js`,
        output: {
            dir: firesteadContext.ui.buildAppPath,
            format: 'iife',
            sourcemap: !production ? 'inline' : false,
            name: 'app'
        },
        makeAbsoluteExternalsRelative: false,
        plugins: []
    }
  
    rollupConfig.plugins.push(alias({
      entries: {
        '#ui': resolve(firesteadContext.ui.contextPath, 'app'),
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
  
    return rollupConfig
}