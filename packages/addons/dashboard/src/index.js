import { defineFsAddon } from "@firestead/kit"
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

const dashboardAddon = defineFsAddon({
    name: "dashboard",
    ui: {
        routePrefix: false,
        pages: resolve(dirname(fileURLToPath(import.meta.url)), "pages"),
        navigation: {
            label: "Dashboard",
            name: "dashboard",
            path: "/"
        },
    },
    functions: [],
    middleware: [],
    setup() {}
})

export default dashboardAddon