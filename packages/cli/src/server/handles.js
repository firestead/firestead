/*
*   Register all the server handles
*/
export const contextHandles = [{
    method: 'get',
    context: 'environments',
    handle: (fsCtxOptions) => {
        return {
            current: fsCtxOptions.environments.current,
            envs: fsCtxOptions.environments.envs,
        }  
    },
    hook: 'environments:updated'
},{
    method: 'post',
    context: 'environments',
    handle: (fsCtx, payload) => {
        fsCtx.hooks.callHook('environments:update', payload)
    }
}]