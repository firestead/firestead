import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './app.vue'
import Dashboard from './pages/index.vue'
import './assets/style.css'

const baseURL = '/fs'

//create page dir routing
const routes = [{
    path: `${baseURL}/`,
    name: "dashboard",
    component: Dashboard,
}]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

const app = createApp(App).use(router)

router.isReady().then(() => {
    console.log('App')
    app.mount('#app')
})