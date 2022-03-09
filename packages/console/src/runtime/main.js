import { createApp, ref } from 'vue'
import App from '#console/app.vue'
import router from './router.js'
import { navbar } from './navigation.js'
import 'virtual:windi.css'

const app = createApp(App).use(router)

const navigation = {
    current: ref(null),
    navbar: navbar
}

app.provide('navigation', navigation)

router.isReady().then(() => {
    app.mount('#app')
})