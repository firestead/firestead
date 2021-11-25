export const navbar = [
    {
        name: 'home',
        label: 'Home',
        path: '/'
    },
    {
        name: 'operations',
        label: 'Operations',
        path: '/operations'
    }
]

export const sidebar = [
    {
        name: 'home',
        label: 'Home',
        items: [
            {
                name: 'overview',
                label: 'Overview',
                path: '/',
            }
        ]
    },
    {
        name: 'operations',
        label: 'Operations',
        items: [{
            name: 'overview',
            label: 'Overview',
            path: '/operations'
        },
        {
            name: 'logger',
            label: 'Logger',
            path: '/operations/logger'
        }]
    }
]