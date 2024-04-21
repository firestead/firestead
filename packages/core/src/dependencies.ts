import type { ModuleOptions } from './module'
import type { FirebaseOptions } from 'firebase/app'

type Modules = 
'@nuxt/ui' |
'nuxt-vuefire'

type DependencyModule = {
    name: Modules
    options?: Record<string, any>
}

type DependencyModules = DependencyModule[]

type DependencyConfig = {
    options: ModuleOptions
    cwd: string
}

export function getDependencyModules(config: DependencyConfig): DependencyModules {
    const dependencyModules = [{
        name: '@nuxt/ui',
        options: {
            prefix: config.options.ui?.prefix || 'Fs',
        }
    },{
        name: 'nuxt-vuefire',
        options: {
            auth: {
                enabled: true
            },
            emulators: {
                enabled: true,
      
                auth: {
                  options: {
                    // removes the HTML footer and console warning
                    disableWarnings: process.env.NODE_ENV === 'development',
                  },
                },
            },
            config: {
                // prefix 'demo' must be set, so that emulator uses dummy config data
                // currently there is a bug in firebase-tools, that does not support this feature with frameworks
                // see https://github.com/firebase/firebase-tools/issues/6377
                projectId: 'demo-default',
                apiKey: 'app-id'
            } as FirebaseOptions
        }
    }] as DependencyModules

    return dependencyModules
}