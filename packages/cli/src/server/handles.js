/*
*   Register all the server handles
*/
const contextHandles = []

/*
*   environment subscription are handled here
*/
contextHandles.push({
    method: 'get',
    context: 'environments',
    handle: (fsCtxOptions) => {
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
contextHandles.push({
    method: 'post',
    context: 'environments',
    handle: (fsCtx, payload) => {
        fsCtx.hooks.callHook('environments:update', payload)
    }
})
// add framework handle 
contextHandles.push({
    method: 'get',
    context: 'framework',
    handle: (fsCtxOptions) => {
        return {
            ...fsCtxOptions.framework
        }  
    },
    hook: 'framework:updated'
})

export default contextHandles