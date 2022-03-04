// Inspired by nuxt3 kit https://github.com/nuxt/framework/tree/main/packages/kit (MIT)
import { addPagesPath } from '../console/pages'
import { addNavbarEntry } from '../console/navigation'

export function defineFsAddon(definition){
    if (typeof definition !== 'object') {
        throw new Error('Addon definition must be an object')
    }
    if (!definition?.name) {
        throw new Error('Addon definition must have a name')
    }
    async function initAddon(firesteadCtx) {
        //add pages to firestead context
        if(definition.console?.pages){
            let routePrefix = definition.name
            if(definition.console.routePrefix !== undefined) routePrefix = definition.console.routePrefix 
            addPagesPath(definition.console.pages, routePrefix , firesteadCtx)
        }
        //add navigation to firestead context
        if(definition.console?.navigation){
            addNavbarEntry(definition.console.navigation, firesteadCtx)
        }

        //call setup function
        await definition.setup?.call(null, firesteadCtx)
    }
    return initAddon
}