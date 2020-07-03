<template>
	<view class="content">
		<view class="head">
			<view class="headLeft">
				<image :src="storeDetails.storeAvatar" mode=""></image>
			</view>
			<view class="headCenter">
				<view class="name">{{storeDetails.storeName}}</view>
				<view class="focus">{{storeDetails.collectNum}}人关注</view>
			</view>
			<view class="headRight">
				<!-- +收藏 -->
				<view class="right-top" @click="isCollection()" v-if="isShow==true">已收藏</view>
				<view class="right-top right-top2" @click="isCollection()" v-if="!isShow==true">+收藏</view>
				<view class="right-bottom">{{storeDetails.collectNum}}人关注</view>
			</view>
		</view>
		<view class="storeScore">
			<view class="store">商品评分 <text>7.7分</text></view>
			<view class="store">店铺评分 <text>7.7分</text></view>
			<view class="store">物流服务 <text>7.7分</text></view>
		</view>
		<view class="footer">
			<view class="footer-content service">联系客服 <image src="../../static/image/talk.png" mode=""></image></view>
			<view class="footer-content">店铺简介 <text>{{storeDetails.seoDescription}}</text></view>
			<view class="footer-content">开店时间 <text>2019-07-25</text></view>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				storeId:'',
				storeDetails:{},
				isShow:false,//是否收藏
				token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:'',
			};
		},
		onLoad(options){
			this.storeId = options.storeId;
				this.$api.httpRequest(
						'GET',
						this.$constant.API_HOME +'/store/store/'+this.storeId,
						 {token:this.token?this.token:''},
					).then((data) => {
						// console.log(data);
						this.storeDetails=data;
						if(data.isCollect==0){
							this.isShow=false;
						}else{
							this.isShow=true;
						}
						});
			
		},
		
		methods: {
			isCollection(){
				// console.log("1")
				// 是否收藏
					if(this.token==''){
					this.$api.msg('未登录');
					return false;
				}
				this.isShow=!this.isShow;
					this.$api.httpRequest(
						'POST',
						this.$constant.API_HOME+'store/storecollect',
						{storeId:this.storeId},
						 {token:this.token}
					).then((data) => {
				
						})
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	.head{
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #FFFFFF;
		border-top: 1upx solid #F0F1F5;
		padding: 14upx 30upx 20upx 30upx;
		.headLeft{
			width:88upx;
			height: 88upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.headCenter{
			color: #333333;
			width: 450upx;
			.name{
				font-size: 32upx;
			}
			.focus{
				font-size: 20upx;
				margin-top: 8upx;
			}
		}
		.headRight{
			// width: 120upx;
			// height: 48upx;
			// background: #F05161;
			// font-size: 20upx;
			// color: #FFFFFF;
			// text-align: center;
			// line-height: 48upx;
			// border-radius: 24upx;
			font-size: 20upx;
			text-align: center;
			.right-top{
			width: 120upx;
			height: 48upx;
			line-height: 48upx;
			border-radius: 24upx;
			background: #EEEEEE;
			color: #333333;
			}
			.right-top2{
				background: #F05161;
				color: #FFFFFF;
			}
			.right-bottom{
				color: #FFFFFF;
				margin-top: 10upx;
			}
		}
	}
	.storeScore{
		background: #FFFFFF;
		margin: 20upx 0;
		padding: 20upx 30upx;
		color: #333333;
		font-size: 28upx;
		.store{
			margin: 10upx 0;
			text{
				margin-left: 28upx;
			}
		}
	}
	.footer{
		background: #FFFFFF;
		padding:0 30upx;
		.footer-content:last-child{
			border-bottom: 0upx;
		}
		.footer-content{
			font-size: 28upx;
			color: #333333;
			padding: 30upx 0;
			border-bottom: 1upx solid #F0F1F5;
			text{
				margin-left: 28upx;
			}
		}
		
		.service{
			display: flex;
			align-items: center;
			justify-content: space-between;
			image{
				width: 32upx;
				height: 32upx;
				float: right;
			}
		}
	}
</style>
