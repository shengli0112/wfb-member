<template>
	<view class="app">
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				payType: 1,
				orderInfo: {},
				orderAmount: 0,
				masterOrderId: '',
				payCode: 'wechat_pay',
				returnUrl: 'http://mrthol.shop.ruitukeji.net/pages/public/empty',
				isGroup: false,
				returnUrl1: '',
				code: '',
				logInfo:'',
				isSucess:false,
				state:0,
			};
		},
		onLoad(options) {
			if(options.code){
				this.code=options.code;
				this.state=options.state;
				if(options.state==1){
					this.loginCode();
				}else{
					this.getOpenId();
				}
			}else{
				this.confirm();
			}
			
		},
		methods: {
			//获取code
			confirm() {
				// if (this.code == '') {
					this.$api.httpRequest(
						'GET',
						this.$constant.API_HOME + 'pay/wxAuthUrl', {
							storeId: this.$constant.STORE_ID,
							returnUrl: this.returnUrl,
							scope: 'snsapi_base',
							state: '1'
						}
					).then((data) => {
						console.log(data)
						location.href = data
					});
				// }
			},
			loginCode(){
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'member/mp/login/code', {
						storeId: this.$constant.STORE_ID,
						terminal: 1,
						code: this.code,
						state: '1'
					}
				).then((data) => {
					console.log(data)
				this.$store.commit('login', data)
				uni.switchTab({
					url:'/pages/index/index'
				})
				});
			},
			// 获取openId
			getOpenId() {
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'member/mp/login/openId', {
						code: this.code,
						storeId: this.$constant.STORE_ID
					}
				).then((data) => {
					console.log(data);
				uni.setStorage({//缓存用户openId
				  key: 'openId',
				  data: data,
				})
					console.log(!this.$store.state.isAuthorization)
					if(this.state==2){
						this.$store.state.openId=data;
						uni.switchTab({
						  url: "/pages/index/index?code="+this.code
						})
						// return false;
					}
					// this.$api.httpRequest(
					// 	'POST',
					// 	this.$constant.API_HOME + 'member/mp/login/bindMobile', {
					// 		payCode: this.payCode,
					// 		tradeType: 'JSAPI_FWH',
					// 		orderId: this.masterOrderId,
					// 		openId: data,
					// 		returnUrl: this.returnUrl,
					// 		storeId: this.$constant.STORE_ID
					// 	}
					// ).then((data) => {
					// 	console.log(data)
					//    this.onBridgeReady(data);
					// });
				});
			},
	},	watch: {
			'$store.state.isAuthorization': function() {
				// alert(this.$store.state.isAuthorization)
				uni.setStorage({//缓存用户登陆状态
				  key: 'state',
				  data: 2,
				})
				if(!this.$store.state.isAuthorization){
					this.$api.httpRequest(
						'GET',
						this.$constant.API_HOME + 'pay/wxAuthUrl', {
							storeId: this.$constant.STORE_ID,
							returnUrl: this.returnUrl,
							scope: 'snsapi_base',
							state: '2'
						}
					).then((data) => {
						console.log(data)
						location.href = data
					});
				}
				
				
				// 
				// if(!this.$store.state.isAuthorization){
				// 	uni.switchTab({
				// 	  url: "/pages/index/index?code="+this.code
				// 	})
				// }
				// 回到首页 传入code 弹出授权框
				console.log(this.$store.state.isAuthorization)
			
			}
		}}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}
</style>
