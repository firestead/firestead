import * as rollup from 'rollup'
import fse from 'fs-extra'
import chalk from 'chalk'
import { traceFiles } from './tracer'

//TODO: add wait for first build
export function watchRollupEntry(rollupConfig){
    const watcher = rollup.watch(rollupConfig)
    let start = null
  
    watcher.on('event', (event) => {
      switch (event.code) {
        // The watcher is (re)starting
        case 'START':
          return
  
        // Building an individual bundle
        case 'BUNDLE_START':
          start = Date.now()
          return
  
        // Finished building all bundles
        case 'END':
          //nitroContext._internal.hooks.callHook('nitro:compiled', nitroContext)
          console.log('info',`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')}` + ' built', start ? `in ${Date.now() - start} ms` : '')
          return
  
        // Encountered an error while bundling
        case 'ERROR':
          consola.error('Firestead Rollup error: ' + event.error)
          // consola.error(event.error)
      }
    })
}

export async function buildRollup({ rootPath, buildConfig, rollupConfig }){
  // if build is skipped, just copy entry file and trace needed modules instead of building
  if(buildConfig.skip){
    await traceFiles([
      'node_modules/firebase-functions/lib/index.js'
    ],{
        outDir: `${buildConfig.path}/build/functions`,
        traceOptions: {
          base: '/',
          processCwd: rootPath,
          exportsOnly: true
      }
    })
    await fse.copy(`${buildConfig.path}/build/entry.js`, `${buildConfig.path}/build/functions/index.mjs`, { overwrite: true })
    return
  }
  // rollup build process
  const build = await rollup.rollup(rollupConfig).catch((error) => {
    consola.error('Rollup error: ' + error.message)
    throw error
  })
  console.log('Writing firebase bundle...')
  await build.write(rollupConfig.output)
  console.log('Built firestead successfully')
}