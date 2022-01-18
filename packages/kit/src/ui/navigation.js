import { useFiresteadContext } from '../context'
import { createUUID } from '../utils'

export function getNavigation(){
    const firesteadContext = useFiresteadContext()
    return firesteadContext.ui.navigation
}

export function addNavbarEntry(navbarEntry){
    const firesteadContext = useFiresteadContext()
    const newNavbarEntry = {}
    if(typeof navbarEntry.path === 'undefined'){
        throw new Error('Navbar entry must have a path')
    }
    if(typeof navbarEntry.name === 'undefined'){
        newNavbarEntry.name = createUUID()
    }
    if(typeof navbarEntry.label === 'undefined'){
        newNavbarEntry.label = newNavbarEntry.name
    }
    if(typeof navbarEntry.sidebar !== 'undefined'){
        if(navbarEntry.sidebar.length > 0){
            for (let sidebarEntry of navbarEntry.sidebar) {
                addSidebarEntry(newNavbarEntry,sidebarEntry)
            }
        }
    }
    firesteadContext.ui.navigation.menu.push(navbarEntry)
    return navbarEntry
}

export function addSidebarEntry(navbarEntry, sidebarEntry){
    if(typeof navbarEntry === 'undefined'){
        throw new Error('Navbar entry must be defined')
    }
    if(typeof sidebarEntry.path === 'undefined'){
        throw new Error('Sidebar entry must have a path')
    }
    if(typeof sidebarEntry.name === 'undefined'){
        sidebarEntry.name = createUUID()
    }
    if(typeof sidebarEntry.label === 'undefined'){
        sidebarEntry.label = navbarEntry.name
    }
    if(typeof navbarEntry.sidebar === 'undefined'){
        navbarEntry.sidebar = []
    }
    navbarEntry.sidebar.push(sidebarEntry)
}