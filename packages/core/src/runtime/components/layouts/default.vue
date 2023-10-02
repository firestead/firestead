<template>
    <div>
      <!-- Static sidebar for desktop -->
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div class="flex h-16 p-4 shrink-0 items-center">
            <Logo class="h-12 w-auto" alt="Firestead"></Logo>
          </div>
          <nav class="flex flex-1 flex-col">
          </nav>
        </div>
      </div>
      <div class="lg:pl-72">
        <div class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
            <span class="sr-only">Open sidebar</span>
            <FsIcon name="i-heroicons-bars-4" class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Separator -->
          <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

          <slot name="headerbar">
            <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <form class="relative flex flex-1" action="#" method="GET">
                <label for="search-field" class="sr-only">Search</label>
                <FsIcon name="i-heroicons-magnifying-glass" class="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" aria-hidden="true" />
                <input id="search-field" class="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." type="search" name="search" />
              </form>
              <div class="flex items-center gap-x-4 lg:gap-x-6">
                <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
                  <span class="sr-only">View notifications</span>
                  <FsIcon name="i-heroicons-bell-20-solid" class="h-6 w-6" aria-hidden="true" />
                </button>

                <!-- Separator -->
                <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                <!-- Profile dropdown -->

              </div>
            </div>
          </slot>
        </div>
        <main>
            <slot />
        </main>
      </div>
  </div>
</template>