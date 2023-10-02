type Options = {
    cwd?: string
    prefix?: string | boolean
    global?: boolean
}

const components = [
{
    name: 'LayoutSidebar',
    path: 'components/layouts/sidebar.vue'
},{
    name: 'LayoutStacked',
    path: 'components/layouts/stacked.vue'
},{
    name: 'Logo',
    prefix: false,
    path: 'components/logo.vue'
}]
export function getComponents(options: Options = {
    cwd: process.cwd(),
    prefix: 'Fs'
}){
    return components.map((component) => {
        const prefix = component.prefix === false ? false : component.prefix || options.prefix
        const name = prefix ? `${prefix}/${component.name}` : component.name
        return {
            name: name,
            filePath: `${options.cwd}/${component.path}`,
            watch: false,
            global: true
        }
    })
}