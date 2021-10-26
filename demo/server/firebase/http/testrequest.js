import chalk from 'chalk'

export const config = {}
export default (req, res) => {
    console.error(`${chalk.bold.red('!')} This will be run every 5 minutes!`)
    res.status(200).send({
        test: 'test function 2'
    })
}