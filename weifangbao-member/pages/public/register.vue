<template>
	
	<view class="wrap">
		<view class="one">输入手机号</view>
		<view class="two">请输入注册的手机号，获取验证码</view>
		<view class="three">
			<input 
				type="number" 
				:value="mobile" 
				maxlength="11"
				data-key="mobile"
				@input="inputChange"
			/>	
		</view>
		<view class="four">点击下一步即代表您同意<text class="fourText" @click="goText">《仙宝用户注册协议》</text></view>
		<button class="getCode" @click="getCode">获取验证码</button>
		<view v-if="showWebView">
			<web-view  :src="webViewSrc"></web-view>
		</view>
	</view>


	
</template>

<script>
	
	export default{
		data(){
			return {
				mobile: '',
				url:this.$constant.API_HOME,
				showWebView:false,
				webViewSrc:''
			}
		},
		onLoad(){
			
		},
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			getCode(){
				if(this.mobile==''){
					this.$api.msg('请输入手机号')
					return false;
				}
				this.$api.msg('获取验证码');
				this.$api.httpRequest(
					'POST',
					this.url+'/common/sendSmsCaptcha',
					{"ivId":0,"ivCode":0,"receiver":this.mobile,"opt":1}
					).then((data)=>{
				       console.log(data);
					   uni.navigateTo({
					   	url:"/pages/public/getCode?id=2&ph="+this.mobile
					   })
				});
				
			},
			goText(){
				// uni.navigateTo({
				// 	url:'/pages/public/protocol'
				// })
				this.webViewSrc=this.$constant.API_OPEN_H5+'#/article_detail?id=1158946662119002113';
				this.showWebView=true;

				// Window.open()
			}
		},

	}
</script>
<style lang="scss">
	page,
	.wrap {
		weight: 100%;
		height: 100%;
		overflow: hidden;
		background-color: #fff;
	}
	.one{
		width: 280upx;
		height: 80upx;
		color: #555555;
		font-size: 56upx;
		margin: 72upx 420upx 50upx 50upx;
	}
	.two{
		margin-left: 50upx;
		color: #CCCCCC;
		font-size: 28upx;
	}
	.three{
		width: 650upx;
		margin: 0 auto;
		border-bottom: 1px solid #E7E9E8;
		padding: 26upx 0;
		margin-top: 50upx;
		input{
			color: #333333;
			font-size: 32upx;
		}
	}
	.four{
		margin-top: 76upx;
		font-size: 28upx;
		color: #CCCCCC;
		text-align: center;
		.fourText{
			color: #333333;
		}
	}
	.getCode{
		width: 650upx;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background-color: #F05161;
		color: white;
		font-size: 32upx;
		border-radius: 50upx;
		margin: 114upx auto;
	}
</style>

