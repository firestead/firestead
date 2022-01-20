import { defineFsAddon } from "@firestead/kit"
import { dirname, resolve } from 'pathe'
import { fileURLToPath } from 'url'

const operationsAddon = defineFsAddon({
    name: "operations",
    ui: {
        pages: resolve(dirname(fileURLToPath(import.meta.url)), "pages"),
        navigation: {
            label: "Operations",
            name: "operations",
            path: "/operations",
            sidebar: [{
                name: 'overview',
                path: '/operations',
                label: 'Overview'
            },{
                name: 'logger',
                path: '/operations/logger',
                label: 'Logger'
            }]
        },
    },
    functions: [],
    api: [],
    setup() {}
})

export default operationsAddon