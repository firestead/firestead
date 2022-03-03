import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: false,
  emitCJS: false,
  entries: [
    { input: 'src/index', outDir: 'dist' },
    { input: 'src/app/', outDir: 'dist/app', ext: 'js' },
    { input: 'src/runtime/', outDir: 'dist/runtime', ext: 'js' },
  ],
  devDependencies: [

  ],
  dependencies: [
  ],
  externals: [
  ]
})