type Options = {
    cwd?: string
    prefix?: string
    global?: boolean
}

const components = [
//Auth elements
{
    name: 'EmailPasswordSignIn',
    path: 'components/emailPasswordSignIn.vue'
}
]


export function getComponents(options: Options = {
    cwd: process.cwd(),
    prefix: 'Fs'
}){
    return components.map((component) => {
        return {
            name: `${options.prefix}/${component.name}`,
            filePath: `${options.cwd}/${component.path}`,
            watch: false,
            global: true
        }
    })
}