<template>
  <view class="order-detail-container">
    <view v-if="order" class="order-detail-content">
      <!-- 订单基本信息 -->
      <view class="section">
        <view class="section-title">订单信息</view>
        <view class="detail-item">
          <text class="label">订单号：</text>
          <text class="value">{{ order._id }}</text>
        </view>
        <view class="detail-item">
          <text class="label">订单状态：</text>
          <text class="value" :class="order.status">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="detail-item">
          <text class="label">下单时间：</text>
          <text class="value">{{ formatDate(order.created_at) }}</text>
        </view>
      </view>
      
      <!-- 收货地址 -->
      <view class="section">
        <view class="section-title">收货地址</view>
        <view class="detail-item">
          <text class="label">收货人：</text>
          <text class="value">{{ order.address.recipient }}</text>
        </view>
        <view class="detail-item">
          <text class="label">电话：</text>
          <text class="value">{{ order.address.phone }}</text>
        </view>
        <view class="detail-item">
          <text class="label">地址：</text>
          <text class="value">
            {{ order.address.province }}{{ order.address.city }}{{ order.address.district }}{{ order.address.detail }}
          </text>
        </view>
      </view>
      
      <!-- 订单商品 -->
      <view class="section">
        <view class="section-title">订单商品</view>
        <view v-for="item in order.items" :key="item.product_id" class="product-item">
          <text class="product-name">{{ item.name }}</text>
          <view class="product-bottom">
            <text class="qty">x{{ item.quantity }}</text>
            <text class="price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>
      
      <!-- 订单金额 -->
      <view class="section">
        <view class="detail-item">
          <text class="label">商品总额：</text>
          <text class="value">¥{{ calculateSubtotal() }}</text>
        </view>
        <view class="detail-item">
          <text class="label">运费：</text>
          <text class="value">¥0</text>
        </view>
        <view class="detail-item total">
          <text class="label">合计：</text>
          <text class="value">¥{{ order.total_price }}</text>
        </view>
      </view>
      
      <!-- 操作按钮 -->
      <view class="actions">
        <button v-if="order.status === 'pending'" class="btn primary" @click="handlePay">
          立即支付
        </button>
        <button v-if="order.status === 'shipped'" class="btn confirm" @click="handleConfirmDelivery">
          确认收货
        </button>
        <button class="btn secondary" @click="goBack">
          返回
        </button>
      </view>
    </view>
    
    <!-- 加载中 -->
    <view v-else class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'OrderDetail',
    data() {
      return {
        order: null,
        orderId: ''
      }
    },
    onLoad(options) {
      this.orderId = options.id
      this.loadOrderDetail()
    },
    methods: {
      async loadOrderDetail() {
        try {
          const res = await uniCloud.callFunction({
            name: 'order-detail',
            data: {
              order_id: this.orderId
            }
          })
          
          if (res.result.code === 0) {
            this.order = res.result.data
          }
        } catch (error) {
          console.error('加载订单详情失败:', error)
          uni.showToast({
            title: '加载失败',
            icon: 'none'
          })
        }
      },
      
      getStatusText(status) {
        const statusMap = {
          'pending': '待支付',
          'paid': '已支付',
          'shipped': '已发货',
          'delivered': '已收货'
        }
        return statusMap[status] || '未知'
      },
      
      formatDate(date) {
        if (!date) return ''
        const d = new Date(date)
        return d.toLocaleDateString('zh-CN')
      },
      
      calculateSubtotal() {
        if (!this.order || !this.order.items) return 0
        return this.order.items.reduce((total, item) => {
          return total + (item.price * item.quantity)
        }, 0).toFixed(2)
      },
      
      handlePay() {
        uni.showToast({
          title: '支付功能开发中',
          icon: 'none'
        })
      },
      
      handleConfirmDelivery() {
        uni.showModal({
          title: '确认收货',
          content: '确认已收到商品吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showToast({
                title: '感谢您的购买',
                icon: 'success'
              })
            }
          }
        })
      },
      
      goBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-detail-container {
    background: #f5f5f5;
    min-height: 100vh;
    padding: 15rpx;
    padding-bottom: 120rpx;
  }
  
  .order-detail-content {
    padding-bottom: 20rpx;
  }
  
  .section {
    background: white;
    border-radius: 10rpx;
    padding: 15rpx;
    margin-bottom: 15rpx;
  }
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #e5e5e5;
    margin-bottom: 15rpx;
  }
  
  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10rpx 0;
    font-size: 24rpx;
  }
  
  .detail-item.total {
    border-top: 1rpx solid #e5e5e5;
    padding-top: 15rpx;
    margin-top: 10rpx;
  }
  
  .label {
    color: #666;
  }
  
  .value {
    color: #333;
    font-weight: bold;
  }
  
  .value.pending {
    color: #FF9800;
  }
  
  .value.paid {
    color: #0C5460;
  }
  
  .value.shipped {
    color: #0056B3;
  }
  
  .value.delivered {
    color: #155724;
  }
  
  .product-item {
    background: #f9f9f9;
    border-radius: 8rpx;
    padding: 12rpx;
    margin-bottom: 10rpx;
  }
  
  .product-name {
    display: block;
    font-size: 24rpx;
    color: #333;
    margin-bottom: 8rpx;
  }
  
  .product-bottom {
    display: flex;
    justify-content: space-between;
    font-size: 22rpx;
  }
  
  .qty {
    color: #999;
  }
  
  .price {
    color: #FF6B6B;
    font-weight: bold;
  }
  
  .actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 15rpx;
    display: flex;
    gap: 10rpx;
  }
  
  .btn {
    flex: 1;
    border: none;
    border-radius: 8rpx;
    padding: 15rpx;
    font-size: 24rpx;
    font-weight: bold;
  }
  
  .btn.primary {
    background: #007AFF;
    color: white;
  }
  
  .btn.confirm {
    background: #28a745;
    color: white;
  }
  
  .btn.secondary {
    background: #e5e5e5;
    color: #333;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
</style>