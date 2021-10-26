import chalk from 'chalk'
import { spawn } from 'child_process'


let interval = 4800
let times = 20
let isLaunching = true
let launchingDataCounter = 0
let launchingWatchCounter = null

export async function runEmulator(nuxt){
    //get config - project name
    const nuxtOptions = nuxt.options
    let firebaseProject = nuxtOptions.firestead?.config?.projectId || 'default'
    //on nuxt start -> maybe better with hook listen if supported
    const rootFBDir = `${process.env.INIT_CWD}/_firestead`
    process.chdir(rootFBDir)
    const emulator = spawn('firebase', ['--project',firebaseProject,'emulators:start'])
    //go back to project folder
    process.chdir(`${process.env.INIT_CWD}`)
    emulator.stdout.on('message',(data)=>{
        const lines = data.toString().split("\n")
        for (let i=0; i<lines.length - 1; i++) {
            console.log(lines[i])
       }
    })
    emulator.stdout.on('data', (data) => {
        launchingDataCounter++
        const lines = data.toString().split("\n")
        for (let i=0; i<lines.length -1; i++) {
            console.log(lines[i])
        }
    })
    emulator.stderr.on('message', (data) => {
        const lines = data.toString().split("\n")
        for (let i=0; i<lines.length -1; i++) {
            console.log(lines[i])
        }
    })
    emulator.stderr.on('data', (data) => {
        const lines = data.toString().split("\n")
        for (let i=0; i<lines.length -1; i++) {
            console.log(lines[i])
        }
    })
    emulator.on('close', (code) => {
        if(isLaunching){
            throw new Error(`${chalk.bold.yellow('Firestead')} Firebase Emulator exited with code ${code}`)
        }
    })

    await wait()
    //handling clean shutdown of Firebase emulator
    registerCleanup()
    return true
}

async function wait(){
    return new Promise(async (resolve) => {
        for (var index = 0; index < times; index++) {
            if(launchingDataCounter===launchingWatchCounter){
                break
            }
            launchingWatchCounter=launchingDataCounter
            await sleep(interval)
        }
        resolve()
    })
}

async function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
}


function reset(){
    isLaunching = false
    launchingDataCounter = 0
    launchingWatchCounter = null
}

function registerCleanup(){

    // catch ctrl+c event and exit normally
    process.on('SIGINT', async () => {
        reset()
        console.log(`${chalk.bold.yellow('Firestead')}: Closing Firebase Emulator`)
        await wait()
        process.exit(2)
    })
}