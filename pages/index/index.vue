<template>
  <view class="home-container">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input-wrapper">
        <input 
          v-model="searchKey" 
          type="text" 
          placeholder="搜索商品..."
          class="search-input"
          @confirm="handleSearch"
        />
        <text class="search-icon">🔍</text>
      </view>
    </view>
    
    <!-- 轮播图 -->
    <swiper 
      class="banner-swiper"
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="500"
    >
      <swiper-item v-for="(item, index) in banners" :key="index">
        <image :src="item" class="banner-image" mode="aspectFill" />
      </swiper-item>
    </swiper>
    
    <!-- 分类导航 -->
    <view class="category-nav">
      <view 
        v-for="(cat, index) in categories" 
        :key="index" 
        class="category-item"
        @click="goToCategory(cat)"
      >
        <view class="category-icon">{{ cat.icon }}</view>
        <text class="category-name">{{ cat.name }}</text>
      </view>
    </view>
    
    <!-- 推荐商品 -->
    <view class="section-header">
      <text class="section-title">热门推荐</text>
      <navigator url="/pages/category/category" class="view-more">更多 ></navigator>
    </view>
    
    <view class="products-grid">
      <view 
        v-for="product in products" 
        :key="product._id" 
        class="product-card"
        @click="goToProductDetail(product)"
      >
        <image :src="product.image" class="product-image" mode="aspectFill" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <view class="product-footer">
            <text class="product-price">¥{{ product.price }}</text>
            <button 
              class="add-cart-btn" 
              size="mini"
              @click.stop="addToCart(product)"
            >
              加入购物车
            </button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载更多 -->
    <uni-load-more v-if="loading" status="loading" />
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Index',
    data() {
      return {
        searchKey: '',
        banners: [
          'https://via.placeholder.com/750x300?text=Banner+1',
          'https://via.placeholder.com/750x300?text=Banner+2',
          'https://via.placeholder.com/750x300?text=Banner+3'
        ],
        categories: [
          { name: '手机', icon: '📱' },
          { name: '电脑', icon: '💻' },
          { name: '服装', icon: '👕' },
          { name: '食品', icon: '🍔' },
          { name: '图书', icon: '📚' }
        ],
        products: [],
        loading: false
      }
    },
    computed: {
      ...mapState({
        hasLogin: state => state.hasLogin,
        userInfo: state => state.userInfo
      })
    },
    onLoad() {
      this.loadProducts()
    },
    onShow() {
      // 检查登录状态
      if (!this.hasLogin) {
        uni.navigateTo({
          url: '/pages/login/login'
        })
      }
    },
    methods: {
      async loadProducts() {
        this.loading = true
        try {
          const res = await uniCloud.callFunction({
            name: 'product-list',
            data: {
              limit: 10,
              skip: 0
            }
          })
          
          if (res.result.code === 0) {
            this.products = res.result.data
          }
        } catch (error) {
          console.error('加载商品失败:', error)
          uni.showToast({
            title: '加载失败',
            icon: 'none'
          })
        } finally {
          this.loading = false
        }
      },
      
      handleSearch() {
        if (this.searchKey.trim()) {
          uni.navigateTo({
            url: `/pages/category/category?search=${this.searchKey}`
          })
        }
      },
      
      goToCategory(category) {
        uni.navigateTo({
          url: `/pages/category/category?category=${category.name}`
        })
      },
      
      goToProductDetail(product) {
        uni.navigateTo({
          url: `/pages/product-detail/product-detail?id=${product._id}`
        })
      },
      
      addToCart(product) {
        this.$store.commit('addToCart', {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        })
        
        uni.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1000
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home-container {
    padding-bottom: 20rpx;
  }
  
  .search-bar {
    padding: 12rpx 20rpx;
    background: #007AFF;
  }
  
  .search-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .search-input {
    width: 100%;
    background: white;
    border-radius: 20rpx;
    padding: 10rpx 20rpx;
    font-size: 26rpx;
    padding-right: 50rpx;
  }
  
  .search-icon {
    position: absolute;
    right: 15rpx;
    font-size: 24rpx;
  }
  
  .banner-swiper {
    width: 100%;
    height: 300rpx;
    margin-top: 10rpx;
  }
  
  .banner-image {
    width: 100%;
    height: 100%;
  }
  
  .category-nav {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10rpx;
    padding: 20rpx;
    background: white;
  }
  
  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15rpx;
    border-radius: 10rpx;
    background: #f5f5f5;
  }
  
  .category-icon {
    font-size: 40rpx;
    margin-bottom: 5rpx;
  }
  
  .category-name {
    font-size: 22rpx;
    color: #333;
    text-align: center;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: white;
  }
  
  .section-title {
    font-size: 32rpx;
    font-weight: bold;
  }
  
  .view-more {
    color: #007AFF;
    font-size: 24rpx;
  }
  
  .products-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10rpx;
    padding: 10rpx;
    background: white;
  }
  
  .product-card {
    border-radius: 10rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: 200rpx;
  }
  
  .product-info {
    padding: 12rpx;
  }
  
  .product-name {
    display: block;
    font-size: 26rpx;
    color: #333;
    margin-bottom: 8rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .product-price {
    color: #FF6B6B;
    font-size: 28rpx;
    font-weight: bold;
  }
  
  .add-cart-btn {
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 5rpx;
    font-size: 20rpx;
    padding: 6rpx 10rpx;
  }
</style>