//cc https://github.com/nuxt/framework/blob/main/packages/kit/src/context.ts
import { getContext } from 'unctx'

/** Direct access to the Nuxt context - see https://github.com/unjs/unctx. */
export const firesteadCtx = getContext('firestead')

/**
 * Get access to Firestead (if run within the Firestead context) - see https://github.com/unjs/unctx.
 *
 * @example
 * ```js
 * const firestead = useFirestead()
 * ```
 */
export const useFiresteadContext = firesteadCtx.use