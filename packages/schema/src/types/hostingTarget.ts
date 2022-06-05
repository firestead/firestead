export interface NuxtConfig {
    version: string,
    modules: Array<string>,
    ssr: boolean,
    mode: string,
    target: string
}
export interface RemixConfig {
    version: string
}

export interface HostingTargetServer {
    port: number,
    hostname: string,
    reload?: Function
}

export interface HostingTargetConfig {

}

export type Framework = 'nuxt' | 'remix' | 'nitro'
export type FrameworkConfig = NuxtConfig | RemixConfig | {}

export interface HostingTarget {
    name: string,
    rootDir: string,
    framework?: Framework,
    package?: string,
    server?: HostingTargetServer,
    frameworkConfig?: FrameworkConfig,
    hostingConfig?: HostingTargetConfig | {}
}