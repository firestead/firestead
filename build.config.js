import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'module',
    { input: 'module/nitro/', outDir: 'dist/nitro' },
    { input: 'module/build/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: 'module/plugins/', outDir: 'dist/plugins' },
    { input: 'module/composables/', outDir: 'dist/composables' },
    { input: 'module/ui/', outDir: 'dist/ui' },
    { input: 'module/middleware/', outDir: 'dist/middleware' }
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
    '@rollup/pluginutils',
    '@vercel/nft',
    'esbuild',
    '#app',
    '#build'
  ]
})