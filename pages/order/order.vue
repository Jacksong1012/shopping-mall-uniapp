<template>
  <view class="order-container">
    <!-- 订单列表 -->
    <view v-if="orders.length > 0" class="orders-list">
      <view v-for="order in orders" :key="order._id" class="order-card">
        <view class="order-header">
          <text class="order-id">订单号：{{ order._id }}</text>
          <text class="order-status" :class="order.status">{{ getStatusText(order.status) }}</text>
        </view>
        
        <view class="order-items">
          <view v-for="item in order.items" :key="item.product_id" class="order-item">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-qty">x{{ item.quantity }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
        </view>
        
        <view class="order-footer">
          <text class="total">合计：¥{{ order.total_price }}</text>
          <button class="detail-btn" @click="goToOrderDetail(order._id)">
            查看详情
          </button>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-else class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无订单</text>
      <navigator url="/pages/index/index" class="go-shopping-btn">
        去购物
      </navigator>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Order',
    data() {
      return {
        orders: []
      }
    },
    computed: {
      ...mapState({
        hasLogin: state => state.hasLogin,
        userInfo: state => state.userInfo
      })
    },
    onLoad() {
      this.loadOrders()
    },
    methods: {
      async loadOrders() {
        try {
          const res = await uniCloud.callFunction({
            name: 'order-list',
            data: {
              user_id: this.userInfo._id
            }
          })
          
          if (res.result.code === 0) {
            this.orders = res.result.data || []
          }
        } catch (error) {
          console.error('加载订单失败:', error)
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
      
      goToOrderDetail(orderId) {
        uni.navigateTo({
          url: `/pages/order-detail/order-detail?id=${orderId}`
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .order-container {
    padding: 10rpx;
    background: #f5f5f5;
    min-height: 100vh;
  }
  
  .orders-list {
    padding-top: 10rpx;
  }
  
  .order-card {
    background: white;
    border-radius: 10rpx;
    margin-bottom: 15rpx;
    padding: 15rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12rpx;
    padding-bottom: 10rpx;
    border-bottom: 1rpx solid #e5e5e5;
  }
  
  .order-id {
    font-size: 24rpx;
    color: #333;
    font-weight: bold;
  }
  
  .order-status {
    font-size: 22rpx;
    padding: 4rpx 10rpx;
    border-radius: 4rpx;
  }
  
  .order-status.pending {
    background: #FFF3CD;
    color: #FF9800;
  }
  
  .order-status.paid {
    background: #D1ECF1;
    color: #0C5460;
  }
  
  .order-status.shipped {
    background: #CCE5FF;
    color: #0056B3;
  }
  
  .order-status.delivered {
    background: #D4EDDA;
    color: #155724;
  }
  
  .order-items {
    margin-bottom: 12rpx;
  }
  
  .order-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8rpx 0;
    font-size: 24rpx;
    color: #666;
  }
  
  .item-name {
    flex: 1;
  }
  
  .item-qty {
    margin-right: 15rpx;
  }
  
  .item-price {
    color: #FF6B6B;
    font-weight: bold;
  }
  
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10rpx;
    border-top: 1rpx solid #e5e5e5;
  }
  
  .total {
    font-size: 26rpx;
    color: #FF6B6B;
    font-weight: bold;
  }
  
  .detail-btn {
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 4rpx;
    padding: 8rpx 15rpx;
    font-size: 22rpx;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }
  
  .empty-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
  }
  
  .go-shopping-btn {
    background: #007AFF;
    color: white;
    padding: 15rpx 40rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
  }
</style>