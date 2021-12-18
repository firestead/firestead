import { createApp, reactive } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '#ui/app.vue'
import routes from './routes.js'
import { navbar, sidebar } from './navigation.js'
import '#ui/assets/style.css'

const baseURL = 'fs'

const router = createRouter({
    history: createWebHistory(`/${baseURL}/`),
    routes: routes
})

const app = createApp(App).use(router)

app.provide('navigation', {
    current: reactive({}),
    navbar,
    sidebar
})

router.isReady().then(() => {
    app.mount('#app')
})