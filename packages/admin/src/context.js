import { dirname } from 'pathe'
import { fileURLToPath } from 'url'

export function addAdminContext(firesteadContext){
    //add UI context
    firesteadContext.options.admin = {
        contextPath: dirname(fileURLToPath(import.meta.url)),
        rollupConfig: undefined,
        buildConfig:{
            runtimePath: `${firesteadContext.options.buildConfig.path}/admin`,
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
