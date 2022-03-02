import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

export function addConsoleContext(firesteadContext){
    /*
        consoleContext:{
            active: true,
            contextPath: undefined,
            runtimeDir: undefined,
            rollupConfig: undefined,
            buildRuntimePath: undefined,
            buildAppPath: undefined,
            pages: [],
            extensions: ['.js','.vue'],
            routes: [],
            navigation: {
                order: [],
                menu: []
            }
        }
    */
    //add UI context
    firesteadContext.console.contextPath = dirname(fileURLToPath(import.meta.url))
    firesteadContext.console.buildRuntimePath = `${firesteadContext.buildPath}/console/runtime`
    firesteadContext.console.buildAppPath = `${firesteadContext.buildPath}/console/app`
    firesteadContext.console.runtimeDir = 'runtime'
    //firesteadContext.ui.rollupConfig = getRollupConfig(firesteadContext)
    return firesteadContext
}
