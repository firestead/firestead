// Inspired by nuxt3 kit https://github.com/nuxt/framework/tree/main/packages/kit (MIT)
import { addPagesPath } from '../ui/pages'
import { addNavbarEntry } from '../ui/navigation'

export function defineFsAddon(definition){
    if (typeof definition !== 'object') {
        throw new Error('Addon definition must be an object')
    }
    if (!definition?.name) {
        throw new Error('Addon definition must have a name')
    }
    async function initAddon(firesteadCtx) {
        //add pages to firestead context
        if(definition.ui?.pages){
            let routePrefix = definition.name
            if(definition.ui.routePrefix !== undefined) routePrefix = definition.ui.routePrefix 
            addPagesPath(definition.ui.pages, routePrefix , firesteadCtx)
        }
        //add navigation to firestead context
        if(definition.ui?.navigation){
            addNavbarEntry(definition.ui.navigation, firesteadCtx)
        }

        //call setup function
        await definition.setup?.call(null, firesteadCtx)
    }
    return initAddon
}