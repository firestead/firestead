import { defineFsAddon } from "@firestead/kit"

const homeAddon = defineFsAddon({
    name: "home",
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

export default homeAddon