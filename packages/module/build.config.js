import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    { input: 'src/index', outDir: 'dist' }, 
    { input: 'src/composables/', outDir: 'dist/composables', ext: 'js' },
    { input: 'src/nitro/', outDir: 'dist/nitro', ext: 'js' },
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: 'src/plugins/', outDir: 'dist/plugins', ext: 'js' },
    { input: 'src/middleware/', outDir: 'dist/middleware', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
    'vue',
    '@nuxt/kit-edge',
    'pathe',
    'fs-extra',
    'rollup',
    '@rollup/plugin-commonjs',
    '@rollup/plugin-node-resolve',
    '@rollup/plugin-replace',
    '@rollup/pluginutils',
    '@rollup/plugin-alias',
    '@vercel/nft',
    '@firestead/ui',
    '@firestead/kit',
    'hash-sum',
    'esbuild',
    '#app',
    '#build'
  ]
})