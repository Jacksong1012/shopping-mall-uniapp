<template>
  <view class="login-container">
    <view class="login-header">
      <text class="header-title">购物商城</text>
      <text class="header-subtitle">欢迎登录</text>
    </view>
    
    <form class="login-form" @submit="handleLogin">
      <view class="form-group">
        <text class="label">用户名</text>
        <input 
          v-model="form.username" 
          type="text" 
          placeholder="请输入用户名"
          class="input-field"
        />
      </view>
      
      <view class="form-group">
        <text class="label">密码</text>
        <input 
          v-model="form.password" 
          type="password" 
          placeholder="请输入密码"
          class="input-field"
        />
      </view>
      
      <button form-type="submit" class="login-btn">
        登 录
      </button>
    </form>
    
    <view class="login-footer">
      <text class="footer-text">还没有账号？</text>
      <navigator url="/pages/register/register" class="register-link">
        立即注册
      </navigator>
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'Login',
    data() {
      return {
        form: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    computed: {
      ...mapState({
        hasLogin: state => state.hasLogin
      })
    },
    onLoad() {
      if (this.hasLogin) {
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
    },
    methods: {
      ...mapMutations(['login', 'setUserInfo']),
      
      async handleLogin(e) {
        if (!this.form.username || !this.form.password) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        this.loading = true
        try {
          const res = await uniCloud.callFunction({
            name: 'user-login',
            data: {
              username: this.form.username,
              password: this.form.password
            }
          })
          
          if (res.result.code === 0) {
            uni.setStorageSync('userInfo', res.result.data)
            uni.setStorageSync('token', res.result.data._id)
            
            this.setUserInfo(res.result.data)
            this.login()
            
            uni.showToast({
              title: '登录成功',
              icon: 'success'
            })
            
            setTimeout(() => {
              uni.switchTab({
                url: '/pages/index/index'
              })
            }, 500)
          } else {
            uni.showToast({
              title: res.result.message || '登录失败',
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('登录错误:', error)
          uni.showToast({
            title: '登录错误，请检查网络',
            icon: 'none'
          })
        } finally {
          this.loading = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20rpx;
  }
  
  .login-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 20rpx 50rpx;
    color: white;
  }
  
  .header-title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .header-subtitle {
    font-size: 28rpx;
    opacity: 0.8;
  }
  
  .login-form {
    background: white;
    border-radius: 20rpx;
    padding: 40rpx;
    margin: 30rpx 0;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
  }
  
  .form-group {
    margin-bottom: 30rpx;
  }
  
  .label {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 12rpx;
    font-weight: 500;
  }
  
  .input-field {
    width: 100%;
    border: 2rpx solid #e5e5e5;
    border-radius: 10rpx;
    padding: 16rpx 20rpx;
    font-size: 26rpx;
    box-sizing: border-box;
    transition: border-color 0.3s;
  }
  
  .input-field:focus {
    border-color: #667eea;
  }
  
  .login-btn {
    width: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10rpx;
    padding: 18rpx;
    font-size: 28rpx;
    font-weight: bold;
    margin-top: 20rpx;
  }
  
  .login-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    color: white;
    font-size: 26rpx;
  }
  
  .register-link {
    color: white;
    text-decoration: underline;
  }
</style>