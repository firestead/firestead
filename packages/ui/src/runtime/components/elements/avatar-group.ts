import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { getSlotsChildren } from '../../utils/getSlotsChildren'
import { omit } from '../../utils/omit'
import type { AvatarConfig, AvatarGroup, AvatarGroupConfig } from '#theme'
import Avatar from './Avatar.vue'
import { useAppConfig, avatarTheme, avatarGroupTheme } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<keyof AvatarConfig['options']['size']>,
      default: null,
      validator (value: string) {
        return Object.keys(avatarTheme.default.options.size).includes(value)
      }
    },
    max: {
        type: Number,
        default: null
    },
    ui: {
      type: Object as PropType<Partial<AvatarGroupConfig['base']>>,
      default: () => ({})
    }
  },
  setup (props, { attrs, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const theme = computed(() => createTheme<AvatarGroup>(avatarGroupTheme, {
      overwrite: props.ui,
      merge: twMerge
    }))

    const children = computed(() => getSlotsChildren(slots))

    const max = computed(() => typeof props.max === 'string' ? parseInt(props.max, 10) : props.max)

    const clones = computed(() => children.value.map((node, index) => {
        const vProps: any = {}
  
        if (!props.max || (max.value && index < max.value)) {
          if (props.size) {
            vProps.size = props.size
          }
  
          vProps.class = node.props.class || ''
          vProps.class = theme.value('children',{}, vProps.class)
  
          return cloneVNode(node, vProps)
        }
  
        if (max.value !== undefined && index === max.value) {
          return h(Avatar, {
            size: props.size || appConfig.ui.defaults.avatar.size,
            text: `+${children.value.length - max.value}`,
            class: theme.value('children')
          })
        }
  
        return null
      }).filter(Boolean).reverse())
  
      return () => h('div', { 
        class: theme.value('wrapper',{}, attrs.class as string), 
        ...omit(attrs, ['class']) }, 
        clones.value)
  }
})