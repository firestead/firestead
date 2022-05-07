// Inspired by nuxt3 kit https://github.com/nuxt/framework/tree/main/packages/kit (MIT)
import { addPagesPath } from '../admin/pages'
import { addNavbarEntry } from '../admin/navigation'

export function defineFsAddon(definition){
    if (typeof definition !== 'object') {
        throw new Error('Addon definition must be an object')
    }
    if (!definition?.name) {
        throw new Error('Addon definition must have a name')
    }
    async function initAddon(firesteadCtx) {
        //add pages to firestead context
        if(definition.admin?.pages){
            let routePrefix = definition.name
            if(definition.admin.routePrefix !== undefined) routePrefix = definition.admin.routePrefix 
            addPagesPath(definition.admin.pages, routePrefix , firesteadCtx)
        }
        //add navigation to firestead context
        if(definition.admin?.navigation){
            addNavbarEntry(definition.admin.navigation, firesteadCtx)
        }

        //call setup function
        await definition.setup?.call(null, firesteadCtx)
    }
    return initAddon
}