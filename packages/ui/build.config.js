import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  entries: [
    { input: 'src/', outDir: 'dist' }
  ],
  devDependencies: [],
  dependencies: [
  ],
  externals: [
    'vue', 
    '@vue/compiler-sfc'
  ]
})