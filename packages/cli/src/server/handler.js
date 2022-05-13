/*
*   Register all the server handles
*/
const contextHandler = []

/*
*   environment subscription are handled here
*/
contextHandler.push({
    method: 'get',
    context: 'environments',
    hook: 'environments:updated',
    handler: (fsCtxOptions) => {
        return {
            current: fsCtxOptions.environments.current,
            envs: fsCtxOptions.environments.envs,
        }  
    }
})
/*
*   Post environment updates
*/
contextHandler.push({
    method: 'post',
    context: 'environments',
    handler: (fsCtx, payload) => {
        fsCtx.hooks.callHook('environments:update', payload)
    }
})

// add hosting target handler
contextHandler.push({
    method: 'get',
    context: 'hosting',
    hook: 'hosting:targets:updated',
    handler: (fsCtxOptions) => {
        return {
            current: fsCtxOptions.hosting.current,
            targets: fsCtxOptions.hosting.targets
        }  
    }
})

export default contextHandler