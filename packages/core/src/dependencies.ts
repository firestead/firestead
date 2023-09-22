import type { ModuleOptions } from './module'

type Modules = 
'@firestead/ui'

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
        name: '@firestead/ui',
    }] as DependencyModules

    return dependencyModules
}