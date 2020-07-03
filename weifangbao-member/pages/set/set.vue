<template>
	<view class="container">
		<view class="user" @click="navToUser" hover-class="cell-hover" :hover-stay-time="50">
			<view class="userInfo">
				<view class="userImg"><image :src="userInfo.avatar" mode=""></image></view>
				<view class="userName" v-if="isLogin">
					<text>{{userInfo.nickname}}</text>
					<text>ID {{userInfo.mobile}}</text>
				</view>
				<view class="login" v-else><text @click="navToLogin">登录/</text><text @click="navToRegister">注册</text></view>
			</view>
			<!-- <text class="cell-tit">个人资料</text> -->
			<text class="cell-more yticon icon-you"></text>
		</view>
	<!-- 	<view class="list-cell b-b" @click="navToAdress" hover-class="cell-hover" :hover-stay-time="50">
			<text class="cell-tit">地址管理</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<!-- <view class="list-cell"  hover-class="cell-hover" :hover-stay-time="50" @click="navToAmend()">
			<text class="cell-tit">安全中心</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		
		<!-- <view class="list-cell m-t">
			<text class="cell-tit">消息推送</text>
			<switch checked color="#fa436a" @change="switchChange" />
		</view> -->
		<!-- <view class="list-cell m-t b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToOpinion">
			<text class="cell-tit">意见反馈</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToAbout">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<!-- <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToStatement">
			<text class="cell-tit">平台声明</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<!-- <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="call()">
			<text class="cell-tit">客服电话</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<!-- <view class="list-cell">
			<text class="cell-tit">检查更新</text>
			<text class="cell-tip">当前版本 1.0.3</text>
			<text class="cell-more yticon icon-you"></text>
		</view> -->
		<view class="list-cell log-out-btn" @click="toLogout">
			<text class="cell-tit">退出登录</text>
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
				isLogin:false,
				userInfo:'',
        Tel:'',
			};
		},
		onShow(options) {
			// console.log(plus.runtime.version)
			if(this.$store.state.hasLogin){
				this.isLogin=true;
				this.$api.httpRequest(
				  'GET',
				  this.$constant.API_HOME+'/common/params/TEL',
				).then((data) => {
				  console.log(data)
          this.Tel=data;
				})
			}
      this.$api.httpRequest(
        'GET',
        this.$constant.API_HOME+'member/userInfo',
        {storeId:this.$constant.STORE_ID},
        {'token':this.$store.state.userInfo.token.token},
      ).then((data) => {
        this.userInfo=data;
      })
		},
		methods:{
			...mapMutations(['logout']),
      call(){
       uni.makePhoneCall({
           phoneNumber: this.Tel
       });
      },
			navToAdress(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/address/address'
					})
				}
				
			},
			navToLogin(){
				uni.navigateTo({
					url:'/pages/public/login'
				})
			},
			navToRegister(){
				uni.navigateTo({
					url:'/pages/public/register'
				})
			},
			navToUser(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/public/userInfo'
					})
				}
			},
			// 关于我们
			navToAbout(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/set/aboutXb'
					})
				}
			},
      // 平台声明
      navToStatement(){
      	if(!this.$store.state.hasLogin){
      		uni.navigateTo({
      			url:'/pages/public/login'
      		})
      	}else{
      		uni.navigateTo({
      			url:'/pages/set/statement'
      		})
      	}
      },
			// 意见反馈
			navToOpinion(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/set/opinion'
					})
				}
			},
			
			// 修改密码
			navToAmend(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/public/amend?mobile='+this.userInfo.mobile
					})
				}
			},
			//退出登录
			toLogout(){
				uni.showModal({
				    content: '确定要退出登录么',
				    success: (e)=>{
				    	if(e.confirm){
				    		this.logout();
				    		setTimeout(()=>{
				    			uni.navigateBack();
				    		}, 200)
				    	}
				    }
				});
			},
			//switch
			switchChange(e){
				let statusTip = e.detail.value ? '打开': '关闭';
				this.$api.msg(`${statusTip}消息推送`);
			},

		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.user{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 20upx 30upx;
		margin: 20upx 0;
		color: $font-color-light;
		.userInfo{
			display: flex;
			align-items: center;
			.userImg{
				width: 100upx;
				height: 100upx;
				image{
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
				}
			}
			.userName{
				display: flex;
				flex-direction: column;
				color: $font-color-dark;
				font-size: 28upx;
				margin-left: 20upx;
			}
			.login{
				font-size: 28upx;
				margin-left: 20upx;
				color: #333;
			}
		}
	}
	
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
