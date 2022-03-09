import fse from 'fs-extra'
import { watch } from './watcher'
import { resolvePagesRoutes } from './console/pages'
import { writeRoutesFile } from './console/routes'
import { writeNavigationFile } from './console/navigation'

export async function prepareRuntime({ contextPath, buildConfig }){
  await fse.mkdirp(buildConfig.runtimePath)
  await fse.copy(`${contextPath}/${buildConfig.runtimeDir}`, buildConfig.runtimePath, { overwrite: true })
}

export function registerCoreOptions(firesteadContext){
    /*
    *   add console app core pages
    *   prefix: false -> no route prefix needed for core features, they start with /
    */
    firesteadContext.console.pages.push({
      path: `${firesteadContext.console.contextPath}/app/pages`,
      prefix: false
    })
    /*
    * add items to navbar navigation of console app
    * navbar consists of a top bar and a side bar
    */
    firesteadContext.console.navigation.navbar.items.push({
      label: "Dashboard",
      name: "dashboard",
      path: "/"
    })
    firesteadContext.console.navigation.navbar.items.push({
      label: "Operations",
      name: "operations",
      path: "/operations",
      sidebar: [{
          name: 'overview',
          path: '/operations',
          label: 'Overview'
      },{
          name: 'functions',
          path: '/operations/functions',
          label: 'Functions'
      },{
        name: 'environment',
        path: '/operations/environment',
        label: 'Environment'
      }]
    })
}

export async function bundleFiles(firesteadContext){
    /*
    *  firestead console uses page based routing:
    *  this function goes through all pages folders and gets all files with context
    *  it is based on nuxt 3 page based routing
    */
    firesteadContext.console.routes = await resolvePagesRoutes(firesteadContext)
    /*
    * this function uses the resolved pages routes to write the routes file
    */
    await writeRoutesFile(firesteadContext.console)
    /*
    * navigation is explicitly defined in the console context by the user/developer
    * this function writes the navigation file
    */
    await writeNavigationFile(firesteadContext.console)

  }

  /* 
  *  uses chokidar, dependency resolved by firestead core package 
  *  watch changes in all pages folders and rewrite files on change
  */
  export function watchPages(firesteadContext){
    firesteadContext.hooks.hook('console:pages:updated', async () => {
      await bundleFiles(firesteadContext)
    })
    watch(firesteadContext)
  }

