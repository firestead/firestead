import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'

const baseURL = 'fs'

const router = createRouter({
    history: createWebHistory(`/${baseURL}/`),
    routes: routes
})

export default router