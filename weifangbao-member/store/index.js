import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isRealAuth:0,
    hasLogin: false,
    userInfo: {},
				isAuthorization: true,
				isFirst:true,
				time:0,
				openId:'',
  },
  mutations: {
    login (state,provider) {
      // console.log('mutations login provider =',provider);
      this.state.hasLogin = true;
      this.state.userInfo = provider;
      this.isRealAuth=provider.isRealAuth;
      uni.setStorage({//缓存用户登陆状态
        key: 'userInfo',
        data: this.state.userInfo,
      })
      //console.log(this.state.hasLogin);
    },
    logout (state) {
      state.hasLogin = false;
      state.userInfo = {};
      uni.removeStorage({
        key: 'userInfo'
      })
      console.log('退出登录')
    }
  },
  actions: {}
})

export default store
