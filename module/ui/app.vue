<template>
    <div class="console">
        <header>
            <div class="border-b-1 h-12 border-gray-300 bg-gray-100 px-6">
                <div class="p-1">
                  <SVGFiresteadLogo class="h-10 w-auto"></SVGFiresteadLogo>
                </div>
            </div>
            <div class="border-b-1 border-gray-300 h-10 px-6">
            </div>
        </header>
        <aside><!--TODO--></aside>
        <main>
            <router-view />
        </main>
    </div>
</template>
<script setup>
  import SVGFiresteadLogo from './assets/FiresteadLogo.svg'

</script>
<style scoped>
  .navbar {
    box-shadow: inset 0 -1px #e3e8ee;
    box-sizing: border-box;
    display: flex;
    height: 40px;
  }
  main{
    padding: 0 25px 0 25px;
  }
</style>