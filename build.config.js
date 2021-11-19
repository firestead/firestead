import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'module',
    { input: 'module/composables/', outDir: 'dist/composables' },
    { input: 'module/nitro/', outDir: 'dist/nitro' },
    { input: 'module/ui/', outDir: 'dist/ui' },
    { input: 'module/build/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: 'module/plugins/', outDir: 'dist/plugins' },
    { input: 'module/middleware/', outDir: 'dist/middleware' }
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
    'hash-sum',
    'esbuild',
    '#app',
    '#build'
  ]
})