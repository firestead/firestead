import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index'
  ],
  devDependencies: [
  ],
  dependencies: [
  ],
  externals: [
    '@firestead/schema',
    '@firestead/admin'
  ]
})