import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hasLogin: false,
    userInfo: {},
    cart: []
  },
  
  mutations: {
    login(state) {
      state.hasLogin = true
    },
    
    logout(state) {
      state.hasLogin = false
      state.userInfo = {}
      state.cart = []
    },
    
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    
    addToCart(state, product) {
      const existItem = state.cart.find(item => item._id === product._id)
      if (existItem) {
        existItem.quantity += 1
      } else {
        state.cart.push(product)
      }
    },
    
    removeFromCart(state, productId) {
      state.cart = state.cart.filter(item => item._id !== productId)
    },
    
    updateCartItemQuantity(state, { _id, change }) {
      const item = state.cart.find(item => item._id === _id)
      if (item) {
        item.quantity += change
        if (item.quantity <= 0) {
          state.cart = state.cart.filter(item => item._id !== _id)
        }
      }
    },
    
    clearCart(state) {
      state.cart = []
    }
  },
  
  actions: {
    // 异步登录
    async login({ commit }, credentials) {
      try {
        const res = await uniCloud.callFunction({
          name: 'user-login',
          data: credentials
        })
        
        if (res.result.code === 0) {
          commit('setUserInfo', res.result.data)
          commit('login')
          return res.result.data
        } else {
          throw new Error(res.result.message)
        }
      } catch (error) {
        console.error('登录失败:', error)
        throw error
      }
    },
    
    // 异步注册
    async register({ commit }, credentials) {
      try {
        const res = await uniCloud.callFunction({
          name: 'user-register',
          data: credentials
        })
        
        if (res.result.code === 0) {
          return res.result.data
        } else {
          throw new Error(res.result.message)
        }
      } catch (error) {
        console.error('注册失败:', error)
        throw error
      }
    }
  }
})

export default store