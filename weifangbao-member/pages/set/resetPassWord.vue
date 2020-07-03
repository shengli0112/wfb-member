<template>
	
	<view class="wrap">
		<view class="content">
			<view class="list">
				<text>旧密码</text>
				<input 
					type="number" 
					v-model="oldPw"
					maxlength="16"
					data-key="mobile"
					password="true"
					placeholder="请输入旧密码"
				/>
			</view>
			<view class="list">
				<text>新密码</text>
				<input 
					type="number" 
					v-model="newPw"
					maxlength="16"
					password="true"
					placeholder="请输入新密码"
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
				oldPw:'',
				newPw:'',
				mobile:'',
			}
		},
		onLoad:function(option){
			this.mobile=option.mobile;
		},
		methods: {
			confirm(){
					// 修改密码
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'member/changePassword',
					{mobile:this.mobile,oldPassword:this.oldPw,newPassword:this.newPw},
					{token: this.$store.state.userInfo.token.token}	
				).then((data) => {
					// console.log(data)
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
		background: #fff;
		text{
			width: 180upx;
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

