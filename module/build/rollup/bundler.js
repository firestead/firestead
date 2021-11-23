import * as rollup from 'rollup'
import chalk from 'chalk'

export function rollupUI(firesteadContext){
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

export async function buildUI(firesteadContext){
    const build = await rollup.rollup(firesteadContext.ui.rollupConfig).catch((error) => {
        consola.error('Rollup error: ' + error.message)
        throw error
      })
    await build.write(firesteadContext.ui.rollupConfig.output)
}


export function rollupFirebase(firesteadContext){
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

export function buildFirebase(firesteadContext){
    
}