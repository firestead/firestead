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
    handler: (fsCtxOptions) => {
        return {
            current: fsCtxOptions.environments.current,
            envs: fsCtxOptions.environments.envs,
        }  
    },
    hook: 'environments:updated'
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
// add framework handle 
contextHandler.push({
    method: 'get',
    context: 'framework',
    handler: (fsCtxOptions) => {
        return {
            ...fsCtxOptions.framework
        }  
    },
    hook: 'framework:updated'
})

export default contextHandler