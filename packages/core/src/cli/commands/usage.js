import chalk from 'chalk'
import { showHelp } from '../utils/help.js'
import { commands, defineFiresteadCommand } from './index'

export default defineFiresteadCommand({
  meta: {
    name: 'help',
    usage: 'npx firestead --help',
    description: 'Show help'
  },
  invoke (_args) {
    const sections = []

    sections.push(`Usage: ${chalk.cyan(`npx firestead ${Object.keys(commands).join('|')} [args]`)}`)

    console.log(sections.join('\n\n') + '\n')

    // Reuse the same wording as in `-h` commands
    showHelp({})
  }
})