import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '#ui/app.vue'
import routes from './routes.js'
import '#ui/assets/style.css'

const baseURL = 'fs'

const router = createRouter({
    history: createWebHistory(`/${baseURL}/`),
    routes: routes
})

const app = createApp(App).use(router)

router.isReady().then(() => {
    app.mount('#app')
})