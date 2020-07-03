<template>
	
	<view class="wrap">
		<view class="one">输入验证码</view>
		<view class="two">验证码已发送至{{ph}}</view>
		<view class="three">
			<input 
				type="number" 
				:value="mobile" 
				maxlength="11"
				data-key="mobile"
				@input="inputChange"
			/>	
		</view>
		<view class="again" @click="againSend">重新发送</view>
		<button class="next" @click="next">下一步</button>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				mobile: '',
				id:'',
				ph:'',
				url:this.$constant.API_HOME,
			}
		},
		onLoad:function(option){
			// id==1忘记密码 id==2注册
			this.id=option.id;
			this.ph=option.ph;
		},
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			againSend(){
				this.$api.msg('重新发送');
			},
			next(){
				if(this.mobile==''){
					this.$api.msg('请输入验证码')
					return false;
				}
				this.$api.msg('下一步');
					// 验证码
					this.$api.httpRequest(
					'POST',
					this.url+'/member/checkCaptcha',
					{"mobile":this.ph,"captcha":this.mobile}
					).then((data)=>{
				       console.log(data);
					   uni.navigateTo({
					   	url:'/pages/public/resetPassWord?id='+this.id+'&ph='+this.ph+'&captcha='+this.mobile
					   })
				});
					
				
				
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
	.two,.again{
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
	.again{
		margin-top: 36upx;
	}
	.next{
		width: 650upx;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background-color: #F05161;
		color: white;
		font-size: 32upx;
		border-radius: 50upx;
		margin: 154upx auto;
	}
</style>

