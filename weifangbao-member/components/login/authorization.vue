<template name='page-authorization'>
	<view class="authorization" v-if="isShow">
		<view class="box">
			 <image class="alertImg" src="../../static/img/alert.png" mode=""></image>
			 <view class="one">为了给您更好的服务</br>请您登录</view>
			 <!-- <button v-if="btn==1" class="btn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">微信授权</button> -->
				<button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信手机号一键登录</button>
			 <!-- <view class="two">需要您主动授权</view> -->
			</view>
			<view class="delBtn">
				<image class="delImg" src="../../static/img/del.png" mode="" @click="cancle"></image>
			</view>
	</view>
</template>

<script>
	// import {
	//     mapState 
	// } from 'vuex'; 
	export default{
		name:'page-authorization',
    props:{
      inviteId:''
    },
		data () {
		  return {
		    isShow:true,
						msg:'为了给您更好的服务</br>请您登录',
						// btn:1
		  }
		},
		methods:{
			// ...mapMutations(['login']),
			cancle(){
				// this.isShow=false;
				this.$emit('isShow',false)
			},
			// wxGetUserInfo:function(res){
			// 	if (!res.detail.iv) {
			// 		uni.showToast({
			// 			title: "您取消了授权,登录失败",
			// 			icon: "none"
			// 		});
			// 		return false;
			// 	}
			// 	// this.isShow=false;
			// 	console.log('-------用户授权，并获取用户基本信息和加密数据------')
			// 	console.log(res.detail);
			// 	this.btn=2
			// 	this.msg='为了同步您的赛事信息需要获取您的手机号'
			// },
			getPhoneNumber (e) {
				this.$store.state.isShow=false;
				console.log(e)
				let _this=this;
				if(e.detail.errMsg=='getPhoneNumber:fail user deny'){
					uni.showToast({
								title: "您取消了授权,登录失败",
								icon: "none"
							});
							return false;
				}
				uni.login({
						provider: 'weixin',
						success: function(loginRes) {
							console.log(loginRes)
							_this.$api.httpRequest(
							  'POST',
							 _this.$constant.API_HOME+'member/miniapp/login/mobile',
							  {code:loginRes.code,rawData:'',signature:'',encryptedData:'',iv:'',mobileEncryptedData:e.detail.encryptedData,mobileIv:e.detail.iv,inviteId:_this.inviteId},
							).then((data) => {
								console.log(data)
								var myDate = new Date();
								_this.$store.state.time = myDate.getTime()+43000*1000;
								uni.setStorage({//缓存用户登陆状态
								  key: 'time',
								  data: myDate.getTime()+43000*1000,
								})
								_this.$store.commit('login', data)
								_this.$emit('isShow',false)
								uni.switchTab({
								url: '/pages/index/index'	
								})
							})
						},
						
					});
			 },
		}
	}
</script>

<style>
	.authorization{
		font-size: 28upx;
		width: 750upx;
		height: 2000upx;
		background: rgba(0,0,0,0.5);
		padding-top: 280upx;
		color: #333333;
	}
	.box{
		width: 596upx;
		background: #fff;
		margin: auto;
		text-align: center;
		padding: 74upx 0 56upx 0;
		border-radius: 20upx;
	}
	.alertImg{
		width: 144upx;
		height: 144upx;
	}
	.one{
		width: 280upx;
		margin: 54upx auto;
	}
	.btn{
		background: #E02020;
		border-radius: 44upx;
		width: 432upx;
		height: 88upx;
		text-align: center;
		color: #fff;
		font-size: 28upx;
		line-height: 88upx;
		margin: 38upx auto;
	}
	.delBtn{
		width: 80upx;
		height: 80upx;
		background: #fff;
		text-align: center;
		line-height: 80upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 40upx auto;
		border-radius: 50%;
	}
	.delImg{
		width: 48upx;
		height: 48upx;
	}
</style>
