<template>
  <view class="category-container">
    <!-- 左侧分类菜单 -->
    <view class="category-menu">
      <view 
        v-for="(category, index) in categories" 
        :key="index"
        class="menu-item"
        :class="{ active: activeCategory === index }"
        @click="selectCategory(index)"
      >
        {{ category }}
      </view>
    </view>
    
    <!-- 右侧商品列表 -->
    <view class="products-section">
      <view class="section-header">
        <text class="section-title">{{ categories[activeCategory] }}</text>
        <view class="filter-btns">
          <button 
            class="filter-btn"
            :class="{ active: sortBy === 'default' }"
            @click="changeSortBy('default')"
          >
            默认
          </button>
          <button 
            class="filter-btn"
            :class="{ active: sortBy === 'price' }"
            @click="changeSortBy('price')"
          >
            价格
          </button>
        </view>
      </view>
      
      <view class="products-list">
        <view 
          v-for="product in filteredProducts" 
          :key="product._id" 
          class="product-item"
          @click="goToProductDetail(product)"
        >
          <image :src="product.image" class="product-img" mode="aspectFill" />
          <view class="product-details">
            <text class="product-name">{{ product.name }}</text>
            <text class="product-desc">{{ product.description }}</text>
            <view class="product-bottom">
              <text class="product-price">¥{{ product.price }}</text>
              <button 
                class="add-btn" 
                size="mini"
                @click.stop="addToCart(product)"
              >
                加入
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: 'Category',
    data() {
      return {
        activeCategory: 0,
        sortBy: 'default',
        categories: ['手机', '电脑', '服装', '食品', '图书'],
        products: [
          { _id: '1', name: 'iPhone 14', description: '最新款苹果手机', price: 8999, image: 'https://via.placeholder.com/150', category: 0 },
          { _id: '2', name: 'iPhone 13', description: '上一代苹果手机', price: 6999, image: 'https://via.placeholder.com/150', category: 0 },
          { _id: '3', name: 'MacBook Pro', description: '专业级笔记本', price: 12999, image: 'https://via.placeholder.com/150', category: 1 },
          { _id: '4', name: 'T恤', description: '舒适棉质T恤', price: 99, image: 'https://via.placeholder.com/150', category: 2 },
          { _id: '5', name: '图书', description: '精选图书', price: 39, image: 'https://via.placeholder.com/150', category: 4 }
        ]
      }
    },
    computed: {
      filteredProducts() {
        let filtered = this.products.filter(p => p.category === this.activeCategory)
        
        if (this.sortBy === 'price') {
          filtered.sort((a, b) => a.price - b.price)
        }
        
        return filtered
      }
    },
    methods: {
      selectCategory(index) {
        this.activeCategory = index
      },
      
      changeSortBy(type) {
        this.sortBy = type
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
          icon: 'success'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .category-container {
    display: flex;
    height: 100vh;
  }
  
  .category-menu {
    width: 180rpx;
    background: #f5f5f5;
    border-right: 1rpx solid #e5e5e5;
    overflow-y: auto;
  }
  
  .menu-item {
    padding: 20rpx;
    font-size: 26rpx;
    text-align: center;
    border-left: 4rpx solid transparent;
  }
  
  .menu-item.active {
    background: white;
    border-left-color: #007AFF;
    color: #007AFF;
  }
  
  .products-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15rpx 20rpx;
    background: white;
    border-bottom: 1rpx solid #e5e5e5;
  }
  
  .section-title {
    font-size: 28rpx;
    font-weight: bold;
  }
  
  .filter-btns {
    display: flex;
    gap: 10rpx;
  }
  
  .filter-btn {
    background: #f5f5f5;
    border: 1rpx solid #e5e5e5;
    border-radius: 20rpx;
    padding: 8rpx 15rpx;
    font-size: 22rpx;
  }
  
  .filter-btn.active {
    background: #007AFF;
    color: white;
    border-color: #007AFF;
  }
  
  .products-list {
    flex: 1;
    padding: 10rpx;
  }
  
  .product-item {
    display: flex;
    background: white;
    border-radius: 10rpx;
    margin-bottom: 10rpx;
    padding: 12rpx;
    gap: 12rpx;
  }
  
  .product-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
  }
  
  .product-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .product-name {
    font-size: 26rpx;
    font-weight: bold;
    color: #333;
  }
  
  .product-desc {
    font-size: 22rpx;
    color: #999;
    margin-top: 5rpx;
  }
  
  .product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .product-price {
    color: #FF6B6B;
    font-weight: bold;
    font-size: 24rpx;
  }
  
  .add-btn {
    background: #007AFF;
    color: white;
    border: none;
    border-radius: 4rpx;
  }
</style>