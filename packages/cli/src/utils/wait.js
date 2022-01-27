export async function waitUntilEmulatorReady({logger}){
    return new Promise(async (resolve) => {
        logger.on("data",(log)=>{
            if(log.level==='info'){
                if(log.message.includes('All emulators ready!')){
                    resolve()
                }
            }
        })
    })
}