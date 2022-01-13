import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  emitCJS: false,
  entries: [
    'src/index'
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
  ]
})