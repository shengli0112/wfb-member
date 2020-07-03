<template name='page-phLogin'>
	<view class="phLogin" v-if="isShow">
		<view class="box">
				<view class="inpBox">
					<input
					  type="number"
					  :value="mobile"
					  placeholder="请输入手机号码"
					  maxlength="11"
					  data-key="mobile"
							@input="inputChange"
					/>
				</view>
				<view class="inpBox inpBox2">
					<input
					  type="number"
					  :value="captcha"
					  placeholder="请输入验证码"
					  data-key="captcha"
							@input="inputChange"
							class="captchaInput"
					/>
					<text class="getCode" @click="getCode">{{msg}}</text>
				</view>
					<view class="btn" @click="login">登录</view>
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
		name:'page-phLogin',
		data () {
		  return {
		    isShow:true,
						msg:'获取验证码',
						mobile:'',
						captcha:''
						// btn:1
		  }
		},
		methods:{
			inputChange(e){
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
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
		getCode(){
			var timer=60;
			var _this=this;
			_this.msg='获取验证码'+timer+'s';
			var countdown=setInterval(function(){
				timer-=1;
				_this.msg='获取验证码'+timer+'s';
				if(timer<=0){
					clearInterval(countdown);
					_this.msg='获取验证码'
				}
			},1000)
			
			
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME+'/common/sendSmsCaptcha',
					{"ivId":0,"ivCode":0,"receiver":this.mobile,"opt":6}
					).then((data)=>{
				    console.log(data);
								clearInterval(countdown);
								this.msg='获取验证码'
				});
		},
		login(){
			console.log(this.mobile)
			console.log(this.captcha)
			this.$api.httpRequest(
				'POST',
				this.$constant.API_HOME+'member/mp/login/bindMobile',
				{"storeId":this.$constant.STORE_ID,"terminal":1,"openId":this.$store.state.openId,"mobile":this.mobile,"captcha":this.captcha}
				).then((data)=>{
			    console.log(data);
							this.$store.commit('login', data)
							this.isShow=false;
			});
		},
		}
	}
</script>

<style>
	.phLogin{
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
		padding: 30upx 40upx;
		border-radius: 20upx;
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
	.inpBox{
		border-bottom:1upx solid #303133 ;
		padding: 10upx;
		margin: 20upx auto;
		display: flex;
		justify-content: space-between;
		text-align: left;
	}
	.btn{
		width: 350upx;
		background: #E02020;
		margin: 50upx auto 20upx;
		height: 68upx;
		line-height:68upx;
		color: #FFFFFF;
		font-size: 28upx;
		border-radius: 34upx;
	}
	.inpBox2{
		
	}
	.getCode{
		color: #E02020;
		font-size:24upx;
		width: 200upx;
		display: inline-block;
		text-align: right;
	}
	.captchaInput{
		display: inline-block;
		width: 300upx;
	}
</style>
