import type { Hookable } from 'hookable'
import type { FiresteadHooks } from './hooks'
import { ConfigSchema } from '../../schema/config'

export interface FiresteadOptions extends ConfigSchema {
    _version: string,
}

export interface FiresteadContext {
    hooks: Hookable<FiresteadHooks>,
    options: FiresteadOptions
}