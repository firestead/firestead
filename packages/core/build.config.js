import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  emitCJS: false,
  rollup: {
    inlineDependencies: true,
    cjsBridge: true
  },
  entries: [
    'src/index',
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
    '@firestead/nuxt'
  ]
})