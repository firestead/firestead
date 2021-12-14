<template>
    <div class="console">
        <header>
            <div class="border-b-1 h-12 border-gray-300 bg-gray-100 px-6">
                <div class="p-1">
                  <SVGFiresteadLogo class="h-9 pt-1 w-auto"></SVGFiresteadLogo>
                </div>
            </div>
            <div class="border-b-1 border-gray-300 h-10 px-6 py-2">
              <navbar></navbar>
            </div>
        </header>
        <sidebar-desktop class="hidden md:flex md:w-64 md:flex-col md:absolute h-100"></sidebar-desktop>
        <main class="md:pl-64 md:pt-6 flex flex-col flex-1 h-100">
          <router-view />
        </main>
    </div>
</template>
<script setup>
  import SVGFiresteadLogo from './assets/FiresteadLogo.svg'
  import navbar from './components/navbar.vue'
  import sidebarDesktop from './components/sidebar-desktop.vue'

</script>