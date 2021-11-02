import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    'module',
    { input: 'module/nitro/', outDir: 'dist/nitro', ext: 'js' },
    { input: 'module/build/runtime/', outDir: 'dist/runtime', ext: 'js' },
    { input: 'module/plugins/', outDir: 'dist/plugins', ext: 'js' },
    { input: 'module/composables/', outDir: 'dist/composables', ext: 'js' }
  ],
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