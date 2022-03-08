import { findExports } from 'mlly'
import chalk from 'chalk'
import fse from 'fs-extra'

export async function analyzeFunction(path){
    //TODO: eventually use magic srtring ro read file https://github.com/Rich-Harris/magic-string
    const analysis = {
        active: true,
        exports: {}
    }
    const handlerFile = await fse.readFile(path, 'utf8')
    const handlerExports = await findExports(handlerFile)
    if(handlerExports.length === 0){
        analysis.active = false
        analysis.exports = {
            config: false,
            default: false
        }
        console.log(`${chalk.bold.red(' ERROR ')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red(path + ': File has no default export and no config defined')}`)
    }else{
        const isConfigHandler = handlerExports.find(handler => handler.name === 'config')
        if(!isConfigHandler) {
            analysis.active = false
            console.log(`${chalk.bold.red(' ERROR ')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red(path + ': File has no config defined')}`)
        }
        analysis.exports['config'] = isConfigHandler ? true : false
        const isDefaultHandler = handlerExports.find(handler => handler.name === 'default')
        if(!isDefaultHandler) {
            analysis.active = false
            console.log(`${chalk.bold.red(' ERROR ')} ${chalk.bold.yellow('Firestead:')} ${chalk.bold.red(path + ': File has no default function defined')}`)
        }
        analysis.exports['default'] = isDefaultHandler ? true : false
    }
    return analysis
}