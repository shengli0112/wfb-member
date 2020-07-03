<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" @click="tabClick(0),tabCurrentIndex=0" :class="{current: tabCurrentIndex === 0}">全部</view>
			<view class="nav-item" @click="tabClick(2),tabCurrentIndex=2" :class="{current: tabCurrentIndex === 2}">进行中</view>
			<view class="nav-item" @click="tabClick(3),tabCurrentIndex=3" :class="{current: tabCurrentIndex === 3}">成功</view>
			<view class="nav-item" @click="tabClick(4),tabCurrentIndex=4" :class="{current: tabCurrentIndex === 4}">失败</view>
		</view>
		<view class="orderBox">
			<view class="orderList" v-for="(val,index) in orderList" :key='index'>
					<view class="stateImg">
						<image src="../../static/image/cg.png" mode="" v-if="val.groupOrderStatus==3"></image>
						<image src="../../static/image/jxz.png" mode="" v-if="val.groupOrderStatus==2"></image>
						<image src="../../static/image/shibai.png" mode="" v-if="val.groupOrderStatus==4"></image>
					</view>
					<view class="orderContent" >
						<view class="contentLeft">
							<image :src="val.mainPicture" mode=""></image>
						</view>
						<view class="contentRight">
							<view class="contentTitle">{{val.goodsSpuName}}</view>
							<view class="specifications">{{val.goodsSpecName}}</view>
							<view class="rightBottom">
								<text>¥{{val.goodsGroupPrice}}</text>
								<text class="num">{{val.groupPersonNum}}人团</text>
							</view>
						</view>
					</view>
				
				<view class="orderBtn" >
					<view class="cancle" v-if="val.groupOrderStatus==3" @click="goDetail(val.orderId)">订单详情</view>
					<view class="cancle" @click="navToGroup(val.id)">拼团详情</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	import empty from "@/components/empty";
	export default {
		components: {
			uniLoadMore,
			empty
		},
		data() {
			return {
				page: 1, //请求页数
				tabCurrentIndex: 0,
				reasonIndex:0,
				isShow:false,
				orderList: [],
				id:'',//未发货 申请退款 子级id
				storeId:'',//未发货 申请退款 店铺id
				orderAmount:'',//未发货 退款金额
				loadingType: 'more', //加载更多状态
				backNum:1,//返回层级
			};
		},
		onShow() {
			this.page=1;
		},
		onLoad(options) {
			this.getData(this.tabCurrentIndex)
		},
		onBackPress(options) {  
			if (options.from === 'navigateBack') {  
		        return false;  
		    }  
			uni.navigateBack({
				delta:this.backNum
			});
			return true;  
		}, 
		  //加载更多
		onReachBottom(){
		// this.loadData();
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		this.getData(this.tabCurrentIndex)
    },
		methods: {
			// 去参团
			navToGroup(id){
				uni.navigateTo({
					url:'/pages/group/groupDetail?id='+id
				})
			},
			goDetail(id) {
				// console.log(id);
				uni.navigateTo({
					url: '/pages/order/orderDetail?id='+id
				})
			},
			getData(status) {
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + '/group/groupordermember/page',
					{'page': this.page,'limit': 10,'groupOrderStatus': status},
					{
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
					if(this.page!=1){
						if(data.list!=null){
							for(var i=0;i<data.list.length;i++){
								this.orderList.push(data.list[i]);
							}
						}
						
					}else{
						this.orderList = data.list;
					}
				})
			},
			//顶部tab点击
			tabClick(index) {
				this.page=1;
				this.tabCurrentIndex=index;
				this.getData(this.tabCurrentIndex);
				
			},
			// 立即支付
			pay(id,orderAmount){
				 uni.navigateTo({
				  url: '/pages/money/pay?orderAmount='+orderAmount+'&masterOrderId='+id,
				})
			},
			//修改订单状态
			changeOrderStatus(id,status) {
				uni.showLoading({
					title: '请稍后'
				})
					this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + '/orders/order/changeOrderStatus',
					{'id':id,'orderStatus':status},
					{token: this.$store.state.userInfo.token.token}
				).then((data) => {
					uni.hideLoading();
					if(this.tabCurrentIndex==3){
						let index='2,3';
						this.getData(index);
					}else if(this.tabCurrentIndex==6){
						let index='5,6'
						this.getData(index);
					}else{
						this.getData(this.tabCurrentIndex);
					}
					
				})
			},

		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
		height: 100%;
	}
	
	.cancleOrder{
		position: fixed;
		bottom: 0;
		width: 100%;
		background: #fff;
		z-index: 10;
		padding:0 30upx;
		.cancleTitle{
			font-size: 34upx;
			display: flex;
			align-items: center;
			padding: 30upx 0;
			justify-content: space-between;
			image{
				width: 36upx;
				height: 36upx;
			}
		}
		.cancleList{
			display: flex;
			align-items: center;
			padding: 30upx 0;
			justify-content: space-between;
			font-size: 28upx;
			border-top: 1upx solid #E8E8E8;
			image{
				width: 36upx;
				height: 36upx;
			}
		}
		.cancleBtn{
			width: 676upx;
			background: #F05161;
			margin: 30upx auto;
			height: 100upx;
			line-height: 100upx;
			text-align: center;
			border-radius: 50upx;
			font-size: 32upx;
			color: #fff;
		}
	}
	.navbar {
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .06);
		position: relative;
		z-index: 10;

		.nav-item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid $base-color;
				}
			}
		}
	}

	.orderList {
		margin: 20upx;
		padding: 0 20upx;
		font-size: 28upx;
		background: #fff;
		border-radius: 20upx;
		position: relative;
		.stateImg{
			position: absolute;
			z-index: 10;
			right: 20upx;
			top: 20upx;
			width: 108upx;
			height: 108upx;
			image{
				width: 108upx;
				height: 108upx;
			}
		}
		.shopName {
			padding: 20upx 0;
			border-bottom: 1upx solid #E8E8E8;
			display: flex;
			align-items: center;
			position: relative;

			image {
				width: 32upx;
				height: 32upx;
			}

			.state {
				color: #F05161;
				position: absolute;
				right: 0;
			}
		}

		.orderContent {
			display: flex;
			align-items: center;
			padding: 30upx 0;
			border-bottom: 1upx solid #E8E8E8;

			.contentLeft {
				width: 180upx;
				height: 180upx;

				image {
					width: 180upx;
					height: 180upx;
				}
			}

			.contentRight {
				width: 470upx;
				margin-left: 10upx;

				.contentTitle {
					font-size: 28upx;
					color: #333;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					margin-bottom: 25upx;
				}

				.specifications {
					display: inline;
					padding: 0 10upx;
					border-radius: 10upx;
					font-size: 20upx;
					color: #999999;
					// margin: 10upx 0;
					// background: #F5F5F5;
				}

				.rightBottom {
					margin-top: 20upx;
					color: #E64241;
					font-size: 36upx;
					display: flex;
					align-items: center;
					.num {
						display: inline-block;
						margin-left: 10upx;
						padding:0 10upx;
						background: #F05161;
						font-size: 24upx;
						color: #FFFFFF;
					}
				}
			}
		}

		.orderSum {
			padding: 20upx 0;
			font-size: 24upx;
			color: #333;
			border-bottom: 1upx solid #E8E8E8;

			.price {
				float: right;
			}
		}

		.orderBtn {
			// padding: 20upx 0;
			display: flex;
			flex-direction: row-reverse;

			view {
				width: 180upx;
				height: 64upx;
				line-height: 64upx;
				text-align: center;
				font-size: 24upx;
				border-radius: 32upx;
				margin: 20upx 0;
				margin-left: 30upx;
			}

			.cancle {
				color: #333;
				border: 1upx solid #333333;
			}

		}
	}
</style>
