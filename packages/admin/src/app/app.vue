<template>
    <div class="admin">
        <header>
            <div class="flex justify-between border-b-1 h-12 border-gray-300 bg-gray-100 px-1 md:px-6">
                <div class="p-1">
                  <FiresteadLogo class="h-9 pt-1 w-20"></FiresteadLogo>
                </div>
                <div class="flex items-center md:hidden">
                  <!-- Mobile menu button -->
                  <button
                    @click="mobileTopbar = !mobileTopbar"
                    v-if="!mobileTopbar"
                    type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-400" aria-controls="mobile-menu" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                <!-- top bar for mobile, show/hide based on menu state. -->
                <div 
                  v-if="mobileTopbar"
                  class="absolute z-10 top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
                <div class="rounded-lg shadow-md bg-white dark:bg-gray-900 ring-1 ring-black ring-opacity-5 overflow-hidden">
                  <div class="px-5 pt-4 flex items-center justify-between">
                        <router-link 
                            to="/"
                            class="flex-shrink-0 flex items-center">
                            <FiresteadLogo class="block h-8 w-auto"></FiresteadLogo>
                        </router-link>
                    <div class="-mr-2">
                      <button
                        @click="mobileTopbar = !mobileTopbar"
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
                    <div class="flex flex-col px-2 pt-2 pb-3 space-y-1 text-gray-700 dark:text-gray-200 w-max" role="none">
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
            <!-- sidebar for mobile turns into breacumbs with menu -->
            <nav v-if="current?.sidebar" class="flex md:hidden p-2 border-b-1 border-gray-300" aria-label="Aside">
              <ol role="list" class="flex items-center space-x-4">
                <li class="relative inline-block">
                    <a @click="mobileSidebar = !mobileSidebar" class="flex items-center hover:text-gray-500 border-1 bg-gray-100 rounded-full px-3 py-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      <span class="ml-1 text-xs font-medium text-gray-500 hover:text-gray-700">{{current.topbar.label}}</span>
                    </a>
                    <div v-if="mobileSidebar" class="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                      <div class="flex flex-col py-1" role="none">
                        <sidebar-link v-for="entry in current.topbar.sidebar" :to="entry.path" :name="entry.name">{{entry.label}}</sidebar-link>
                      </div>
                    </div>
                </li>

                <li>
                  <div class="flex items-center">
                    <!-- Heroicon name: solid/chevron-right -->
                    <svg class="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <router-link :to="current.sidebar.path" class="ml-2 text-xs font-medium text-gray-500 hover:text-gray-700">{{current.sidebar.label}}</router-link>
                  </div>
                </li>
              </ol>
            </nav>
        </header>
        <!-- sidebar for desktop/tablet as aside menu -->
        <aside v-if="current?.sidebar" class="hidden md:flex md:w-64 md:flex-col md:absolute h-100">
          <div class="flex flex-col flex-grow pt-6 pl-8 overflow-y-auto">
            <h1 class="font-sans font-medium text-md mb-4">{{current.topbar.label}}</h1>
            <sidebar-link v-for="entry in current.topbar.sidebar" :to="entry.path" :name="entry.name">{{entry.label}}</sidebar-link>
          </div>
        </aside>
        <!-- main content of app -->
        <main
          :class=" current?.sidebar ? 'md:pl-60 flex flex-col flex-1 h-screen' : 'flex flex-col flex-1 h-screen p-4'"
          >
          <router-view />
        </main>
    </div>
</template>
<script setup>
  import router from "#runtime/router"
  import FiresteadLogo from '#assets/firestead/logo-lettering.svg'

  const { current, navbar } = inject('navigation')

  const mobileTopbar = ref(false)
  const mobileSidebar = ref(false)

  router.beforeEach((to, from, next) => {
    mobileTopbar.value = false
    mobileSidebar.value = false
    next()
  })
</script>