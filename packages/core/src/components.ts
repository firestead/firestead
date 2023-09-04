type Options = {
    cwd?: string
    prefix?: string
    global?: boolean
}

const components = [{
    name: 'Button',
    path: 'components/elements/button.vue'
},{
    name: 'ButtonGroup',
    path: 'components/elements/button-group.ts'
},{
    name: 'Link',
    path: 'components/elements/link.vue'
},{
    name: 'Icon',
    path: 'components/elements/icon.vue'
}, {
    name: 'FieldErrors',
    path: 'components/forms/field/errors.vue'
}, {
    name: 'FieldFeedback',
    path: 'components/forms/field/feedback.vue'
}, {
    name: 'FieldLabel',
    path: 'components/forms/field/label.vue'
}]


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