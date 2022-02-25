import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  entries: [
    'src/index',
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'js' }
  ],
  devDependencies: [],
  dependencies: [
    '@firestead/cli',
    'firebase-functions',
    'vite',
    'vite-plugin-windicss',
    'vue',
    'vue-router',
    'windicss'
  ],
  externals: [
  ]
})