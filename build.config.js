import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'module',
    { input: 'module/composables/', outDir: 'dist/composables', ext: 'js' },
    { input: 'module/nitro/', outDir: 'dist/nitro', ext: 'js' },
    { input: 'module/ui/', outDir: 'dist/ui' },
    { input: 'module/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: 'module/plugins/', outDir: 'dist/plugins', ext: 'js' },
    { input: 'module/middleware/', outDir: 'dist/middleware', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
    'vue', 
    '@vue/compiler-sfc',
    '@nuxt/kit-edge',
    'pathe',
    'fs-extra',
    'rollup',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-replace',
    '@rollup/pluginutils',
    'rollup-plugin-postcss',
    'rollup-plugin-svg-import',
    '@rollup/plugin-alias',
    '@vercel/nft',
    'ufo',
    'hash-sum',
    'unctx',
    'esbuild',
    '#app',
    '#build'
  ]
})