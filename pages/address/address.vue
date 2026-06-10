<template>
  <view class="address-container">
    <!-- 地址列表 -->
    <view class="address-list">
      <view v-if="addresses.length > 0">
        <view 
          v-for="address in addresses" 
          :key="address._id" 
          class="address-item"
          :class="{ active: address.is_default }"
        >
          <view class="address-header">
            <text class="recipient">{{ address.recipient }}</text>
            <text class="phone">{{ address.phone }}</text>
            <view v-if="address.is_default" class="default-badge">默认</view>
          </view>
          
          <text class="address-text">
            {{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}
          </text>
          
          <view class="address-actions">
            <button class="edit-btn" @click="editAddress(address)">编辑</button>
            <button class="delete-btn" @click="deleteAddress(address._id)">删除</button>
            <button v-if="!address.is_default" class="default-btn" @click="setDefault(address._id)">设为默认</button>
          </view>
        </view>
      </view>
      
      <view v-else class="empty-state">
        <text class="empty-icon">📭</text>
        <text class="empty-text">还没有地址</text>
      </view>
    </view>
    
    <!-- 添加地址按钮 -->
    <view class="add-btn-wrapper">
      <button class="add-btn" @click="showAddressForm = true">
        + 添加新地址
      </button>
    </view>
    
    <!-- 地址表单弹窗 -->
    <view v-if="showAddressForm" class="modal-mask" @click="showAddressForm = false">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ editingId ? '编辑地址' : '添加地址' }}</text>
          <text class="close-btn" @click="showAddressForm = false">✕</text>
        </view>
        
        <form class="address-form">
          <view class="form-group">
            <text class="label">收货人</text>
            <input v-model="form.recipient" type="text" placeholder="请输入收货人名字" class="input" />
          </view>
          
          <view class="form-group">
            <text class="label">电话</text>
            <input v-model="form.phone" type="tel" placeholder="请输入电话号码" class="input" />
          </view>
          
          <view class="form-group">
            <text class="label">省份</text>
            <input v-model="form.province" type="text" placeholder="请输入省份" class="input" />
          </view>
          
          <view class="form-group">
            <text class="label">城市</text>
            <input v-model="form.city" type="text" placeholder="请输入城市" class="input" />
          </view>
          
          <view class="form-group">
            <text class="label">区县</text>
            <input v-model="form.district" type="text" placeholder="请输入区县" class="input" />
          </view>
          
          <view class="form-group">
            <text class="label">详细地址</text>
            <input v-model="form.detail" type="text" placeholder="请输入详细地址" class="input" />
          </view>
          
          <button class="submit-btn" @click="saveAddress">
            {{ editingId ? '更新' : '添加' }}
          </button>
        </form>
      </view>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Address',
    data() {
      return {
        addresses: [],
        showAddressForm: false,
        editingId: null,
        form: {
          recipient: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          detail: ''
        }
      }
    },
    computed: {
      ...mapState({
        userInfo: state => state.userInfo
      })
    },
    onLoad() {
      this.loadAddresses()
    },
    methods: {
      async loadAddresses() {
        try {
          const res = await uniCloud.callFunction({
            name: 'address-list',
            data: {
              user_id: this.userInfo._id
            }
          })
          
          if (res.result.code === 0) {
            this.addresses = res.result.data || []
          }
        } catch (error) {
          console.error('加载地址失败:', error)
        }
      },
      
      editAddress(address) {
        this.editingId = address._id
        this.form = {
          recipient: address.recipient,
          phone: address.phone,
          province: address.province,
          city: address.city,
          district: address.district,
          detail: address.detail
        }
        this.showAddressForm = true
      },
      
      async saveAddress() {
        if (!this.form.recipient || !this.form.phone || !this.form.detail) {
          uni.showToast({
            title: '请填写完整信息',
            icon: 'none'
          })
          return
        }
        
        try {
          const functionName = this.editingId ? 'address-update' : 'address-add'
          const data = {
            user_id: this.userInfo._id,
            ...this.form
          }
          
          if (this.editingId) {
            data.address_id = this.editingId
          }
          
          const res = await uniCloud.callFunction({
            name: functionName,
            data
          })
          
          if (res.result.code === 0) {
            uni.showToast({
              title: this.editingId ? '更新成功' : '添加成功',
              icon: 'success'
            })
            
            this.showAddressForm = false
            this.editingId = null
            this.resetForm()
            this.loadAddresses()
          }
        } catch (error) {
          console.error('保存失败:', error)
          uni.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      },
      
      async deleteAddress(id) {
        uni.showModal({
          title: '删除地址',
          content: '确定要删除这个地址吗？',
          success: async (res) => {
            if (res.confirm) {
              try {
                const result = await uniCloud.callFunction({
                  name: 'address-delete',
                  data: {
                    address_id: id,
                    user_id: this.userInfo._id
                  }
                })
                
                if (result.result.code === 0) {
                  uni.showToast({
                    title: '删除成功',
                    icon: 'success'
                  })
                  this.loadAddresses()
                }
              } catch (error) {
                console.error('删除失败:', error)
              }
            }
          }
        })
      },
      
      async setDefault(id) {
        try {
          const res = await uniCloud.callFunction({
            name: 'address-update',
            data: {
              address_id: id,
              user_id: this.userInfo._id,
              is_default: true
            }
          })
          
          if (res.result.code === 0) {
            this.loadAddresses()
          }
        } catch (error) {
          console.error('设置失败:', error)
        }
      },
      
      resetForm() {
        this.form = {
          recipient: '',
          phone: '',
          province: '',
          city: '',
          district: '',
          detail: ''
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .address-container {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100rpx;
  }
  
  .address-list {
    padding: 10rpx;
  }
  
  .address-item {
    background: white;
    border-radius: 10rpx;
    margin-bottom: 15rpx;
    padding: 15rpx;
    border-left: 4rpx solid #e5e5e5;
  }
  
  .address-item.active {
    border-left-color: #007AFF;
    background: #f0f8ff;
  }
  
  .address-header {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
    gap: 10rpx;
  }
  
  .recipient {
    font-weight: bold;
    font-size: 26rpx;
  }
  
  .phone {
    color: #666;
    font-size: 24rpx;
  }
  
  .default-badge {
    background: #007AFF;
    color: white;
    padding: 4rpx 10rpx;
    border-radius: 4rpx;
    font-size: 20rpx;
  }
  
  .address-text {
    display: block;
    color: #666;
    font-size: 24rpx;
    margin-bottom: 10rpx;
    line-height: 1.5;
  }
  
  .address-actions {
    display: flex;
    gap: 8rpx;
    flex-wrap: wrap;
  }
  
  .edit-btn,
  .delete-btn,
  .default-btn {
    flex: 1;
    min-width: 80rpx;
    padding: 8rpx 12rpx;
    border-radius: 4rpx;
    font-size: 20rpx;
    border: none;
  }
  
  .edit-btn {
    background: #007AFF;
    color: white;
  }
  
  .delete-btn {
    background: #FF6B6B;
    color: white;
  }
  
  .default-btn {
    background: #FFA500;
    color: white;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 20rpx;
  }
  
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    color: #999;
    font-size: 26rpx;
  }
  
  .add-btn-wrapper {
    position: fixed;
    bottom: 20rpx;
    left: 20rpx;
    right: 20rpx;
  }
  
  .add-btn {
    width: 100%;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 15rpx;
    font-size: 28rpx;
    font-weight: bold;
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
    max-height: 80vh;
    overflow-y: auto;
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
  
  .address-form {
    margin-bottom: 20rpx;
  }
  
  .form-group {
    margin-bottom: 15rpx;
  }
  
  .label {
    display: block;
    font-size: 24rpx;
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
  
  .submit-btn {
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