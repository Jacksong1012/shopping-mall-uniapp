<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'App',
    data() {
      return {}
    },
    computed: {
      ...mapState({
        hasLogin: state => state.hasLogin,
        userInfo: state => state.userInfo
      })
    },
    onLaunch() {
      console.log('App Launch')
      // 检查登录状态
      let userInfo = uni.getStorageSync('userInfo')
      if (userInfo) {
        this.$store.commit('setUserInfo', userInfo)
        this.$store.commit('login')
      }
    },
    onShow() {
      console.log('App Show')
    },
    onHide() {
      console.log('App Hide')
    }
  }
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body,
  #app {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20rpx;
  }
</style>