import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  entries: [
    'src/index'
  ],
  devDependencies: [
  ],
  dependencies: [
  ],
  externals: [
    '@firestead/nuxt',
    '@firestead/admin'
  ]
})