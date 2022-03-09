import fse from 'fs-extra'

export async function writeNavigationFile ({ navigation, buildConfig }) {
    const { navbar } = navigation
    let navigationContent = ''
    // add navbar menu
    navigationContent = navigationContent.concat('\n','export const navbar = [];', '\n')
    for( const [i, navEntry] of navbar.items.entries()){
        navigationContent = navigationContent.concat(`navbar.push({name:'${navEntry.name}',path:'${navEntry.path}',label: '${navEntry.label}'});`, '\n')
        //add sidebar menu
        if(typeof navEntry.sidebar !== "undefined"){
            navigationContent = navigationContent.concat(`navbar[${i}].sidebar = [];`, '\n')
            for( const sidebarEntry of navEntry.sidebar){
                navigationContent = navigationContent.concat(`navbar[${i}].sidebar.push({name:'${sidebarEntry.name}',path:'${sidebarEntry.path}',label: '${sidebarEntry.label}'});`, '\n')
            }
        }
    }
    await fse.writeFile(`${buildConfig.runtimePath}/navigation.js`, navigationContent, 'utf-8')
}