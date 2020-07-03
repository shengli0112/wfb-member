<template>
	<view>
		<!-- 地址 -->
		<navigator url="/pages/address/address?source=1" class="address-section">
			<view class="order-content" v-if="addressData">
				<text class="yticon icon-shouhuodizhi"></text>
				<view class="cen">
					<view class="top">
						<text class="name">{{addressData.consignee}}</text>
						<text class="mobile">{{addressData.mobile}}</text>
					</view>
					<text class="address">{{addressData.location}}</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view v-else  class="addAddress">添加地址</view>
		</navigator>

		<view class="goods-section" v-for="(val,index) in orderList" :key='index'>
			<view class="g-header b-b" v-if="!isGroup">
				<image class="logo" src="../../static/image/store.png"></image>
				<text class="name">{{val.storeName}}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-for="(val1,index1) in val.cart_list" :key='index1' v-if="!isGroup">
				<image :src="val1.mainPicture"></image>
				<view class="right">
					<text class="title clamp" v-if="val1.goodsSpuName">{{val1.goodsSpuName}}</text>
					<text class="title clamp" v-if="val1.goodsName">{{val1.goodsName}}</text>
					<text class="spec">{{val1.goodsSpecValueNames}}</text>
					<view class="price-box">
						<text class="price" v-if="goodsType==1">￥{{val1.sellingPrice}}</text>
							<text class="price" v-if="goodsType==2">{{val1.sellingPrice}}积分</text>
						<text class="number">x {{val1.goodsNum}}</text>
					</view>
				</view>
			</view>
			<view class="g-header b-b"  v-if="isGroup">
				<image class="logo" src="../../static/image/store.png"></image>
				<text class="name">{{val.storeName}}</text>
			</view>
			<!-- 商品列表 -->
			<view class="g-item" v-if="isGroup">
				<image :src="val.mainPicture"></image>
				<view class="right">
					<text class="title clamp" v-if="val.goodsSpuName">{{val.goodsSpuName}}</text>
					<text class="title clamp" v-if="val.goodsName">{{val.goodsName}}</text>
					<text class="spec">{{val.goodsSpecValueNames}}</text>
					<view class="price-box">
						<text class="price">￥{{val.groupPrice}}</text>
						<text class="number">x {{val.goodsNum}}</text>
					</view>
				</view>
			</view>
			<view class="message">
				<text>留言</text>
				<input type="text" value="" v-model="desc[index]" placeholder="建议留言前跟商家沟通确认"/>
			</view>
		</view>
		<!-- 金额明细 -->
		<view class="yt-list">
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">商品金额</text>
				<text class="cell-tip" v-if="goodsType==1">￥{{goodsPrice}}</text>
				<text class="cell-tip" v-if="goodsType==2">{{goodsPrice}}积分</text>
			</view>
			<!-- <view class="yt-list-cell b-b">
				<text class="cell-tit clamp">优惠金额</text>
				<text class="cell-tip red">-￥35</text>
			</view> -->
			<view class="yt-list-cell b-b">
				<text class="cell-tit clamp">运费</text>
				<text class="cell-tip">{{shippingPrice}}</text>
			</view>
			<!-- <view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">备注</text>
				<input class="desc" type="text" v-model="desc" placeholder="请填写备注信息" placeholder-class="placeholder" />
			</view> -->
		</view>
		
		<!-- 底部 -->
		<view class="footer">
			<view class="price-content">
				<text class="price-left">实付款</text>
				<text class="price-tip" v-if="goodsType==1">￥</text>
				<text class="price" v-if="goodsType==1">{{allPrice}}</text>
				<!-- <text class="cell-tip">￥{{goodsPrice}}</text> -->
				<text class="price" v-if="goodsType==2">{{allPrice}}积分</text>
			</view>
			<text class="submit" @click="submit">提交订单</text>
		</view>
		
		<!-- 优惠券面板 -->
		<view class="mask" :class="maskState===0 ? 'none' : maskState===1 ? 'show' : ''" @click="toggleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 优惠券页面，仿mt -->
				<view class="coupon-item" v-for="(item,index) in couponList" :key="index">
					<view class="con">
						<view class="left">
							<text class="title">{{item.title}}</text>
							<text class="time">有效期至2019-06-30</text>
						</view>
						<view class="right">
							<text class="price">{{item.price}}</text>
							<text>满30可用</text>
						</view>
						
						<view class="circle l"></view>
						<view class="circle r"></view>
					</view>
					<text class="tips">限新用户使用</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				maskState: 0, //优惠券面板显示状态
				desc: [], //备注
				payType: 1, //1微信 2支付宝
				isGroup:false,
				couponList: [
					{
						title: '新用户专享优惠券',
						price: 5,
					},
					{
						title: '庆五一发一波优惠券',
						price: 10,
					},
					{
						title: '优惠券优惠券优惠券优惠券',
						price: 15,
					}
				],
				addressData: '',
				addressId:'',
				selectStoreId:[],//选中商品对应店铺id
				orderList:[],//订单商品列表
				goodsPrice:0,//商品金额
				shippingPrice:0,//运费
				allPrice:0,//实付金额
				remarkList:[],//备注列表
				submitNow:false,
				groupBuyingId:'',
				goodsType:1,//1普通商品 2积分商品
			}
		},
		onShow() {
			// 获取默认收货地址id
			// this.$api.httpRequest(
			// 		'GET',
			// 		this.$constant.API_HOME+'member/memberaddress/page',
			// 		{page:'1',limit:'10'},
			// 		{token:this.$store.state.userInfo.token.token}
			// 	).then((data) => {
			// 		console.log(data)
			// 		for(var i=0;i<data.list.length;i++){
			// 			if(data.list[i].isDefault==1){
			// 				this.addressId=data.list[i].id;
			// 				// console.log(this.addressId);
			// 			}
			// 		}
			// 		// if(!option.submitNow){
			// 		// 	this.getStoreId();
			// 		// }
			// 		
			// 	})
		},
		onLoad(option){
			// console.log(option)
			// console.log(option.num)
			if(option.submitNow){
				this.submitNow=true;
				if(option.isGroup==1){
					this.isGroup=1;
					this.groupBuyingId=option.groupBuyingId
					this.$api.httpRequest(
							'POST',
							this.$constant.API_HOME+'group/grouporder/initiateConfirm',
							{groupBuyingId:option.groupBuyingId,goodsNum:option.goodsNum},
							{token:this.$store.state.userInfo.token.token}
						).then((data) => {
							console.log(data)
							if(data.address){
								this.addressData=data.address;
								this.addressId=data.address.id;
							}
							
							this.orderList=data.cartList;
							this.shippingPrice=data.shippingPrice;
							this.goodsPrice=data.goodsPrice;
							this.allPrice=data.orderPrice;
							
							// this.getStoreId();
						})
				}else if(option.isGroup==2){
					this.isGroup=2;
					this.groupBuyingId=option.groupBuyingId
					this.$api.httpRequest(
							'POST',
							this.$constant.API_HOME+'group/grouporder/joinConfirm',
							{groupOrderId:option.groupBuyingId,goodsNum:option.goodsNum},
							{token:this.$store.state.userInfo.token.token}
						).then((data) => {
							console.log(data)
						if(data.address){
							this.addressData=data.address;
						}
							this.orderList=data.cartList;
							this.shippingPrice=data.shippingPrice;
							this.goodsPrice=data.goodsPrice;
							this.allPrice=data.orderPrice;
							
							// this.getStoreId();
						})
				}else{
					this.$api.httpRequest(
							'GET',
							this.$constant.API_HOME+'goods/goodsspu/confirm',
							{skuId:option.skuId,goodsNum:option.num},
							{token:this.$store.state.userInfo.token.token}
						).then((data) => {
							console.log(data)
						if(data.address){
							this.addressData=data.address;
						}
							this.orderList=data.cartSelectedList;
							this.shippingPrice=data.shippingPrice;
							this.goodsPrice=data.goodsPrice;
							this.allPrice=data.orderPrice;
							this.goodsType=data.goodsType;
							// console.log('--------------------------------------')
							// console.log(data.goodsType);
							// this.getStoreId();
						})
				}
				
			}
			//商品数据
			// let data = JSON.parse(option.data);
			// console.log(data);
			// 获取默认收货地址id
			if(this.addressData==''){
				this.$api.httpRequest(
						'GET',
						this.$constant.API_HOME+'member/memberaddress/page',
						{page:'1',limit:'10'},
						{token:this.$store.state.userInfo.token.token}
					).then((data) => {
						console.log(data.list)
						if(data.list){
							for(var i=0;i<data.list.length;i++){
								if(data.list[i].isDefault==1){
									this.addressId=data.list[i].id;
									// console.log(this.addressId);
								}
							}
						}
					
						if(!option.submitNow){
							this.getStoreId();
						}
						
					})
			}
			
				
		},
		
		methods: {
			// 获取选中店铺id
			getStoreId(){
				this.$api.httpRequest(
							'GET',
						this.$constant.API_HOME+'/cart/cart/user',
						 {token:this.$store.state.userInfo.token.token}
					).then((data) => {
						console.log(data.length);
						// 获取购物车列表 for循环获取列表 若有选中商品 则将该商铺的id存入
						for(var i=0;i<data.length;i++){
							for(var j=0;j<data[i].cart_list.length;j++){
								if(data[i].cart_list[j].selected==1){
									let a= this.selectStoreId.indexOf(data[i].storeId);
									if(a==-1){
										this.selectStoreId.push(data[i].storeId);
									}
								}
							}
						}
						this.getOrder();
					})
			},
			// 获取订单列表
			getOrder(){
				this.$api.httpRequest(
						'GET',
						this.$constant.API_HOME+'cart/cart/confirm',
						{addressId:this.addressId},
						{token:this.$store.state.userInfo.token.token}
					).then((data) => {
						this.addressData=data.address;
						this.orderList=data.cartSelectedList;
						this.goodsPrice=data.goodsPrice;
						this.shippingPrice=parseFloat(data.shippingPrice);
						this.allPrice=this.goodsPrice+this.shippingPrice;
						for(var i=0;i<this.orderList.length;i++){
							this.desc[i]='';
							this.remarkList[i]={'storeId':this.orderList[i].storeId,'remark':this.desc[i]};
						}
						// console.log(this.orderList.length);
						// console.log(this.remarkList);
					})
					
			},
			//显示优惠券面板
			toggleMask(type){
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				this.maskState = 2;
				setTimeout(()=>{
					this.maskState = state;
				}, timer)
			},
			numberChange(data) {
				this.number = data.number;
			},
			changePayType(type){
				this.payType = type;
			},
			submit(){
				// console.log(this.addressId);
				// return false;
				if(this.addressId==''){
					// this.$api.msg('请添加地址')
					// this.$api.msg('请添加地址')
					uni.showToast({
						title: '请添加地址',
						duration: 1500,
						icon: 'none'
					})
					return false;
				}
				for(var i=0;i<this.remarkList.length;i++){
					this.remarkList[i].remark=this.desc[i];
				}
				if(this.submitNow){
					if(this.isGroup==1){
						this.$api.httpRequest(
								'POST',
								this.$constant.API_HOME+'group/grouporder/initiateSubmit',
								{addressId:this.addressId,groupBuyingId:this.groupBuyingId,goodsNum:this.orderList[0].goodsNum,remark:this.desc[0]},
								{token:this.$store.state.userInfo.token.token}
							).then((data) => {
								 uni.navigateTo({
								  url: '/pages/money/pay?orderAmount='+data.orderPrice+'&masterOrderId='+data.id+'&isGroup=true',
								})
							})
					}else if(this.isGroup==2){
						this.$api.httpRequest(
								'POST',
								this.$constant.API_HOME+'group/grouporder/joinSubmit',
								{addressId:this.addressId,groupOrderId:this.groupBuyingId,goodsNum:this.orderList[0].goodsNum,remark:this.desc[0]},
								{token:this.$store.state.userInfo.token.token}
							).then((data) => {
								 uni.navigateTo({
								  url: '/pages/money/pay?orderAmount='+data.orderPrice+'&masterOrderId='+data.id+'&isGroup=true',
								})
							})
					}else{
						this.$api.httpRequest(
								'POST',
								this.$constant.API_HOME+'goods/goodsspu/submit',
								{addressId:this.addressId,skuId:this.orderList[0].cart_list[0].skuId,goodsNum:this.orderList[0].cart_list[0].goodsNum,remark:this.desc[0],goldDeduction:0,promType:this.promType},
								{token:this.$store.state.userInfo.token.token}
							).then((data) => {
								// console.log(data)
								if(this.goodsType==1){
									uni.navigateTo({
									  url: '/pages/money/pay?orderAmount='+data.orderAmount+'&masterOrderId='+data.masterOrderId,
									})
								}else{
									uni.navigateTo({
										url:'/pages/order/order'
									})
								}
								 
							})
					}
					
				}else{
						
					this.$api.httpRequest(
							'POST',
							this.$constant.API_HOME+'cart/cart/submit',
							{addressId:this.addressId,remarkList:this.remarkList,goldDeduction:0},
							{token:this.$store.state.userInfo.token.token}
						).then((data) => {
							// console.log(data)
							 uni.navigateTo({
							  url: '/pages/money/pay?orderAmount='+data.orderAmount+'&masterOrderId='+data.masterOrderId,
							})
						})
				}
			
			
			},
			stopPrevent(){}
		}
	}
