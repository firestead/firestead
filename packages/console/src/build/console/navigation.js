import fse from 'fs-extra'

export async function writeNavigationFile (firesteadContext) {
    const { menu } = firesteadContext.console.navigation
    let navigationContent = ''
    // add navbar menu
    navigationContent = navigationContent.concat('\n','export const menu = [];', '\n')
    for( const [i, navEntry] of menu.entries()){
        navigationContent = navigationContent.concat(`menu.push({name:'${navEntry.name}',path:'${navEntry.path}',label: '${navEntry.label}'});`, '\n')
        //add sidebar menu
        if(typeof navEntry.sidebar !== "undefined"){
            navigationContent = navigationContent.concat(`menu[${i}].sidebar = [];`, '\n')
            for( const sidebarEntry of navEntry.sidebar){
                navigationContent = navigationContent.concat(`menu[${i}].sidebar.push({name:'${sidebarEntry.name}',path:'${sidebarEntry.path}',label: '${sidebarEntry.label}'});`, '\n')
            }
        }
    }
    await fse.writeFile(`${firesteadContext.console.buildRuntimePath}/navigation.js`, navigationContent, 'utf-8')
}