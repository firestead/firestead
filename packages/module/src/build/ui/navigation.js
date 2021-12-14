import fse from 'fs-extra'
import { getUINavigation } from '@firestead/kit'

export function createNavigation () {
    const navigation = getUINavigation()
    const homeNav = navigation.createMenu('home', '/', 'Home')
    const homeSidebar = homeNav.createSidebar()
    homeSidebar.createMenu('overview', '/', 'Overview')
    const operationsNav = navigation.createMenu('operations', '/operations', 'Operations')
    const operationsSidebar = operationsNav.createSidebar()
    operationsSidebar.createMenu('overview', '/operations', 'Overview')
    operationsSidebar.createMenu('logger', '/operations/logger', 'Logger')
}

export async function writeNavigationFile (firesteadContext) {
    let navigationContent = ''
    // add navbar
    navigationContent = navigationContent.concat('\n','export const navbar = [];', '\n')
    for( const navEntry of firesteadContext.ui.navbar){
        navigationContent = navigationContent.concat(`navbar.push({name:'${navEntry.name}',path:'${navEntry.path}',label: '${navEntry.label}'});`, '\n')
    }
    // add sidebar
    navigationContent = navigationContent.concat('\n','export const sidebar = [];', '\n')
    let sidebarIndex = 0
    for( const sidebarEntry of firesteadContext.ui.sidebar){
        navigationContent = navigationContent.concat(`sidebar.push({name:'${sidebarEntry.name}',label:'${sidebarEntry.label}',items:[]});`, '\n')
        if(sidebarEntry.items){
            for( const sidebarMenu of sidebarEntry.items){
                navigationContent = navigationContent.concat(`sidebar[${sidebarIndex}].items.push({name:'${sidebarMenu.name}',path:'${sidebarMenu.path}',label:'${sidebarMenu.label}'});`, '\n')
            }
        }
        sidebarIndex++
    }
    await fse.writeFile(`${firesteadContext.ui.buildRuntimeDir}/navigation.js`, navigationContent, 'utf-8')
}