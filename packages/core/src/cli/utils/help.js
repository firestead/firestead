import chalk from 'chalk'

export function showHelp (meta) {
  const sections = []

  if (meta.usage) {
    sections.push(chalk.magenta('> ') + 'Usage: ' + chalk.cyan(meta.usage))
  }

  if (meta.description) {
    sections.push(chalk.magenta('⋮ ') + meta.description)
  }

  sections.push(`Use ${chalk.cyan('npx firestead [command] --help')} to see help for each command`)

  console.log(sections.join('\n\n') + '\n')
}