import type { AvatarConfig, TailwindColors } from '#theme'

export interface Avatar {
    src?: string | boolean
    alt?: string
    text?: string
    size?: keyof AvatarConfig['options']['size']
    chipColor?: TailwindColors
    chipPosition?: keyof AvatarConfig['options']['chipPosition']
}