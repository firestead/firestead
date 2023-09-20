import type { AvatarConfig } from '#theme'
import type { TailwindColors } from '../types'

export interface Avatar {
    src?: string | boolean
    alt?: string
    text?: string
    size?: keyof AvatarConfig['options']['size']
    chipColor?: TailwindColors
    chipVariant?: string
    chipPosition?: keyof AvatarConfig['options']['chipPosition']
}