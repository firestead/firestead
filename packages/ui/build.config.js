import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    { input: 'src/index', outDir: 'dist' },
    { input: 'src/app/', outDir: 'dist/app', ext: 'js' },
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
    'vue', 
    '@vue/compiler-sfc',
    'ufo',
    'url',
    '@firestead/kit',
    'fs-extra',
    'pathe',
    'chalk',
    'rollup',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-replace',
    '@rollup/pluginutils',
    '@rollup/plugin-alias',
    'rollup-plugin-postcss',
    'rollup-plugin-svg-import',
  ]
})