</script>

<style lang="scss">
	page {
		background: $page-color-base;
		padding-bottom: 100upx;
	}
.addAddress{
	text-align: center;
	font-size: 30upx;
}
	.address-section {
		padding: 30upx 0;
		background: #fff;
		position: relative;

		.order-content {
			display: flex;
			align-items: center;
		}

		.icon-shouhuodizhi {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 90upx;
			color: #888;
			font-size: 44upx;
		}

		.cen {
			display: flex;
			flex-direction: column;
			flex: 1;
			font-size: 28upx;
			color: $font-color-dark;
		}

		.name {
			font-size: 34upx;
			margin-right: 24upx;
		}

		.address {
			margin-top: 16upx;
			margin-right: 20upx;
			color: $font-color-light;
		}

		.icon-you {
			font-size: 32upx;
			color: $font-color-light;
			margin-right: 30upx;
		}

		.a-bg {
			position: absolute;
			left: 0;
			bottom: 0;
			display: block;
			width: 100%;
			height: 5upx;
		}
	}

	.goods-section {
		margin-top: 16upx;
		background: #fff;
		padding-bottom: 1px;
		font-size: 28upx;
		.message{
			color: #333;
			display: flex;
			align-items: center;
			padding:20upx 30upx;
			input{
				margin-left: 30upx;
				width: 580upx;
			}
		}
		.g-header {
			display: flex;
			align-items: center;
			height: 84upx;
			padding: 0 30upx;
			position: relative;
		}

		.logo {
			display: block;
			width: 50upx;
			height: 50upx;
			border-radius: 100px;
		}

		.name {
			font-size: 30upx;
			color: $font-color-base;
			margin-left: 24upx;
		}

		.g-item {
			display: flex;
			margin: 20upx 30upx;

			image {
				flex-shrink: 0;
				display: block;
				width: 140upx;
				height: 140upx;
				border-radius: 4upx;
			}

			.right {
				flex: 1;
				padding-left: 24upx;
				overflow: hidden;
			}

			.title {
				font-size: 30upx;
				color: $font-color-dark;
			}

			.spec {
				font-size: 26upx;
				color: $font-color-light;
				height: 30upx;
				display: inline-block;
			}

			.price-box {
				display: flex;
				align-items: center;
				font-size: 32upx;
				color: $font-color-dark;
				padding-top: 10upx;
				justify-content: space-between;
				.price {
					margin-bottom: 4upx;
					color: #E64241;
				}
				.number{
					font-size: 26upx;
					color: $font-color-base;
					// margin-left: 20upx;
					// float: right;
				}
			}

			.step-box {
				position: relative;
			}
		}
	}
	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-more {
			align-self: center;
			font-size: 24upx;
			color: $font-color-light;
			margin-left: 8upx;
			margin-right: -10upx;
		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: $font-color-light;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: $font-color-dark;

			&.disabled {
				color: $font-color-light;
			}

			&.active {
				color: $base-color;
			}
			&.red{
				color: $base-color;
			}
		}

		&.desc-cell {
			.cell-tit {
				max-width: 90upx;
			}
		}

		.desc {
			flex: 1;
			font-size: $font-base;
			color: $font-color-dark;
		}
	}
	
	/* 支付列表 */
	.pay-list{
		padding-left: 40upx;
		margin-top: 16upx;
		background: #fff;
		.pay-item{
			display: flex;
			align-items: center;
			padding-right: 20upx;
			line-height: 1;
			height: 110upx;	
			position: relative;
		}
		.icon-weixinzhifu{
			width: 80upx;
			font-size: 40upx;
			color: #6BCC03;
		}
		.icon-alipay{
			width: 80upx;
			font-size: 40upx;
			color: #06B4FD;
		}
		.icon-xuanzhong2{
			display: flex;
			align-items: center;
			justify-content: center;
			width: 60upx;
			height: 60upx;
			font-size: 40upx;
			color: $base-color;
		}
		.tit{
			font-size: 32upx;
			color: $font-color-dark;
			flex: 1;
		}
	}
	
	.footer{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 995;
		display: flex;
		align-items: center;
		width: 100%;
		height: 90upx;
		justify-content: space-between;
		font-size: 30upx;
		background-color: #fff;
		z-index: 998;
		color: $font-color-base;
		box-shadow: 0 -1px 5px rgba(0,0,0,.1);
		.price-content{
			padding-left: 30upx;
		}
		.price-left{
			margin-right: 20upx;
		}
		.price-tip{
			color: $base-color;
			// margin-left: 8upx;
		}
		.price{
			// margin-left: 10upx;
			font-size: 36upx;
			color: $base-color;
		}
		.submit{
			display:flex;
			align-items:center;
			justify-content: center;
			width: 280upx;
			height: 100%;
			color: #fff;
			font-size: 32upx;
			background-color: #F23D3D;
		}
	}
	
	/* 优惠券面板 */
	.mask{
		display: flex;
		align-items: flex-end;
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 9995;
		transition: .3s;
		
		.mask-content{
			width: 100%;
			min-height: 30vh;
			max-height: 70vh;
			background: #f3f3f3;
			transform: translateY(100%);
			transition: .3s;
			overflow-y:scroll;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.mask-content{
				transform: translateY(0);
			}
		}
	}

	/* 优惠券列表 */
	.coupon-item{
		display: flex;
		flex-direction: column;
		margin: 20upx 24upx;
		background: #fff;
		.con{
			display: flex;
			align-items: center;
			position: relative;
			height: 120upx;
			padding: 0 30upx;
			&:after{
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				width: 100%;
				height: 0;
				border-bottom: 1px dashed #f3f3f3;
				transform: scaleY(50%);
			}
		}
		.left{
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			overflow: hidden;
			height: 100upx;
		}
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			margin-bottom: 10upx;
		}
		.time{
			font-size: 24upx;
			color: $font-color-light;
		}
		.right{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 26upx;
			color: $font-color-base;
			height: 100upx;
		}
		.price{
			font-size: 44upx;
			color: $base-color;
			&:before{
				content: '￥';
				font-size: 34upx;
			}
		}
		.tips{
			font-size: 24upx;
			color: $font-color-light;
			line-height: 60upx;
			padding-left: 30upx;
		}
		.circle{
			position: absolute;
			left: -6upx;
			bottom: -10upx;
			z-index: 10;
			width: 20upx;
			height: 20upx;
			background: #f3f3f3;
			border-radius: 100px;
			&.r{
				left: auto;
				right: -6upx;
			}
		}
	}

</style>
