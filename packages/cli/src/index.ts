// Firestead CLI is based on (https://github.com/nuxt/framework/blob/main/packages/nuxi)
import mri from 'mri'
import consola from 'consola'
import chalk from 'chalk'
import { commands, FiresteadCommand } from './commands/index'
import { showHelp } from './utils/help.js'

async function _main () {
  const _argv = process.argv.slice(2)
  const args = mri(_argv, {
    boolean: [
      'no-clear'
    ]
  })
  // @ts-ignore
  const command = args._.shift() || 'usage'

  if (!(command in commands)) {
    console.log('\n' + chalk.red('Invalid command ' + command))

    await commands.usage().then(r => r.invoke())
    process.exit(1)
  }
  // @ts-ignore
  const cmd = await commands[command as FiresteadCommand]() as FiresteadCommand
  if (args.h || args.help) {
    showHelp(cmd.meta)
  } else {
    const result = await cmd.invoke(args)
    return result
  }
}

//consola.wrapConsole()

process.on('unhandledRejection', err => consola.error('[unhandledRejection]', err))
process.on('uncaughtException', err => consola.error('[uncaughtException]', err))

export function main () {
  _main()
    .then((result) => {
      if (result === 'error') {
        process.exit(1)
      } else if (result !== 'wait') {
        process.exit(0)
      }
    })
    .catch((error) => {
      consola.error(error)
      process.exit(1)
    })
}