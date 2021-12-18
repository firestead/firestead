import * as rollup from 'rollup'
import chalk from 'chalk'

export function watch(firesteadContext){
    let start = null
    const watcher = rollup.watch(firesteadContext.ui.rollupConfig)
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
          console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')}` + ' built UI', start ? `in ${Date.now() - start} ms` : '')
          return
  
        // Encountered an error while bundling
        case 'ERROR':
          consola.error('Firestead Rollup error: ' + event.error)
          // consola.error(event.error)
      }
    })
}

export async function build(firesteadContext){
    const builder = await rollup.rollup(firesteadContext.ui.rollupConfig).catch((error) => {
        consola.error('Rollup error: ' + error.message)
        throw error
      })
    await builder.write(firesteadContext.ui.rollupConfig.output)
}
