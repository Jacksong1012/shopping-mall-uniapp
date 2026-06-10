<template>
  <view class="user-container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="avatar-section">
        <image src="https://via.placeholder.com/120" class="avatar" mode="aspectFill" />
        <view class="user-info">
          <text class="username">{{ userInfo.username || '未登录' }}</text>
          <text class="email">{{ userInfo.email || '暂无邮箱' }}</text>
        </view>
      </view>
    </view>
    
    <!-- 菜单列表 -->
    <view class="menu-list">
      <view class="menu-item" @click="goToAddressManage">
        <text class="menu-icon">📍</text>
        <text class="menu-title">地址管理</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="showEditForm">
        <text class="menu-icon">✏️</text>
        <text class="menu-title">编辑信息</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="goToFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-title">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>
      
      <view class="menu-item" @click="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-title">退出登录</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
    
    <!-- 编辑表单 -->
    <view v-if="showForm" class="modal-mask" @click="showForm = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">编辑个人信息</text>
          <text class="close-btn" @click="showForm = false">✕</text>
        </view>
        
        <form class="edit-form">
          <view class="form-group">
            <text class="label">用户名</text>
            <input 
              v-model="editForm.username" 
              type="text" 
              placeholder="请输入用户名"
              class="input"
            />
          </view>
          
          <view class="form-group">
            <text class="label">邮箱</text>
            <input 
              v-model="editForm.email" 
              type="email" 
              placeholder="请输入邮箱"
              class="input"
            />
          </view>
          
          <view class="form-group">
            <text class="label">电话</text>
            <input 
              v-model="editForm.phone" 
              type="tel" 
              placeholder="请输入电话"
              class="input"
            />
          </view>
          
          <button class="save-btn" @click="saveUserInfo">
            保存修改
          </button>
        </form>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'User',
    data() {
      return {
        showForm: false,
        editForm: {
          username: '',
          email: '',
          phone: ''
        }
      }
    },
    computed: {
      ...mapState({
        hasLogin: state => state.hasLogin,
        userInfo: state => state.userInfo
      })
    },
    onLoad() {
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      ...mapMutations(['logout', 'setUserInfo']),
      
      goToAddressManage() {
        uni.navigateTo({
          url: '/pages/address/address'
        })
      },
      
      goToFavorites() {
        uni.showToast({
          title: '收藏功能开发中',
          icon: 'none'
        })
      },
      
      showEditForm() {
        this.editForm = {
          username: this.userInfo.username || '',
          email: this.userInfo.email || '',
          phone: this.userInfo.phone || ''
        }
        this.showForm = true
      },
      
      async saveUserInfo() {
        try {
          const res = await uniCloud.callFunction({
            name: 'user-info',
            data: {
              user_id: this.userInfo._id,
              ...this.editForm
            }
          })
          
          if (res.result.code === 0) {
            const updatedUserInfo = { ...this.userInfo, ...this.editForm }
            this.setUserInfo(updatedUserInfo)
            uni.setStorageSync('userInfo', updatedUserInfo)
            
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            })
            
            this.showForm = false
          }
        } catch (error) {
          console.error('保存失败:', error)
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      },
      
      handleLogout() {
        uni.showModal({
          title: '退出登录',
          content: '确定要退出登录吗？',
          confirmText: '确定',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.removeStorageSync('userInfo')
              uni.removeStorageSync('token')
              this.logout()
              
              uni.navigateTo({
                url: '/pages/login/login'
              })
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .user-container {
    background: #f5f5f5;
    min-height: 100vh;
  }
  
  .user-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30rpx 20rpx;
    border-radius: 0 0 20rpx 20rpx;
  }
  
  .avatar-section {
    display: flex;
    align-items: center;
    gap: 20rpx;
  }
  
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 3rpx solid white;
  }
  
  .user-info {
    display: flex;
    flex-direction: column;
  }
  
  .username {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 5rpx;
  }
  
  .email {
    font-size: 24rpx;
    opacity: 0.8;
  }
  
  .menu-list {
    margin-top: 20rpx;
  }
  
  .menu-item {
    background: white;
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 10rpx;
    border-radius: 10rpx;
    gap: 15rpx;
  }
  
  .menu-icon {
    font-size: 32rpx;
  }
  
  .menu-title {
    flex: 1;
    font-size: 28rpx;
    color: #333;
  }
  
  .menu-arrow {
    color: #999;
    font-size: 24rpx;
  }
  
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-end;
    z-index: 999;
  }
  
  .modal-content {
    width: 100%;
    background: white;
    border-radius: 20rpx 20rpx 0 0;
    padding: 20rpx;
    animation: slideUp 0.3s;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }
  
  .modal-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .close-btn {
    font-size: 32rpx;
    color: #999;
  }
  
  .edit-form {
    margin-bottom: 20rpx;
  }
  
  .form-group {
    margin-bottom: 20rpx;
  }
  
  .label {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 8rpx;
    font-weight: 500;
  }
  
  .input {
    width: 100%;
    border: 1rpx solid #e5e5e5;
    border-radius: 8rpx;
    padding: 12rpx 15rpx;
    font-size: 26rpx;
    box-sizing: border-box;
  }
  
  .save-btn {
    width: 100%;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 15rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
</style>