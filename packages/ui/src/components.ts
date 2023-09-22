type Options = {
    cwd?: string
    prefix?: string
    global?: boolean
}

const components = [
//Elements    
{
    name: 'Avatar',
    path: 'components/elements/avatar.vue'
},{
    name: 'AvatarGroup',
    path: 'components/elements/avatar-group.ts'
},{
    name: 'Badge',
    path: 'components/elements/badge.vue'
},{
    name: 'Button',
    path: 'components/elements/button.vue'
},{
    name: 'ButtonGroup',
    path: 'components/elements/button-group.ts'
},{
    name: 'Dropdown',
    path: 'components/elements/dropdown.vue'
},{
    name: 'Kbd',
    path: 'components/elements/kbd.vue'
},{
    name: 'Link',
    path: 'components/elements/link.vue'
},{
    name: 'Icon',
    path: 'components/elements/icon.vue'
},{
    name: 'Card', 
    path: 'components/elements/card.vue'
}, 
//Forms
{
    name: 'Form',
    path: 'components/forms/form.vue'
},
{
    name: 'Field',
    path: 'components/forms/field.vue'
},
{
    name: 'Input',
    path: 'components/forms/input.vue'
},{
    name: 'Checkbox',
    path: 'components/forms/checkbox.vue'
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