export function getDocument(config){
    return config?.document ? config.document : ''
}

export function createConfigVars(config){
    const defaultRegion = 'us-central1'
    const defaultRunWith = {}
    return {
        region: 'us-central1',
        runWith: {}
    }
}