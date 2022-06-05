import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index',
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
    '@firestead/cli',
    'firebase-functions'
  ],
  externals: [
    'untyped',
    '@firestead/nuxt'
  ]
})