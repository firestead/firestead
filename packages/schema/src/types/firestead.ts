import type { Hookable } from 'hookable'
import type { FiresteadHooks } from './hooks'
import { ConfigSchema } from '../../schema/config'

export interface FiresteadOptions extends ConfigSchema {
}

export interface FiresteadContext {
    _version: string,
    hooks: Hookable<FiresteadHooks>,
    options?: FiresteadOptions
}