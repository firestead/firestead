import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

export function addConsoleContext(firesteadContext){
    //add UI context
    firesteadContext.options.console = {
        contextPath: dirname(fileURLToPath(import.meta.url)),
        rollupConfig: undefined,
        buildConfig:{
            appPath: `${firesteadContext.options.buildConfig.path}/console/app`,
            runtimePath: `${firesteadContext.options.buildConfig.path}/console/runtime`,
            runtimeDir: 'runtime'
        },
        pages: [],
        extensions: ['.js','.vue'],
        routes: [],
        navigation: {
            order: [],
            menu: []
        }
    }
}
