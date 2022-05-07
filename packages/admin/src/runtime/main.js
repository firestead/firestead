import { createApp, ref } from 'vue'
import App from '#admin/app.vue'
import router from './router.js'
import websocket from './websocket.js'
import { navbar } from './navigation.js'
import 'virtual:windi.css'

const app = createApp(App)
app.use(router)
app.use(websocket)

const navigation = {
    current: ref(null),
    navbar: navbar
}

app.provide('navigation', navigation)

router.isReady().then(() => {
    app.mount('#app')
})