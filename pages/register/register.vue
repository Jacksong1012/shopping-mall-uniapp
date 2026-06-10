<template>
  <view class="register-container">
    <view class="register-header">
      <text class="header-title">创建账户</text>
      <text class="header-subtitle">加入购物商城</text>
    </view>
    
    <form class="register-form" @submit="handleRegister">
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
        <text class="label">邮箱</text>
        <input 
          v-model="form.email" 
          type="email" 
          placeholder="请输入邮箱"
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
      
      <view class="form-group">
        <text class="label">确认密码</text>
        <input 
          v-model="form.confirmPassword" 
          type="password" 
          placeholder="请再次输入密码"
          class="input-field"
        />
      </view>
      
      <button form-type="submit" class="register-btn">
        注 册
      </button>
    </form>
    
    <view class="register-footer">
      <text class="footer-text">已有账号？</text>
      <navigator url="/pages/login/login" class="login-link">
        立即登录
      </navigator>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        form: {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        },
        loading: false
      }
    },
    methods: {
      async handleRegister(e) {
        if (!this.form.username || !this.form.email || !this.form.password) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        if (this.form.password !== this.form.confirmPassword) {
          uni.showToast({
            title: '两次输入的密码不一致',
            icon: 'none'
          })
          return
        }
        
        if (this.form.password.length < 6) {
          uni.showToast({
            title: '密码长度不能少于6位',
            icon: 'none'
          })
          return
        }
        
        this.loading = true
        try {
          const res = await uniCloud.callFunction({
            name: 'user-register',
            data: {
              username: this.form.username,
              email: this.form.email,
              password: this.form.password
            }
          })
          
          if (res.result.code === 0) {
            uni.showToast({
              title: '注册成功，请登录',
              icon: 'success'
            })
            
            setTimeout(() => {
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }, 500)
          } else {
            uni.showToast({
              title: res.result.message || '注册失败',
              icon: 'none'
            })
          }
        } catch (error) {
          console.error('注册错误:', error)
          uni.showToast({
            title: '注册错误，请检查网络',
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
  .register-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20rpx;
  }
  
  .register-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 20rpx 40rpx;
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
  
  .register-form {
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
  }
  
  .register-btn {
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
  
  .register-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    color: white;
    font-size: 26rpx;
  }
  
  .login-link {
    color: white;
    text-decoration: underline;
  }
</style>