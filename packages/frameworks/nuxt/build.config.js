import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  emitCJS: false,
  entries: [
    'src/index',
    { input: 'src/module/', outDir: 'dist/module', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [

  ]
})