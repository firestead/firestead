import fse from 'fs-extra'
import { useFiresteadContext } from '../context'

export function addPagesPath(pagesPath, routePrefix = false, firesteadContext = null){
    if(!firesteadContext){
        firesteadContext = useFiresteadContext()
    }
    if(typeof pagesPath !== 'string'){
        throw new Error('pagesPath must be a string')
    }
    if(!fse.existsSync(pagesPath)){
        throw new Error(`pagesPath ${pagesPath} does not exist`)
    }
    firesteadContext.console.pages.push({
        path: pagesPath,
        prefix: routePrefix
    })
}