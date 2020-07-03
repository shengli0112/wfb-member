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
		<button class="getCode" @click="getCode">获取验证码</button>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				mobile: '',
				url:this.$constant.API_HOME,
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
				this.$api.msg('获取验证码');
				this.$api.httpRequest(
					'POST',
					this.url+'/common/sendSmsCaptcha',
					{"ivId":0,"ivCode":0,"receiver":this.mobile,"opt":3},
					).then((data)=>{
				       console.log(data);
				});
				uni.navigateTo({
					url:"/pages/public/getCode?id=1&ph="+this.mobile
				})
			}
		},

	}
</script>
<style lang="scss">
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
	.getCode{
		width: 650upx;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background-color: #F05161;
		color: white;
		font-size: 32upx;
		border-radius: 50upx;
		margin: 248upx auto;
	}
</style>

