<template>
    <HMenu v-slot="{ open }" 
        as="div" 
        :class="theme('wrapper', {}, $attrs.class)" 
        v-bind="omit($attrs, ['class'])" 
        @mouseleave="onMouseLeave">
        <HMenuButton
          ref="trigger"
          as="div"
          :disabled="disabled"
          class="inline-flex w-full"
          role="button"
          @mouseover="onMouseOver"
        >
            <slot :open="open" :disabled="disabled">
                <button :disabled="disabled">
                    Open
                </button>
            </slot>
        </HMenuButton>

        <div 
          v-if="open && items.length" 
          ref="container" 
          :class="['group',theme('container')]" 
          :style="containerStyle" 
          @mouseover="onMouseOver">
            <Transition appear v-bind="transitionPreset">
              <div>
                <div 
                  v-if="popper.arrow" 
                  data-popper-arrow 
                  :class="['invisible before:visible before:block before:rotate-45 before:z-[-1]', theme('arrow')]" />
                <HMenuItems 
                  :class="theme('menu')" static>
                  <div 
                    v-for="(subItems, index) of items" 
                  :key="index" 
                  :class="theme('itemContainer')">
                    <HMenuItem 
                        v-for="(item, subIndex) of subItems" 
                        :key="subIndex" 
                        v-slot="{ active, disabled: itemDisabled }" 
                        :disabled="item.disabled">
                        <FsLink
                            v-bind="omit(item, ['label', 'slot', 'icon', 'iconClass', 'avatar', 'shortcuts', 'disabled', 'click'])"
                            :class="theme('item', {
                                itemActive: transformBoolean(active),
                                itemDisabled: transformBoolean(itemDisabled),
                            })"
                            @click="item.click"
                        >
                            <slot :name="item.slot || 'item'" :item="item">
                            <FsIcon 
                                v-if="item.icon" 
                                :name="item.icon" 
                                :class="theme('icon', {
                                    iconActive: transformBoolean(active),
                                },item.iconClass)" />
                            <FsAvatar 
                                v-else-if="item.avatar" 
                                v-bind="{ 
                                    size: avatarSize, 
                                    ...item.avatar 
                                }" 
                                :class="theme('avatar')" />

                            <span class="truncate">{{ item.label }}</span>

                            <span 
                                v-if="item.shortcuts?.length" 
                                :class="theme('shortcuts')">
                                <FsKbd v-for="shortcut of item.shortcuts" :key="shortcut">{{ shortcut }}</FsKbd>
                            </span>
                            </slot>
                        </FsLink>
                    </HMenuItem>
                  </div>
              </HMenuItems>
            </div>
          </Transition>
      </div>
  </HMenu>
</template>
<script setup lang="ts">
    import { ref, computed, onMounted } from 'vue'
    import { Menu as HMenu, MenuButton as HMenuButton, MenuItems as HMenuItems, MenuItem as HMenuItem } from '@headlessui/vue'
    import { defu } from 'defu'
    import { omit } from '../../utils/omit'
    import { transformBoolean } from '../../utils/transformBoolean'
    import { usePopper } from '../../composables/usePopper'
    import FsIcon from './icon.vue'
    import FsAvatar from './avatar.vue'
    import FsKbd from './kbd.vue'
    import FsLink from './link.vue'
    import type { DropdownItem } from '../../types/dropdown'
    import type { PopperOptions } from '../../types/popper'
    import { createTheme, dropdownTheme, type PropType } from '#imports'
    import type { DropdownConfig, Dropdown, AvatarConfig  } from '#theme'

    const props = defineProps({
        items: {
            type: Array as PropType<DropdownItem[][]>,
            default: () => []
        },
        mode: {
            type: String as PropType<'click' | 'hover'>,
            default: 'click',
            validator: (value: string) => ['click', 'hover'].includes(value)
        },
        disabled: {
            type: Boolean,
            default: false
        },
        popper: {
            type: Object as PropType<PopperOptions>,
            default: () => ({})
        },
        openDelay: {
            type: Number,
            default: 0
        },
        closeDelay: {
            type: Number,
            default: 0
        },
        ui: {
            type: Object as PropType<Partial<DropdownConfig['base']>>,
            default: undefined
        }
    })

    const theme = computed(() => createTheme<Dropdown>(dropdownTheme, {
      overwrite: props.ui
    }))

    //Get presets
    const avatarSize = theme.value('preset:avatarSize') as keyof AvatarConfig['options']['size']
    const transitionPreset = theme.value('preset:transition') as Object
    const popperPreset = theme.value('preset:popper') as PopperOptions

    const popper = computed<PopperOptions>(() => defu(props.mode === 'hover' ? { offsetDistance: 0 } : {}, props.popper, popperPreset))

    const [trigger, container] = usePopper(popper.value)

    const containerStyle = computed(() => {
      const offsetDistance = (props.popper as PopperOptions)?.offsetDistance || (popperPreset)?.offsetDistance || 8

      return props.mode === 'hover' ? { paddingTop: `${offsetDistance}px`, paddingBottom: `${offsetDistance}px` } : {}
    })

    onMounted(() => {
      setTimeout(() => {
        // @ts-expect-error internals
        const menuProvides = trigger.value?.$.provides
        if (!menuProvides) {
          return
        }
        const menuProvidesSymbols = Object.getOwnPropertySymbols(menuProvides)
        menuApi.value = menuProvidesSymbols.length && menuProvides[menuProvidesSymbols[0]]
      }, 200)
    })

    // https://github.com/tailwindlabs/headlessui/blob/f66f4926c489fc15289d528294c23a3dc2aee7b1/packages/%40headlessui-vue/src/components/menu/menu.ts#L131
    const menuApi = ref<any>(null)

    let openTimeout: NodeJS.Timeout | null = null
    let closeTimeout: NodeJS.Timeout | null = null

    function onMouseOver () {
      if (props.mode !== 'hover' || !menuApi.value) {
        return
      }

      // cancel programmed closing
      if (closeTimeout) {
        clearTimeout(closeTimeout)
        closeTimeout = null
      }
      // dropdown already open
      if (menuApi.value.menuState === 0) {
        return
      }
      openTimeout = openTimeout || setTimeout(() => {
        menuApi.value.openMenu && menuApi.value.openMenu()
        openTimeout = null
      }, props.openDelay)
    }

    function onMouseLeave () {
      if (props.mode !== 'hover' || !menuApi.value) {
        return
      }

      // cancel programmed opening
      if (openTimeout) {
        clearTimeout(openTimeout)
        openTimeout = null
      }
      // dropdown already closed
      if (menuApi.value.menuState === 1) {
        return
      }
      closeTimeout = closeTimeout || setTimeout(() => {
        menuApi.value.closeMenu && menuApi.value.closeMenu()
        closeTimeout = null
      }, props.closeDelay)
    }
</script>