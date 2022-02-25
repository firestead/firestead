import { createApp, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from '#console/app.vue'
import routes from './routes.js'
import { menu } from './navigation.js'
import 'virtual:windi.css'

const baseURL = 'fs'

const router = createRouter({
    history: createWebHistory(`/${baseURL}/`),
    routes: routes
})

const app = createApp(App).use(router)

const navigation = {
    current: ref(null),
    menu: menu
}

app.provide('navigation', navigation)

router.isReady().then(() => {
    app.mount('#app')
})