import fse from 'fs-extra'

export async function writeRoutesFile ({ routes, buildConfig }) {
    let routesContent = ''
    // import route components
    for( const route of routes){
        const routeName = route.name.replaceAll("-", "")
        routesContent = routesContent.concat(`import ${routeName} from "${route.file}"`, '\n')
        if(route.children){
            for( const childRoute of route.children){
                const childRouteName = childRoute.name.replaceAll("-", "")
                routesContent = routesContent.concat(`import ${childRouteName} from "${childRoute.file}"`, '\n')
            }
        }
    }
    // add routes
    routesContent = routesContent.concat('\n','const routes = [];', '\n')
    let routesIndex = 0
    for( const route of routes){
        const routeName = route.name.replaceAll("-", "")
        routesContent = routesContent.concat(`routes.push({name:'${routeName}',path:'${route.path}',component:${routeName},children:[]});`, '\n')
        if(route.children){
            for( const childRoute of route.children){
                const childRouteName = childRoute.name.replaceAll("-", "")
                routesContent = routesContent.concat(`routes[${routesIndex}].children.push({name:'${childRoute.name}',path:'${childRoute.path}',component:${childRouteName}});`, '\n')
            }
        }
        routesIndex++
    }
    routesContent = routesContent.concat('export default routes;')
    await fse.writeFile(`${buildConfig.runtimePath}/routes.js`, routesContent, 'utf-8')
}