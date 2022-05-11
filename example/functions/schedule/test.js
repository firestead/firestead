import chalk from 'chalk'

export const config = {
    schedule: 'every 24 hours'
}

export default (context) => {
    console.error(`${chalk.bold.red('!')} This will be run every 5 minutes!`)
    return null
}