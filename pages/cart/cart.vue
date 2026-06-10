<template>
  <view class="cart-container">
    <view v-if="cartItems.length > 0" class="cart-content">
      <!-- 购物车商品列表 -->
      <view class="cart-items">
        <view v-for="item in cartItems" :key="item._id" class="cart-item">
          <view class="item-image">
            <image :src="item.image" mode="aspectFill" />
          </view>
          <view class="item-info">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-price">¥{{ item.price }}</text>
          </view>
          <view class="item-quantity">
            <button @click="decreaseQuantity(item._id)" class="qty-btn">-</button>
            <text class="qty-value">{{ item.quantity }}</text>
            <button @click="increaseQuantity(item._id)" class="qty-btn">+</button>
          </view>
          <button @click="removeFromCart(item._id)" class="remove-btn">删除</button>
        </view>
      </view>
      
      <!-- 购物车底部 -->
      <view class="cart-footer">
        <view class="total-price">
          <text class="label">合计:</text>
          <text class="price">¥{{ totalPrice }}</text>
        </view>
        <button class="checkout-btn" @click="handleCheckout">
          结账 ({{ cartItems.length }})
        </button>
      </view>
    </view>
    
    <!-- 空购物车 -->
    <view v-else class="empty-cart">
      <text class="empty-icon">🛒</text>
      <text class="empty-text">购物车是空的</text>
      <navigator url="/pages/index/index" class="go-shopping-btn">
        去购物
      </navigator>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Cart',
    data() {
      return {}
    },
    computed: {
      ...mapState({
        cartItems: state => state.cart || []
      }),
      totalPrice() {
        return this.cartItems.reduce((total, item) => {
          return total + (item.price * item.quantity)
        }, 0).toFixed(2)
      }
    },
    methods: {
      increaseQuantity(id) {
        this.$store.commit('updateCartItemQuantity', {
          _id: id,
          change: 1
        })
      },
      
      decreaseQuantity(id) {
        this.$store.commit('updateCartItemQuantity', {
          _id: id,
          change: -1
        })
      },
      
      removeFromCart(id) {
        this.$store.commit('removeFromCart', id)
        uni.showToast({
          title: '已删除',
          icon: 'success'
        })
      },
      
      handleCheckout() {
        uni.navigateTo({
          url: '/pages/order/order'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cart-container {
    min-height: 100vh;
    background: #f5f5f5;
  }
  
  .cart-content {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 10rpx;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    padding: 12rpx;
    gap: 12rpx;
  }
  
  .item-image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 8rpx;
    overflow: hidden;
  }
  
  .item-image image {
    width: 100%;
    height: 100%;
  }
  
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  
  .item-name {
    font-size: 26rpx;
    color: #333;
    margin-bottom: 5rpx;
  }
  
  .item-price {
    color: #FF6B6B;
    font-weight: bold;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 5rpx;
  }
  
  .qty-btn {
    width: 40rpx;
    height: 40rpx;
    border: 1rpx solid #e5e5e5;
    background: white;
    border-radius: 4rpx;
    font-size: 20rpx;
  }
  
  .qty-value {
    width: 30rpx;
    text-align: center;
  }
  
  .remove-btn {
    background: #FF6B6B;
    color: white;
    border: none;
    border-radius: 4rpx;
    padding: 8rpx 12rpx;
    font-size: 20rpx;
  }
  
  .cart-footer {
    background: white;
    padding: 20rpx;
    border-top: 1rpx solid #e5e5e5;
  }
  
  .total-price {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 15rpx;
    font-size: 28rpx;
  }
  
  .label {
    margin-right: 10rpx;
  }
  
  .price {
    color: #FF6B6B;
    font-weight: bold;
  }
  
  .checkout-btn {
    width: 100%;
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 8rpx;
    padding: 15rpx;
    font-size: 28rpx;
    font-weight: bold;
  }
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
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