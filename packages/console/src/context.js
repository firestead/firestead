import { dirname } from 'pathe'
import { fileURLToPath } from 'url'

export function addConsoleContext(firesteadContext){
    //add UI context
    firesteadContext.console = {
        contextPath: dirname(fileURLToPath(import.meta.url)),
        rollupConfig: undefined,
        buildConfig:{
            runtimePath: `${firesteadContext.options.buildConfig.path}/console`,
            runtimeDir: 'runtime'
        },
        pages: [],
        extensions: ['.js','.vue'],
        routes: [],
        navigation: {
            navbar: {
                order: [],
                items: []
            }
        }
    }
}
