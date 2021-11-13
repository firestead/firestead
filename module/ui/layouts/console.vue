<template>
    <div class="console">
        <header>
            <div class="topbar">
                <div class="logo">
                  <img src="~firesteadUIAssets/FiresteadLogo.svg" alt="Logo Firestead">
                </div>
            </div>
            <div class="navbar"></div>
        </header>
        <main>
            <slot /> 
        </main>
    </div>
</template>
<style scoped>
  #header{
    overflow-wrap: break-word;
    word-wrap: break-word;
    color: #3c4257;
    font-size: 14px;
  }
  .topbar {
    background: #f7fafc;
    box-shadow: inset 0 -1px #e3e8ee;
    box-sizing: border-box;
    display: flex;
    height: 44px;
    padding: 0 25px 0 25px;
  }
  .logo img{
    height: 44px;
    padding: 8px;
  }
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