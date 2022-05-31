//Based on https://github.com/nuxt/framework/blob/main/packages/kit/src/context.ts (MIT)
import { getContext } from 'unctx'
import type { FiresteadContext } from '@firestead/schema'

/** Direct access to the Firestead context - see https://github.com/unjs/unctx. */
export const firesteadCtx = getContext<FiresteadContext>('firestead')

/**
 * Get access to Firestead instance.
 *
 * Throws an error if Firestead instance is unavailable.
 *
 * @example
 * ```js
 * const firesteadContext = useFiresteadContext()
 * ```
 */
 export function useFiresteadContext (): FiresteadContext {
    const instance = firesteadCtx.use()
    if (!instance) {
      throw new Error('Firestead instance is unavailable!')
    }
    return instance
}