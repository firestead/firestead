import * as rollup from 'rollup'
import chalk from 'chalk'


export function watch(firesteadContext){
    const watcher = rollup.watch(firesteadContext.firebase.rollupConfig)
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
          console.log(`${chalk.bold.green('✔')} ${chalk.bold.yellow('Firestead:')}` + ' built', start ? `in ${Date.now() - start} ms` : '')
          return
  
        // Encountered an error while bundling
        case 'ERROR':
          consola.error('Firestead Rollup error: ' + event.error)
          // consola.error(event.error)
      }
    })
}

export function build(firesteadContext){
    
}