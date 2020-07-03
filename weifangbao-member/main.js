import Vue from 'vue'
import store from './store'
import App from './App'
import constant from './constant'
import sunUiBasic from './components/sunui-upimg/sunui-upimg-basic.vue'
import Json from './Json' //测试用数据
import pageAuthorization from './components/login/authorization.vue'
import pageAdvertising from './components/advertising.vue'
import pagePhLogin from './components/login/phLogin.vue'
Vue.component('sunui-upbasic',sunUiBasic)
Vue.component('page-authorization',pageAuthorization)
Vue.component('page-dvertising',pageAdvertising)
Vue.component('page-phLogin',pagePhLogin)
/**
 *  因工具函数属于公司资产, 所以直接在Vue实例挂载几个常用的函数
 *  所有测试用数据均存放于根目录json.js
 *
 *  css部分使用了App.vue下的全局样式和iconfont图标，有需要图标库的可以留言。
 *  示例使用了uni.scss下的变量, 除变量外已尽量移除特有语法,可直接替换为其他预处理器使用
 */
const msg = (title, duration = 2500, mask = false, icon = 'none') => {
  //统一提示方便全局修改
  if (Boolean(title) === false) {
    return;
  }
  uni.showToast({
    title,
    duration,
    mask,
    icon
  });
}
const json = type => {
  //模拟异步请求数据
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(Json[type]);
    }, 500)
  })
}

const prePage = () => {
  let pages = getCurrentPages();
  let prePage = pages[pages.length - 2];
  // #ifdef H5
  return prePage;
  // #endif
  return prePage.$vm;
}
/** http 请求 */
const httpRequest = (method, url, data = null, headers = null) => {

  return new Promise((resolve, reject) => {
    //todo 显示loading
    // uni.showLoading({
    //   title: ''
    // });
    let option = {
      method: method,
      url: url,
      data: data,
      header: headers
    };
    uni.request(option).then((response) => {
      uni.hideLoading();
      // console.log('httpRequest then');
      let [errmsg, res] = response;
      if(errmsg){
        // console.log(errmsg.errMsg);
        msg(errmsg.errMsg);
        if ( typeof reject =='function'){
          reject(response);
        }
        return;
      }

  
      if ( !res || res.statusCode !== 200) {
        msg('网络异常请检查网络或稍后再试');
        if ( typeof reject =='function'){
          reject(response);
        }
        return;
      }
			
			if ( res && (res.data.code == 4013 || res.data.code == 4012)) {
				// #ifdef H5
				if(res.data.code==4012){
				// uni.navigateTo({
				// 	url:'/pages/public/empty'
				// })
				}
				let _this=this;
				 msg('正在重新登录！');
					httpRequest(
						  'POST',
						 constant.API_HOME+'member/refreshToken',
						  {'token':	store.state.userInfo.token.token},
						).then((data) => {
						  // console.log(data);
						  store.state.userInfo.token.token=data.token;
						 msg('登陆成功！')
						})
				// #endif
			 
			 
					// #ifdef MP-WEIXIN 
					store.commit('logout');
					let _this=this;
					uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							_this.$api.httpRequest(
								'POST',
								_this.$constant.API_HOME + 'member/miniapp/login/code', {
									storeId: _this.$constant.STORE_ID,
									code: loginRes.code,
									rawData: '',
									signature: '',
									encryptedData: '',
									iv: ''
								},
							).then((data) => {
								// 记录token有效期
								var myDate = new Date();
								uni.setStorage({//缓存用户登陆状态
								  key: 'time',
								  data: myDate.getTime()+43000*1000,
								})
								_this.$store.commit('login', data)
								// 登录成功 获取个人信息
								// _this.getUserInfo();
							})
						}
					});
						// #endif
			  return;
			}
			if ( res && res.data.code == 4017 ) {
			  // msg('未授权');
				store.state.isAuthorization=false;
			  return;
			}
      if ( !res || res.data.code !== 0) {
        msg(res.data.msg);
        if ( typeof reject =='function'){
          reject(response);
        }
        return;
      }
      resolve(res.data.data)
    }).catch((response) => {
      uni.hideLoading();
      // console.log('httpRequest catch');
      if ( typeof reject =='function'){
        reject(response);
      }
    }).finally(()=>{
      // console.log('httpRequest finally');
    });
  
		});
		if(store.state.userInfo.token.token){
			var myDate = new Date();
							const state =uni.getStorageSync('time');
			  if(myDate-state<1000*600){
						httpRequest(
							  'POST',
							 constant.API_HOME+'member/refreshToken',
							  {'token':	store.state.userInfo.token.token},
							).then((data) => {
							  // console.log(data);
							  store.state.userInfo.token.token=data.token;
									var myDate = new Date();
									uni.setStorage({//缓存用户登陆状态
									  key: 'time',
									  data: myDate.getTime()+43000*1000,
									})
									var userInfo = uni.getStorageSync('userInfo')
									userInfo.token.token=data.token;
									uni.setStorage({//缓存用户登陆状态
									  key: 'userInfo',
									  data: userInfo,
									})
							})
						}
		}

}


Vue.config.productionTip = false
Vue.prototype.$fire = new Vue();
Vue.prototype.$store = store;
Vue.prototype.$api = {msg, json, prePage, httpRequest};
Vue.prototype.$constant = constant;

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()