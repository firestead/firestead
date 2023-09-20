import { h, cloneVNode, computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge } from 'tailwind-merge'
import { getSlotsChildren } from '../../utils/getSlotsChildren'
import { omit } from '../../utils/omit'
import type { ButtonGroup, ButtonGroupConfig, ButtonConfig } from '#theme'
import { useAppConfig, buttonGroupTheme } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    size: {
      type: String as PropType<keyof ButtonConfig['options']['size']>,
      default: appConfig.ui.defaults.buttonGroup.size,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.size).includes(value)
      }
    },
    shadow: {
      type: String as PropType<keyof ButtonGroupConfig['options']['shadow']>,
      default: () => appConfig.ui.defaults.buttonGroup.shadow,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.shadow).includes(value)
      }
    },
    rounded: {
      type: String as PropType<keyof ButtonConfig['options']['rounded']>,
      default: () => appConfig.ui.defaults.buttonGroup.rounded,
      validator (value: string) {
        return Object.keys(buttonTheme.default.options.rounded).includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<ButtonGroupConfig['base']>>,
      default: () => ({})
    }
  },
  setup (props, { attrs, slots }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const theme = computed(() => createTheme<ButtonGroup>(buttonGroupTheme, {
      overwrite: props.ui,
      merge: twMerge
    }))

    const children = computed(() => getSlotsChildren(slots))

    const clones = computed(() => children.value.map((node: any, index: any) => {
      const vProps: any = {}

      if (props.size) {
        vProps.size = props.size
      }

      vProps.ui = node.props?.ui || {}
      vProps.ui.button = 'shadow-none'

      if (index === 0) {
        vProps.roundedStart = true
        vProps.rounded = props.rounded
      }

      if (index === children.value.length - 1) {
        vProps.roundedEnd = true
        vProps.rounded = props.rounded
      }

      return cloneVNode(node, vProps)
    }))

    return () => h('div', { 
      class: theme.value('wrapper',{
        shadow: props.shadow
      }),  ...omit(attrs, ['class'])
    }, clones.value)
  }
})