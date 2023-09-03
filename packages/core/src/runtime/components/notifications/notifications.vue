<template>
  <div aria-live="assertive" :class="classes('container', {
    positionContainer: position
  })">
     <div :class="classes('group', {
        positionGroup: position
     })">
        <transition 
          :enterActiveClass="classes('transitionEnterActive')"
          :enterFromClass="classes('transitionEnterFrom')" 
          :enterToClass="classes('transitionEnterTo')" 
          :leaveActiveClass="classes('transitionLeaveActive')" 
          :leaveFromClass="classes('transitionLeaveFrom')" 
          :leaveToClass="classes('transitionLeaveTo')">
          <div :class="classes('messageContainer')">
            <component :is="component" />
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup lang="ts">
    import type { NotificationConfig } from '#theme'
    import MessageStatus from './message-status.vue'
    
    const { classes } = useTheme('notification')

    type Props = {
        component?: string | Component,
        width?: string | number
        position?: keyof NotificationConfig['options']['positionContainer']
    }

    const props = withDefaults(defineProps<Props>(),{
        width: 300,
        position: 'topRight',
        component: MessageStatus
    })

    if (typeof props.component === 'string') {
        props.component = resolveComponent(props.component)
    }

  </script>
  