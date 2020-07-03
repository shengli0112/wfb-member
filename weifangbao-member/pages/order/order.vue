<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" @click="tabClick(1),tabCurrentIndex=1" :class="{current: tabCurrentIndex === 1}">已报备</view>
			<view class="nav-item" @click="tabClick(2),tabCurrentIndex=2" :class="{current: tabCurrentIndex === 2}">已看房</view>
			<view class="nav-item" @click="tabClick(3),tabCurrentIndex=3" :class="{current: tabCurrentIndex === 3}">已认购</view>
			<view class="nav-item" @click="tabClick(4),tabCurrentIndex=4" :class="{current: tabCurrentIndex === 4}">已签约</view>
			<view class="nav-item" @click="tabClick(5),tabCurrentIndex=5" :class="{current: tabCurrentIndex === 5}">已失效</view>
		</view>
		<view class="orderBox">
			<!-- <view class="orderList">
				<view class="listTop">
					<view class="topLeft">
						<view class="userImg"><image src="../../static/image/user2x.png" mode=""></image></view>
						<view class="userName">王健林</view>
						<view class="userPh">211121212121</view>
					</view>
					<view class="topRight">已看房</view>
				</view>
				<view class="listBottom">
					<view class="bottomLeft">
						<view class="listAddress">太湖花苑</view>
						<view class="listTime">明天 15:00</view>
					</view>
					<view class="bottomRight">2019-11-07 18:06</view>
				</view>
			</view> -->
			<view class="orderList" v-for="(val,index) in orderList" :key='index' @click="navToDetail(val.id)">
				<view class="listTop">
					<view class="topLeft">
						<view class="userImg"><image src="../../static/image/user2x.png" mode=""></image></view>
						<view class="userName">{{val.customerName}}</view>
						<view class="userPh">{{val.mobile}}</view>
					</view>
					<view class="topRight" v-if="val.status==1">已报备</view>
					<view class="topRight" v-if="val.status==2">已看房</view>
					<view class="topRight" v-if="val.status==3">已认购</view>
					<view class="topRight" v-if="val.status==4">已签约</view>
					<view class="topRight" v-if="val.status==5">已失效</view>
				</view>
				<view class="listBottom">
					<view class="bottomLeft">
						<view class="listAddress">{{val.propertyName}}</view>
						<view class="listTime" v-if="val.appointTimeName">{{val.appointTimeName}}</view>
					</view>
					<view class="bottomRight">{{val.createDate}}</view>
				</view>
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
		onBackPress(options) {
			if (options.from === 'navigateBack') {
				return false;
			}
			uni.switchTab({
			  url: "/pages/user/user"
			})
			return true;
		},
		onShow() {
			this.page=1;
			// if(this.tabCurrentIndex==3){
			// 	let index='2,3';
			// 	this.getData(index);
			// }else if(this.tabCurrentIndex==6){
			// 	let index='5,6'
			// 	this.getData(index);
			// }else{
			// 	this.getData(this.tabCurrentIndex);
			// }
		},
		onLoad(options) {
			if(options.backNum==2){
				this.backNum=2;
			}
			this.page=1;
			this.tabCurrentIndex = +options.state;
			console.log(this.tabCurrentIndex);
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
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		this.getData(this.tabCurrentIndex)
		
    },
		methods: {
			navToDetail(id) {
				uni.navigateTo({
					url: '/pages/order/orderDetail?id='+id
				})
			},
			getData(status) {
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + '/report/report/page',
					{
						'page': this.page,
						'limit': 10,
						'status':status
					},
					// {token:'5bf1baaae0334dfdbd71ec6a4ecc6c1b'}
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
				this.getData(index)
				// if(index==3){
				// 	index='2,3'
				// 	this.getData(index);
				// }else if(index==6){
				// 	index='5,6'
				// 	this.getData(index);
				// }else{
				// 	this.getData(index);
				// }
				// this.tabCurrentIndex = index;
				
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
	.mark{
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 2;
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
				color: #3171F2;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 44px;
					height: 0;
					border-bottom: 2px solid #3171F2;
				}
			}
		}
	}
// <view class="orderList">
// 				<view class="listTop">
// 					<view class="topLeft">
// 						<view class="userImg"><image src="../../static/image/user2x.png" mode=""></image></view>
// 						<view class="userName">王健林</view>
// 						<view class="userPh"></view>
// 					</view>
// 					<view class="topRight">已看房</view>
// 				</view>
// 				<view class="listBottom">
// 					<view class="bottomLeft">
// 						<view class="listAddress">太湖花苑</view>
// 						<view class="listTime">明天 15:00</view>
// 					</view>
// 					<view class="bottomRight">2019-11-07 18:06</view>
// 				</view>
// 			</view>
.orderList{
	padding:20upx 30upx;
	background: #fff;
	font-size: 28upx;
	.listTop,.listBottom{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 18upx auto;
	}
  .bottomRight{
    // width: 300upx;
  }
	border-top: 1upx solid #F8F8F8;
	.topLeft,.bottomLeft{
		display: flex;
    // width: 500upx;
		
	}
	.userImg{
		width: 32upx;
		height: 32upx;
		margin-right: 14upx;
		image{
			width: 32upx;
			height: 32upx;
		}
	}
	.userName,.listAddress{
		margin-right: 30upx;
	}
	
	.topRight{
		width: 80upx;
		height: 32upx;
		line-height: 32upx;
		text-align: center;
		font-size: 22upx;
		color: #fff;
		background: #FF965F;
		border-radius: 2upx;
	}
}
</style>
