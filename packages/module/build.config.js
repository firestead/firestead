import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
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
  ]
})