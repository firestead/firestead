import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'
import { getRollupConfig } from './build/rollup/config'
import { useFiresteadContext } from '@firestead/kit'

export function getFiresteadContext(){
    //get firestead context
    const firesteadContext = useFiresteadContext()
    //add UI context
    firesteadContext.ui.contextPath = dirname(fileURLToPath(import.meta.url))
    firesteadContext.ui.pagesDir = resolve(firesteadContext.ui.contextPath, 'app/pages')
    firesteadContext.ui.buildRuntimePath = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/ui/runtime`
    firesteadContext.ui.buildAppPath = `${firesteadContext._nuxt.rootDir}/${firesteadContext.buildDir}/ui/app`
    firesteadContext.ui.runtimeDir = 'runtime'
    firesteadContext.ui.rollupConfig = getRollupConfig(firesteadContext)
    return firesteadContext
}
