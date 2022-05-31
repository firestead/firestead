export interface NuxtFirebasePlugins {
    firestore: boolean,
    firestoreLite: boolean,
    auth: boolean,
    storage: boolean,
    functions: boolean
}

export interface NuxtOptions {
    version: string,
    modules: Array<string>,
    firebasePlugins: NuxtFirebasePlugins,
}

export interface HostingConfig {

}

export interface RemixOptions {
    version: string
}

type Framework = 'nuxt' //TODO: | 'remix' | 'nitro'

export interface HostingTarget {
    name: string,
    framework?: Framework,
    options?: NuxtOptions | RemixOptions | null,
    config?: HostingConfig
}