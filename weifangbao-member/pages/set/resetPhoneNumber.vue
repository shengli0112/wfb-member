<template>
	
	<view class="wrap">
		<view class="content">
			<view class="list">
				<text>新手机号</text>
				<input 
					type="number" 
					v-model="newMobile"
					maxlength="16"
					data-key="mobile"
					placeholder="请输入新手机号"
				/>
				<view @click="getCode()">获取验证码</view>
			</view>
			<view class="list">
				<text>验证码</text>
				<input 
					type="number" 
					v-model="code"
					maxlength="16"
					placeholder="请输入验证码"
				/>
			</view>
		</view>
		<button class="confirm" @click="confirm">提交</button>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				oldMobile:'',
				newMobile:'',
				code:'',
			}
		},
		onLoad:function(option){
			this.oldMobile=option.mobile;
		},
		methods: {
			getCode(){
				if(this.oldMobile==this.newMobile){
					this.$api.msg('请输入新手机号！')
					return;
				}
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME+'/common/sendSmsCaptcha',
					{"ivId":0,"ivCode":0,"receiver":this.newMobile,"opt":5}
					).then((data)=>{
				       console.log(data);
				});
			},
			confirm(){
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'member/changeMobile',
					{newMobile:this.newMobile,captcha:this.code},
					{token: this.$store.state.userInfo.token.token}	
				).then((data) => {
					// console.log(data)
					this.$api.msg('修改成功')
				})	
				
				
			}
		},

	}
</script>
<style lang="scss">
	page{
		background: #F0F1F5;
		padding-bottom: 160upx;
	}
	.content{
		margin: 20upx 0;
	}
	.list{
		font-size: 32upx;
		padding: 20upx;
		border-bottom: 1upx solid #E8E8E8;
		display: flex;
		align-items: center;
		background: #fff;
		text{
			width: 150upx;
		}
		view{
			font-size: 24upx;
			color: #fff;
			background: #F05161;
			height: 50upx;
			line-height: 50upx;
			width: 180upx;
			text-align: center;
			border-radius: 25upx;
		}
	}
	.confirm{
		width: 690upx;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background-color: #F05161;
		color: white;
		font-size: 32upx;
		margin: 30upx auto;
	}
</style>

