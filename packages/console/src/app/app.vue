<template>
    <div class="console">
        <header>
            <div class="flex justify-between border-b-1 h-12 border-gray-300 bg-gray-100 px-1 md:px-6">
                <div class="p-1">
                  <logo class="h-9 pt-1 w-auto"></logo>
                </div>
                <div class="flex items-center md:hidden">
                  <!-- Mobile menu button -->
                  <button
                    @click="mobileTopBar = !mobileTopBar"
                    v-if="!mobileTopBar"
                    type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                <!-- Mobile menu, show/hide based on menu state. -->
                <div v-if="mobileTopBar"
                class="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                <div class="rounded-lg shadow-md bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div class="px-5 pt-4 flex items-center justify-between">
                        <router-link 
                            to="/"
                            class="flex-shrink-0 flex items-center">
                            <logo class="block h-8 pt-1 w-auto"></logo>
                        </router-link>
                    <div class="-mr-2">
                      <button
                        @click="mobileTopBar = !mobileTopBar"
                        type="button" 
                        class="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span class="sr-only">Close main menu</span>
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
                    <div class="px-2 pt-2 pb-3 space-y-1 text-gray-700 dark:text-gray-200" role="none">
                      <topbar-link v-for="entry in navbar" :to="entry.path" :name="entry.name" :sidebar="entry.sidebar ? true: false">{{entry.label}}</topbar-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- tob bar for desktop/tablet -->
            <div class="hidden md:flex border-b-1 border-gray-300 h-10 px-6 py-2">
                <topbar-link v-for="entry in navbar" :to="entry.path" :name="entry.name" :sidebar="entry.sidebar ? true: false">{{entry.label}}</topbar-link>
            </div>
        </header>
        <aside v-if="current?.sidebar" class="hidden md:flex md:w-64 md:flex-col md:absolute h-100">
          <div class="flex flex-col flex-grow pt-6 pl-8 overflow-y-auto">
            <h1 class="font-sans font-medium text-md mb-4">{{navbarEntry.label}}</h1>
            <sidebar-link v-for="entry in navbarEntry.sidebar" :to="entry.path" :name="entry.name">{{entry.label}}</sidebar-link>
          </div>
        </aside>
        <main
          :class=" current?.sidebar ? 'md:pl-64 md:pt-6 flex flex-col flex-1 h-100' : 'flex flex-col flex-1 h-100 p-4'"
          >
          <router-view />
        </main>
    </div>
</template>
<script setup>
  import logo from './components/logo.vue'
  import topbarLink from './components/navbar/topbar-link.vue'
  import sidebarLink from './components/navbar/sidebar-link.vue'
  import { inject, computed, watch, ref } from 'vue'
  import router from "#runtime/router"

  const { current, navbar } = inject('navigation')

  const mobileTopBar = ref(false)

  const navbarEntry = computed(
    () => {
        return navbar.filter(entry => entry.name === current.value.name)[0]
    }
  )

  router.beforeEach((to, from, next) => {
    mobileTopBar.value = false
    next()
  })
</script>