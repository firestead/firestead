import { useFiresteadContext } from './context'

export function getUINavigation(){
    const firesteadContext = useFiresteadContext()
    return {
        createMenu: (navbarName, navbarPath, navbarLabel)=>{
            const navbar = firesteadContext.ui.navbar
            const filteredEntries = navbar.filter(navEntry => navEntry.name === navbarName)
            const navbarEntry = {
                name: navbarName,
                path: navbarPath,
                label: navbarLabel,
                createSidebar: () => {
                    const sidebarEntry = {
                        name: navbarName,
                        label: navbarLabel,
                        items: [],
                        createMenu: (sidebarName, sidebarPath, sidebarLabel) => {
                            const currentSidebar = firesteadContext.ui.sidebar.filter(sidebarEntry => sidebarEntry.name === navbarName)[0]
                            const filteredSidebarEntries = currentSidebar.items.filter(sidebarMenu => sidebarMenu.name === sidebarName)
                            const newSidebarMenu = {
                                name: sidebarName,
                                path: sidebarPath,
                                label: sidebarLabel,
                            }
                            if(filteredSidebarEntries.length===0){
                                currentSidebar.items.push(newSidebarMenu)
                            }else{
                                //overwrite existing entry
                                currentSidebar.items[currentSidebar.items.indexOf(filteredSidebarEntries[0])] = newSidebarMenu
                            }
                        },
                        getMenuItems: () => {
                            const currentSidebar = firesteadContext.ui.sidebar.filter(sidebarEntry => sidebarEntry.name === navbarName)
                            return currentSidebar[0].items
                        }
                    }
                    firesteadContext.ui.sidebar.push(sidebarEntry)
                    return sidebarEntry
                },
                getSidebar: () => {
                    const currentSidebar = firesteadContext.ui.sidebar.filter(sidebarEntry => sidebarEntry.name === navbarName)
                    return currentSidebar[0]
                },
                isSidebar: () => {
                    const currentSidebar = firesteadContext.ui.sidebar.filter(sidebarEntry => sidebarEntry.name === navbarName)
                    return currentSidebar.length > 0
                },
                disableSidebar: () => {
                    //TODO
                }
            }
            if(filteredEntries.length===0){
                firesteadContext.ui.navbar.push(navbarEntry)
            }else{
                //overwrite existing entry
                firesteadContext.ui.navbar[firesteadContext.ui.navbar.indexOf(filteredEntries[0])] = navbarEntry
            }
            return navbarEntry
        },
        getNavbar: () => {
            return firesteadContext.ui.navbar
        },
        getNavbarMenu: (name) => {
            const filteredEntries = firesteadContext.ui.navbar.filter(navbarEntry => navbarEntry.name === name)
            return filteredEntries[0]
        }
    }
}