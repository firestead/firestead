import { defineFsAddon } from "@firestead/kit"
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

const dashboardAddon = defineFsAddon({
    name: "dashboard",
    console: {
        routePrefix: false,
        pages: resolve(dirname(fileURLToPath(import.meta.url)), "pages"),
        navigation: {
            label: "Dashboard",
            name: "dashboard",
            path: "/"
        },
    },
    functions: [],
    setup() {}
})

export default dashboardAddon