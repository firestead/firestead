function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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