import type { HostingTarget } from './hostingTarget'
import type { EnvironmentRuntime } from './environmentRuntime'

type HookResult = Promise<void> | void

export type HostingTargets = Record <string, HostingTarget>
export type EnvironmentRuntimes = Record <string, EnvironmentRuntime>

export interface FiresteadHooks {
    //Hosting hooks
    'hosting:targets:update': (targets: HostingTargets) => HookResult,
    'hosting:targets:updated': (targets: HostingTargets) => HookResult,
    //Environment hooks
    'environments:runtimesUpdate': (runtimes: EnvironmentRuntimes) => HookResult
}