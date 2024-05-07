import { defineNuxtRouteMiddleware } from '#imports'

const wildcardRoutes = ['/login', '/register']

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser()
    if (!user && !wildcardRoutes.includes(to.path)) {
      // Get the current route including query params to add it as a query param to redirect back to it after login
      const currentRoute = encodeURIComponent(to.fullPath)
      return navigateTo({ 
        path: `/login`,
        query: { redirect: currentRoute }
      })
    }else if(user && wildcardRoutes.includes(to.path)){
      return navigateTo({ 
        path: '/' 
      })
    }
  })