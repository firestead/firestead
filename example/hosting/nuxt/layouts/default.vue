<template>
  <div class="demo">
      <header>
          <div class="border-b-1 h-12 border-gray-300 bg-gray-100 px-6">
              <div class="p-1">
                <img class="h-9 pt-1 w-auto" src="/FiresteadDemo.svg" />
              </div>
          </div>
          <div class="border-b-1 border-gray-300 h-10 px-6 py-2">
            <nav-topbar></nav-topbar>
          </div>
      </header>
      <main class="md:p-10 flex flex-col flex-1 h-100">
        <slot />
      </main>
  </div>
</template>