<template>
	<!-- <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="right-top-sign"></view> -->
	<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
	<!-- 	<view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="headImg">
        <image src="" mode=""></image>
      </view>
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input
            type="number"
            :value="mobile"
            placeholder="请输入手机号码"
            maxlength="11"
            data-key="mobile"
            @input="inputChange"
          />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input
            type="mobile"
            value=""
            placeholder="8-18位不含特殊字符的数字、字母组合"
            placeholder-class="input-empty"
            maxlength="20"
            password
            data-key="password"
            @input="inputChange"
            @confirm="toLogin"
          />
        </view>
      </view>
      <button class="confirm-btn" @click="toLogin" :disabled="logining">登录</button>
      <view class="forget-section">
        忘记密码?
      </view>
    </view>
    <view class="register-section">
      还没有账号?
      <text @click="toRegist">马上注册</text>
    </view>
  </view> -->
	<view class="wrap">
		<view class="headImg">
			<image src="../../static/image/logo.png" mode=""></image>
		</view>
		<view class="input-content">
			<view class="input-item">
				<text class="tit">账号</text>
				<input type="number" :value="mobile" placeholder="输入账号" maxlength="11" data-key="mobile" @input="inputChange" />
			</view>
			<view class="input-item">
				<text class="tit">密码</text>
				<input type="mobile" value="" placeholder="输入密码" placeholder-class="input-empty" maxlength="16" password data-key="password"
				 @input="inputChange" @confirm="toLogin" />
			</view>
		</view>
		<view class="loginBtn" @click="toLogin" :disabled="logining">登录</view>
		<view class="reg-for">
			<view class="register" @click="toRegist">注册新用户</view>
			<view class="forget" @click="toForget">忘记密码？</view>
		</view>

	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';

	export default {
		data() {
			return {
				mobile: '',
				password: '',
				logining: false,
				returnURL: 'http://mrthol.shop.ruitukeji.net/pages/user/user',
				returnBool:false,
			}
		},
		onLoad: function(option) {
			if (option.ph) {
				this.mobile = option.ph;
				this.returnBool=true;
			}
		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			toRegist() {
				this.$api.msg('去注册');
				uni.navigateTo({
					url: '/pages/public/register'
				})
			},
			toForget() {
				uni.navigateTo({
					url: '/pages/public/forget'
				})
			},
			toLogin() {
				if (!this.logining) {
					let url = this.$constant.API_HOME;
					this.$api.httpRequest(
						'POST',
						this.$constant.API_HOME + '/member/login', {
							"username": this.mobile,
							"password": this.password,
							"client": 1,
							"terminalId": 0
						}
					).then((data) => {
						console.log(data);
						this.$api.msg('登陆成功');
						// var myDate = new Date();
						// // this.time = myDate.getMinutes();
						// // console.log('time1   '+this.time)
						// // console.log(this.state.userInfo.token.expiresIn)
						// this.$store.state.time = myDate.getTime()+43000*1000;
						// uni.setStorage({//缓存用户登陆状态
						//   key: 'time',
						//   data: myDate.getTime()+43000*1000,
						// })
						// console.log(this.$store.state.time)
						// console.log(myDate.getTime())
						this.login(data);
						if(this.returnBool){
							uni.switchTab({
							  url: "/pages/user/user"
							})
						}else{
							uni.navigateBack({
								delta: 1
							});
						}
					
						// console.log(data.token.token)
						// this.$store.state.hasLogin=true;
						// this.$store.state.userInfo=data;
						// console.log(this.$store.state);
					});
				}
			},
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

	.headImg {
		width: 176upx;
		height: 176upx;
		border-radius: 50%;
		// background-color: #F4F4F4;
		margin: 22upx auto;
		text-align: center;

		image {
			width: 130upx;
			height: 130upx;
		}
	}

	.input-content {
		padding: 0 50upx;

	}

	.input-item {
		margin-bottom: 60upx;
		padding-bottom: 26upx;
		border-bottom: 1px solid #E7E9E8;

		.tit {
			font-size: 28upx;
		}

		input {
			font-size: 32upx;
			width: 100%;
			margin-top: 56upx;

		}
	}

	.loginBtn {
		width: 650upx;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		margin: 0 auto;
		background-color: #F05161;
		color: white;
		font-size: 32upx;
		border-radius: 50upx;
	}

	.reg-for {
		width: 650upx;
		margin: 58upx auto;
		color: #666666;
		font-size: 28upx;

		.register {
			float: left;
		}

		.forget {
			float: right;
		}
	}
</style>
<!-- <style lang='scss'>
	page{
		background: #fff;
	}
	.container{
		/* padding-top: 75px; */
		position:relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}
	.wrapper{
		position:relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}
	.back-btn{
		position:absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}
	.headImg{
		/* margin-top: 150px; */
		width: 176upx;
		height: 176upx;
		border-radius: 50%;
		background-color: #F4F4F4;
		margin: 0 auto;
	}
	
	.input-content{
		padding: 0 60upx;
	}
	.input-item{
		display:flex;
		flex-direction: column;
		align-items:flex-start;
		justify-content: center;
		padding: 0 30upx;
		background:$page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;
		&:last-child{
			margin-bottom: 0;
		}
		.tit{
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}
		input{
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}	
	}

	.confirm-btn{
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;
		&:after{
			border-radius: 100px;
		}
	}
	.forget-section{
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}
	.register-section{
		position:absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;
		text{
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}
</style> -->
