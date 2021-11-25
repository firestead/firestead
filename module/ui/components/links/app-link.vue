<template>
  <a v-if="isExternalLink" v-bind="$attrs" :href="to" target="_blank">
    <slot />
  </a>
  <router-link
    v-else
    v-bind="$props"
    custom
    v-slot="{ href, navigate }"
  >
    <a
      v-bind="$attrs"
      :href="href"
      @click="navigate"
      :class="isActive ? activeClass : inactiveClass"
    >
      <slot />
    </a>
  </router-link>
</template>

<script>
import { computed, inject } from 'vue'
import { RouterLink, useLink, useRoute } from 'vue-router'

export default {
  name: 'AppLink',

  props: {
    ...RouterLink.props,
    inactiveClass: String,
    linkType: String,
    name: String
  },

  setup(props) {
    const { current } = inject('navigation')
    const { route: ctxRoute, href, navigate } = useLink(props)

    const route = useRoute()

    const isActive = computed(
      () =>{
        const { path } = route
        let isActive = false
        if(path==='/') {
          isActive = ctxRoute.value.path === '/'
        } else {
          let index = false
          if(props.linkType === 'navbar') index = 1
          if(props.linkType === 'sidebar') index = 2
          const pathArray = path.split('/')
          //set active if current path is equal to the path of the link
          if(pathArray[index]) {
            if(path !== ctxRoute.value.path) isActive = ctxRoute.value.path.includes(pathArray[index])
            else isActive = true
          }
          else if(ctxRoute.value.path===path) isActive = true
        }
        //add current name
        if(isActive) current[props.linkType] = props.name
        return isActive
      })

    const isExternalLink = computed(
      () => typeof props.to === 'string' && props.to.startsWith('http')
    )

    return { isExternalLink, href, navigate, isActive }
  },
}
</script>