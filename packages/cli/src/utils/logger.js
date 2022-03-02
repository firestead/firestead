import util from 'util'
import consola from 'consola'
import cliProgress from 'cli-progress'
import chalk from 'chalk'
import { Table } from 'console-table-printer'

const startup = {
    warnings : [],
    infos: [],
    progressBar: null,
    debug: false,
    loggingEnabled: false
}

function storeOutputOnStartup(output){
    const startupWarningsFilter = [
        '⚠ '
    ]
    const startupInfoFilter = [
        'i  emulators',
        'i  firestore',
        'i  auth',
        'i  pubsub',
        'i  ui',
        'i  functions',
        '✔  functions'
    ]
    if (startupWarningsFilter.some(v => output.includes(v))) {
        startup.warnings.push(output)
    }
    if (startupInfoFilter.some(v => output.includes(v))) {
        startup.infos.push(output)
    }
}

export function logOutput(output, force = false){
    let newLine = true
    if(typeof output === 'object')  {
        output = util.format.apply(output)
        newLine = false
    }
    if(startup.loggingEnabled || force) process.stdout.write(`${output + (newLine ? '\n' : '')}`)
    else storeOutputOnStartup(output)
}

export function progressBar(count){
    if(startup.debug){
        startup.progressBar = {
            increment: () => {},
            stop: () => {}
        }
    }else{
        //init progress bar
        startup.progressBar = new cliProgress.SingleBar({
            format: 'Progress |' + chalk.yellow('{bar}') + '| {percentage}% || {msg}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.shades_classic)
        startup.progressBar.start(count, 0, {
            msg: "Starting"
        })
    }
    return startup.progressBar
}

export function printServiceTable(){
    const serviceTable = new Table({
        columns: [
          { name: "Service", alignment: "left" },
          { name: "URL", alignment: "left" }
        ],
    })
    serviceTable.addRow({ Service: 'Firebase Emulator', URL: 'http://localhost:4000'})
    serviceTable.addRow({ Service: '', URL: ''})
    serviceTable.addRow({ Service: 'Framework App', URL: 'http://localhost:3000' })
    serviceTable.addRow({ Service: '', URL: ''})
    serviceTable.addRow({ Service: 'Firestead Console', URL: 'http://localhost:1337' })
    const tableStr = serviceTable.render()
    setTimeout(()=>{
        logOutput(`\n${tableStr}\n`)
    },500)
}

export function registerLogger(firesteadContext, firebaseClient = null, debug = false)
{
    startup.debug = debug
    // add firebase emulator logger to firestead context or register simple console logger
    if(firebaseClient){
        firesteadContext.logger = firebaseClient.logger.logger
    }else{
        firesteadContext.logger = {
            log: (output) => {
                console.log(util.format.apply(output))
            },
        }
        return
    }
    // register logger for firebase emulator
    firesteadContext.logger.on("data",(log)=>{
        if(['info', 'warn', 'data', 'http'].indexOf(log.level) !== -1){
            const logArgs = log[Symbol.for('splat')]
            if (logArgs) {
                if(typeof logArgs[0] === 'string') log.message = util.format(log.message, logArgs[0])
                else if(typeof logArgs[0] === 'object') log.message = logArgs[0].user
            }
            logOutput(log.message)
        }
    })
    //allow clean startup
    if(firesteadContext.dev && !debug){
        //Nuxt3 related: set console log to ooutput only errors/warnings to have a clean startup
        consola.level = 1
        // wrap other console logs
        var methods = ["log", "debug", "warn", "info",'success','error','trace','start','ready','verbose']
        for(var i=0;i<methods.length;i++){
            console[methods[i]] = function(args){
                logOutput(args)
            }
        }
        firesteadContext.hooks.hook('emulator:ready', ()=>{
            //???
        })
        //since we await emulator first, framework is always last  
        firesteadContext.hooks.hook('framework:ready', (server)=>{
            startup.progressBar.stop()
            startup.loggingEnabled = true
            //Nuxt3 related: set log level to info after startup
            consola.level = 3
            if(startup.warnings.length > 0){
                logOutput(`\n${chalk.yellow('i Firestead')} is ready: \n`)
                startup.warnings.forEach(v => logOutput(v))
                startup.warnings = []
            }
            // print service table
            printServiceTable()
        })
    }else{
        //allow print
        startup.loggingEnabled = true
    }
}