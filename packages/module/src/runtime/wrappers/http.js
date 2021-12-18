import chalk from 'chalk'

export default (runFunction) => {

    const httpRuntime = async (req, res) => {
        try {
            await runFunction(req, res)
        } catch (error) {
            console.log(`${chalk.bold.red('!')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red('Http function: catched runtime error')}`)
            console.error(error)
            res.status(500).send('Internal server error')
        }
    }
    return httpRuntime
}