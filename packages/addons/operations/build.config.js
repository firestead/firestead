import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  emitCJS: false,
  entries: [
    'src/index',
    { input: 'src/pages/', outDir: 'dist/pages' },
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
  ]
})