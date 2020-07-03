<template>
	<view class="wrap">
		<view class="titleBar">
			<text :class="{titleText: titleBar==1}" @click="titleBar=1,changeState()">待评价</text>
			<text :class="{titleText: titleBar==2}" @click="titleBar=2,changeState()">已评价</text>
		</view>
		<view class="content" v-for="(val,index) in orderList" :key='index' v-if="titleBar==1">
			<view class="contentBox" v-for="(val1,index1) in val.subList" :key='index1'>
				<view class="storeName">
					<image src="../../static/image/store.png" mode=""></image>
					<text>{{val.storeName}}</text>
				</view>
				<view class="goodsBox" v-for="(val2,index2) in val.goodsList" :key='index2'>
					<view class="goodsLeft">
						<image :src="val2.picUrl" mode=""></image>
					</view>
					<view class="goodsRight">
						<view class="goodsName">{{val2.goodsName}}</view>
						<view class="goodsKey">
							<text class="keyWrods">{{val2.specKeyName}}</text>
						</view>
						<view class="goodsPrice">￥{{val2.goodsPrice}}</view>
					</view>
					<text class="goodsNum">×{{val2.goodsNum}}</text>
				</view>
				<view class="evaButton" v-if="titleBar==1" @click="navToWriteEva(val1.id)">评价</view>
				<view class="evaButton" v-if="titleBar==2" @click="navToEvaDetail(val.id)">查看详情</view>
			</view>
		</view>
		<view class="content2" v-if="titleBar==2">
			<view class="contentBox" v-for="(val,index) in orderList" :key='index'>
				<view class="contentBoxTop">
					<view class="goodsImage">
						<image :src="val.picUrl" mode=""></image>
					</view>
					<view class="goodsName">
						{{val.goodsName}}
					</view>
				</view>
				<view class="evaButton" @click="navToEvaDetail(val.orderGoodsId,val.spuId)">查看评价</view>
			</view>
		</view>
		 <uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore,
		},
		data() {
			return {
				titleBar: 1, //1待评价 2已评价
				loadingType: 'more', //加载更多状态
				page: 1, //请求页数
				// status:5,//5待评价 6已评价
				orderList:[]
			};
		},

		onLoad(options) {
			this.getEvaList();
		},
		  //加载更多
		onReachBottom(){
		// this.loadData();
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		if(this.titleBar==1){
			this.getEvaList();
		}else{
			this.getHaveEvaList();
		}
		
    },


		methods: {
			getEvaList(){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + '/orders/order/page',
					{'page': this.page,'limit': 10,'orderStatus': 5},
					{token: this.$store.state.userInfo.token.token}	
				).then((data) => {
					this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
					if(this.page!=1){
						for(var i=0;i<data.list.length;i++){
							this.orderList.push(data.list[i]);
						}
					}else{
						this.orderList = data.list;
						// console.log(this.orderList[0].subList)
					}
					
					// data.list.length < 10 ? this.loadingType  ='nomore' : this.loadingType = 'more';
				})
			},
			getHaveEvaList(){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + '/orders/order/finOrderGoodsList',
					{'page': this.page,'limit': 10},
					{token: this.$store.state.userInfo.token.token}	
				).then((data) => {
					this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
					if(this.page!=1){
						for(var i=0;i<data.list.length;i++){
							this.orderList.push(data.list[i]);
						}
					}else{
						this.orderList = data.list;
					}
				})
			},
			changeState(){
				this.page=1;
				if(this.titleBar==1){
					this.getEvaList();
				}else{
					this.getHaveEvaList();
				}
				
			},
			// 去评价
			navToWriteEva(id){
				uni.navigateTo({
					url:'/pages/evaluation/writeEva?id='+id
				})
			},
			// 查看商品详情
			navToEvaDetail(orderGoodsId,spuId){
				uni.navigateTo({
					url:'/pages/evaluation/evaDetail?orderGoodsId='+orderGoodsId+'&spuId='+spuId
				})
			},
			stopPrevent() {},

		},
	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: $page-color-base;
		width: 100%;
		overflow-x: hidden;
	}

	.titleBar {
		background: #FFFFFF;
		display: flex;
		border-top: 2upx solid #E8E8E8;

		text {
			width: 50%;
			text-align: center;
			font-size: 30upx;
			padding: 26upx 0;
		}

		.titleText {
			color: #F05161;
			border-bottom: 4upx solid #F05161;
		}
	}

	.content {
		margin-top: 10upx;

		.contentBox {
			margin-bottom: 20upx;
			padding: 26upx 30upx;
			overflow: hidden;
			background: #FFFFFF;
		}

		.storeName {
			color: #333333;
			font-size: 28upx;
			display: flex;
			align-items: center;

			image {
				width: 32upx;
				height: 28upx;
			}
		}

		.goodsBox {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #E8E8E8;

			.goodsLeft {
				width: 120upx;
				height: 118upx;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.goodsRight {
				padding: 30upx;
				// margin-left: 10upx;
				.goodsName {
					// margin-left: 10upx;
					color: #333333;
					font-size: 28upx;
					width: 470upx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}

				.goodsKey {
					color: #999999;
					font-size: 24upx;

				}

				.goodsPrice {
					color: #333333;
					font-size: 28upx;
				}
			}

			.goodsNum {
				color: #999999;
				font-size: 24upx;
			}
		}

		.evaButton {
			border: 2upx solid #F05161;
			color: #F05161;
			width: 136upx;
			height: 58upx;
			line-height: 58upx;
			text-align: center;
			font-size: 24upx;
			border-radius: 29upx;
			float: right;
			margin-top: 24upx;
		}
	}
	.content2{
		margin-top: 10upx;
		.contentBox{
			padding: 26upx 30upx;
			overflow: hidden;
			background: #FFFFFF;
			border-bottom: 2upx solid #F5F5F5;
		}
		.contentBoxTop{
			display: flex;
			color: #333333;
			font-size: 28upx;
			.goodsImage{
				width: 120upx;
				height: 118upx;
				margin-right: 10upx;
				image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.evaButton {
			border: 2upx solid #F05161;
			color: #F05161;
			width: 148upx;
			height: 50upx;
			line-height: 50upx;
			text-align: center;
			font-size: 24upx;
			border-radius: 29upx;
			float: right;
		}
	}
</style>
