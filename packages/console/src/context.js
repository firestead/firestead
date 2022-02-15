import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { getRollupConfig } from './build/rollup/config'
import { useFiresteadContext } from '@firestead/kit'

export function getFiresteadContext(){
    //get firestead context
    const firesteadContext = useFiresteadContext()
    //add UI context
    firesteadContext.ui.contextPath = dirname(fileURLToPath(import.meta.url))
    firesteadContext.ui.buildRuntimePath = `${firesteadContext.buildPath}/ui/runtime`
    firesteadContext.ui.buildAppPath = `${firesteadContext.buildPath}/ui/app`
    firesteadContext.ui.runtimeDir = 'runtime'
    firesteadContext.ui.rollupConfig = getRollupConfig(firesteadContext)
    return firesteadContext
}
