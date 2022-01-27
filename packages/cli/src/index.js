// Firestead CLI is based on (https://github.com/nuxt/framework/blob/main/packages/nuxi)
import mri from 'mri'
import consola from 'consola'
import chalk from 'chalk'
import { commands } from './commands/index.js'
import { showHelp } from './utils/help.js'

async function _main () {
  const _argv = process.argv.slice(2)
  const args = mri(_argv, {
    boolean: [
      'no-clear'
    ]
  })

  const command = args._.shift() || 'usage'

  if (!(command in commands)) {
    console.log('\n' + chalk.red('Invalid command ' + command))

    await commands.usage().then(r => r.invoke())
    process.exit(1)
  }

  try {
    const cmd = await commands[command]()
    if (args.h || args.help) {
      showHelp(cmd.meta)
    } else {
      await cmd.invoke(args)
    }
  } catch (err) {
    onFatalError(err)
  }
}

function onFatalError (err) {
  consola.error(err)
  process.exit(1)
}

//consola.wrapConsole()

process.on('unhandledRejection', err => consola.error('[unhandledRejection]', err))
process.on('uncaughtException', err => consola.error('[uncaughtException]', err))

export function main () {
    console.log(chalk.yellow('\n' + 'Welcome to the Firestead CLI') + '\n')
    _main().catch(onFatalError)
  }