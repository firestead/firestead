import type { HostingTarget } from './hostingTarget'
import type { EnvironmentRuntime } from './environmentRuntime'

type HookResult = Promise<void> | void

export type HostingTargets = Record <string, HostingTarget>
export type EnvironmentRuntimes = Record <string, EnvironmentRuntime>

export interface FiresteadHooks {
    //Hosting hooks
    'hosting:targetsUpdate': (targets: HostingTargets) => HookResult,
    //Environment hooks
    'environments:runtimesUpdate': (runtimes: EnvironmentRuntimes) => HookResult
}