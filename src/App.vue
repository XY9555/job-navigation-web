<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 清理之前的登录状态，确保从登录页开始
    // 如果需要保持登录状态，可以注释掉下面两行
    localStorage.removeItem('userToken')
    localStorage.removeItem('userInfo')
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
}
</style>



