import fse from 'fs-extra'
import { watch } from './watcher'
import { resolvePagesRoutes } from './admin/pages'
import { writeRoutesFile } from './admin/routes'
import { writeNavigationFile } from './admin/navigation'

export async function prepareRuntime({ contextPath, buildConfig }){
  await fse.mkdirp(buildConfig.runtimePath)
  await fse.copy(`${contextPath}/${buildConfig.runtimeDir}`, buildConfig.runtimePath, { overwrite: true })
}

export function registerCoreOptions(firesteadContext){
    /*
    *   add admin app core pages
    *   prefix: false -> no route prefix needed for core features, they start with /
    */
    firesteadContext.options.admin.pages.push({
      path: `${firesteadContext.options.admin.contextPath}/app/pages`,
      prefix: false
    })
    /*
    * add items to navbar navigation of admin app
    * navbar consists of a top bar and a side bar
    */
    firesteadContext.options.admin.navigation.navbar.items.push({
      label: "Dashboard",
      name: "dashboard",
      path: "/"
    })
    firesteadContext.options.admin.navigation.navbar.items.push({
      label: "Operations",
      name: "operations",
      path: "/operations",
      sidebar: [{
          name: 'overview',
          path: '/operations',
          label: 'Overview'
      },{
        name: 'hosting',
        path: '/operations/hosting',
        label: 'Hosting'
      },{
          name: 'functions',
          path: '/operations/functions',
          label: 'Functions'
      },{
        name: 'environments',
        path: '/operations/environments',
        label: 'Environments'
      }]
    })
}

export async function bundleFiles(firesteadContext){
    /*
    *  firestead admin uses page based routing:
    *  this function goes through all pages folders and gets all files with context
    *  it is based on nuxt 3 page based routing
    */
    firesteadContext.options.admin.routes = await resolvePagesRoutes(firesteadContext)
    /*
    * this function uses the resolved pages routes to write the routes file
    */
    await writeRoutesFile(firesteadContext.options.admin)
    /*
    * navigation is explicitly defined in the admin context by the user/developer
    * this function writes the navigation file
    */
    await writeNavigationFile(firesteadContext.options.admin)

  }

  /* 
  *  uses chokidar, dependency resolved by firestead core package 
  *  watch changes in all pages folders and rewrite files on change
  *  TODO: add perfect-debounce to prevent errors by multiple calls at once  
  */
  export function watchPages(firesteadContext){
    firesteadContext.hooks.hook('admin:pages:updated', async () => {
      await bundleFiles(firesteadContext)
    })
    watch(firesteadContext)
  }

