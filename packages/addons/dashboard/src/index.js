import { defineFsAddon } from "@firestead/kit"

const dashboardAddon = defineFsAddon({
    name: "dashboard",
    ui: {
        pagesDir: "pages",
        navigation: {
            label: "Home",
            name: "home",
            path: "/"
        },
    },
    functions: [],
    api: [],
    setup() {}
})

export default dashboardAddon