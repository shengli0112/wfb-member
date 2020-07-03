<template>
	
	<view class="wrap">
		<view class="one" >{{message}}</view>
		<view class="two">请设置您的密码方便以后登录</view>
		<view class="three">
			<input 
				type="number" 
				:value="mobile" 
				maxlength="16"
				data-key="mobile"
				@input="inputChange"
				password="true"
			/>
		</view>
		<view class="four">密码长度8～16位</view>
		<view class="two">请输入邀请码</view>
		<view class="three">
			<input 
				type="number" 
				:value="inviteCode" 
				data-key="inviteCode"
				@input="inputChange"
			/>
		</view>
		<button class="confirm" @click="confirm">确认</button>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				mobile: '',
				id:'',
				message:'',
				ph:'',//手机号
				captcha:'',//验证码
				url:this.$constant.API_HOME,
				inviteCode:'',//邀请码
			}
		},
		onLoad:function(option){
			// id==1忘记密码 id==2注册
			this.id=option.id;
			if(this.id==1){
				this.message='设置新密码';
			}else if(this.id==2){
				this.message='设置登录密码';
			}
			this.ph=option.ph;
			this.captcha=option.captcha;
		},
		methods: {
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			confirm(){
				// this.$api.msg('确认');
				if(this.mobile==''){
					this.$api.msg('请输入密码')
					return false;
				}
				if(this.id==1){
					// 修改密码
					this.$api.httpRequest(
					'POST',
					this.url+'/member/changePasswordBycaptcha',
					{"mobile":this.ph,"newPassword":this.mobile,"captcha":this.captcha}
					).then((data)=>{
						console.log(data);
						// this.$api.msg('修改成功')
						uni.navigateTo({
							url:'/pages/public/login?ph='+this.ph
						})
					});
				}else if(this.id==2){
					// 注册
						this.$api.httpRequest(
						'POST',
						this.url+'/member/register',
						{"mobile":this.ph,"captcha":this.captcha,"password":this.mobile,"client":1,inviteCode:this.inviteCode==''?null:this.inviteCode}
						).then((data)=>{
					       console.log(data);
						   // this.$api.msg('注册成功')
									uni.navigateTo({
										url:'/pages/public/login?ph='+this.ph
									})
					});
				}
			}
		},

	}
</script>
<style lang="scss">
	.one{
		height: 80upx;
		color: #555555;
		font-size: 56upx;
		margin: 72upx 0 50upx 50upx;
	}
	.two,.four{
		margin-left: 50upx;
		color: #666;
		font-size: 28upx;
	}
	.four{
		color: #ccc;
	}
	.three{
		width: 650upx;
		margin: 0 auto;
		border-bottom: 1px solid #E7E9E8;
		padding: 26upx 0;
		// margin-top: 35upx;
		input{
			color: #333333;
			font-size: 32upx;
		}
	}
	.four{
		// margin-top: 76upx;
		margin-bottom: 20upx;
	}
	.confirm{
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

