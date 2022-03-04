import util from 'util'

function updateProgressbar(output, progress){
    const progressUpdateList = [{
            filter: 'Starting emulators:',
            msg: 'Starting Firebase Emulator',
        },
        {
            filter: 'Importing data from',
            msg: 'Importing data for Firestore',
        },
        {
            filter: 'Firestore Emulator logging to',
            msg: 'Configure logger for Firestore',
        },
        {
            filter: 'Importing accounts from',
            msg: 'Importing data for Firebase Auth',
        },
        {
            filter: 'Emulator UI logging to',
            msg: 'Configure logger for Emulator UI',
        },
        {
            filter: 'Watching',
            msg: 'Configure Firebase watcher',
        },
        {
            filter: 'All emulators ready',
            msg: 'Firebase Emulator ready',
        }
    ]
    const progressItem = progressUpdateList.filter((v) => output.includes(v.filter))
    if (progressItem.length>0) {
        progress.increment({
            msg: progressItem[0].msg
        })
    }
}

export async function waitUntilEmulatorReady(firebaseClient, hooks, progress){
    return new Promise(async (resolve) => {
        let silent = false
        firebaseClient.logger.logger.on("data",(log)=>{
            if((log.level==='info') && !silent){
                const logArgs = log[Symbol.for('splat')]
                if (logArgs) {
                    if(typeof logArgs[0] === 'string') log.message = util.format(log.message, logArgs[0])
                    else if(typeof logArgs[0] === 'object') log.message = logArgs[0].user
                }
                updateProgressbar(log.message, progress)
                if(log.message.includes('All emulators ready!')){
                    hooks.callHook('emulator:ready')
                    silent = true
                    resolve()
                }
            }
        })
    })
}