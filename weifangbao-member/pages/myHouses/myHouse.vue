<template>
	<view class="content">
		<view class="navbar" >
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				全部
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				待审核
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				已审核
			</view>
			<view class="nav-item" :class="{current: filterIndex === 3}" @click="tabClick(3)">
				驳回
			</view>
			<view class="nav-item" :class="{current: filterIndex === 4}" @click="tabClick(4)">
				已上架
			</view>
			<view class="nav-item" :class="{current: filterIndex === 5}" @click="tabClick(5)">
				已下架
			</view>
			<!-- <text class="cate-item yticon icon-fenlei1" @click="goodsListClass=='goods-list'?goodsListClass='goods-list1':goodsListClass='goods-list'"></text> -->
		</view>
		<view class="goods-list1">
		<!-- 	<view class="goods-item" @click="navToDetailPage()" >
					<view class="image-wrapper">
						<image src="" mode="aspectFill"></image>
					</view>
					<view class="listRight">
						<view class="nameBox">
							<view class="houseName">环秀湖花园</view>
								<view class="state">审核中</view>
						</view>
						<view class="houseAddress">
							<text>苏州-高铁新城 </text>
							<text class="area">建面：89~160</text>
						</view>
						<view class="tagBox">
							<view class="tagList">住宅</view>
						</view>
						<view class="price">
							<text class="priceLeft" >20000元</text>
							<text class="priceLeft">佣金：20000元</text>
						</view>
					</view>

			</view> -->
			<view class="goods-item" @click="navToDetailPage(val.id)" v-for="(val,index) in goodsList" :key='index'>
					<view class="image-wrapper" v-if="val.designPictures">
						<image :src="JSON.parse(val.designPictures)[0]" mode="aspectFill"></image>
            <!-- <image src="../../static/image/weixin.png" ></image> -->
					</view>
					<view class="listRight">
						<view class="nameBox">
							<view class="houseName">{{val.propertyName}}</view>
								<view class="state">{{val.propertyStatusName}}</view>
						</view>
						<view class="houseAddress">
							<text>{{val.areaName}}</text>
							<text class="area">建面：{{val.minBuildArea}}㎡~{{val.maxBuildArea}}㎡</text>
						</view>
						<view class="tagBox">
							<view class="tagList" v-for="(item1,index1) in labelArr[index]" :key='index1'>{{item1}}</view>
						</view>
						<view class="price">
							<text class="priceLeft" >{{val.unitPrice}}元</text>
							<text class="priceLeft">佣金：{{val.commission}}</text>
						</view>
					</view>

			</view>
			<!-- <view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
				<view style="padding-bottom: 10upx;">
					<view class="image-wrapper">
						<image :src="item.mainPicture" mode="aspectFill"></image>
					</view>
					<view class="title1">{{item.name}}</view>
					商品描述
					<view class="describe" v-if="item.keyword!=null">
						{{item.keyword}}
					</view>
					<view class="price-box">
						<text class="price" v-if="item.goodsType==1">¥{{item.sellingPrice}}</text>
						<text class="price" v-if="item.goodsType==2">{{item.sellingPrice}}积分</text>
					</view>
					<view class="goodsClassify">
						<text class="classifyList1" v-if="item.ownStoreTag">{{item.ownStoreTag}}</text>
						<text class="evaluation">{{item.favorableRate}}%好评</text>
					</view>
				</view>
			</view> -->

		</view>

		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
        labelArr:[],
				goodsListClass: 'goods-list',
				cateMaskState: 0, //分类面板展开状态
				headerPosition: "fixed",
				headerTop: "0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				cateId: 0, //已选三级分类id
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				// cateList: [],
				goodsList: [],
				url: this.$constant.API_HOME,
				page: 1, //请求页数
				order: 'asc', //价格升序asc or 降序desc
				orderField: '', //筛选
				isOneSelf: true, //用来判断不是自营的商品显示与否
				token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
				keywords: '',
				type: 1,
				storeCateId: '', //店铺分类id
				storeId: '', //店铺id
        isRealAuth:false,
			};
		},

		onLoad(options) {
		this.getData(0)
    if(this.$store.state.hasLogin && this.$store.state.userInfo.isRealAuth==1){
      // 登录并已认证
      this.isRealAuth=true;
      console.log('已认证')
    }
		},
		onPageScroll(e) {
			//兼容iOS端下拉时顶部漂移
			if (e.scrollTop >= 0) {
				this.headerPosition = "fixed";
			} else {
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.page = 1
			this.getData(this.filterIndex, 'refresh');
		},
		//加载更多
		onReachBottom() {
			// this.loadData();
			if (this.loadingType === 'nomore') {
				return;
			}
			this.page++;
			this.getData(this.filterIndex, 'isadd');
		},
		methods: {

			// 封装加载
			getData(index, type = 'refresh') {
				// console.log(index)
				this.$api.httpRequest(
					'GET',
					this.url + 'property/property/page',
					{
						page:this.page,
						limit:10,
						propertyStatus:index==0?'':index
					},
					{
						token: this.token
					}
				).then((data) => {
					if (type == 'refresh') {
							// uni.stopPullDownRefresh();
						if (this.page == 1) {

							this.goodsList = data.list;
              console.log(this.goodsList)
						} else {
							// uni.startPullDownRefresh();

							this.goodsList = data.list;
						}

					} else {
						// this.goodsList.concat(data.list);
						for (var i = 0; i < data.list.length; i++) {
							this.goodsList.push(data.list[i])
						}
						console.log(data.list);
					}
          for(var a=0;a<this.goodsList.length;a++){
            this.labelArr[a]=[];
            for(var b=0;b<this.goodsList[a].labels.split(',').length;b++){
              this.labelArr[a][b]=this.goodsList[a].labels.split(',')[b]
            }
          }
					this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
					data.total == 0 ? this.loadingType = 'nomore' : '';

				})
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index) {
					return;
				}
				this.filterIndex = index;
				this.getData(index);
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})

			},
			// 筛选
			screen() {
				if (this.isOneSelf) {
					this.isOneSelf = false;
				} else {
					this.isOneSelf = true;
				}
			},
			//显示分类面板
			toggleCateMask(type) {
				let timer = type === 'show' ? 10 : 100;
				let state = type === 'show' ? 1 : 0;
				setTimeout(() => {
					this.cateMaskState = state;
				}, timer)
			},
			//分类点击
			//       changeCate(item){
			//         this.cateId = item.id;
			//         this.toggleCateMask();
			//         uni.pageScrollTo({
			//           duration: 300,
			//           scrollTop: 0
			//         })
			//         this.loadData('refresh', 1);
			//
			//       },
			//详情
			navToDetailPage(id) {
				// let id = 111;
					// uni.navigateTo({
					// 	url: '/pages/release/release?id=' + id
					// })
          if(this.isRealAuth){
            uni.navigateTo({
            	url:'/pages/release/releaseAll?id=' + id
            })
          }else{
            uni.navigateTo({
            	url:'/pages/release/release?id=' + id
            })
          }
				}

				// if(this.token!=null){
				// uni.navigateTo({
				//         url: '/pages/product/product?id='+id+'&type=1&token='+this.token,
				//       })
				// }else{
				//   uni.navigateTo({
				//          url: '/pages/product/product?id='+id+'&type=1',
				//        })
				// }

			},
			// stopPrevent() {}
		// },
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #F0F1F5;
	}

	.content {
		padding-top: 85upx;
	}

	.navbar {
		position: fixed;
		left: 0;
		top: var(--window-top);
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 80upx;
		background: #fff;
		box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
		padding:0 30upx;
		z-index: 10;
		text-align: center;

		.nav-item {
			// flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30upx;
			color: $font-color-dark;
			position: relative;

			&.current {
				color: #3171F2;

				// &:after {
				// 	content: '';
				// 	position: absolute;
				// 	left: 50%;
				// 	bottom: 0;
				// 	transform: translateX(-45%);
				// 	width: 120upx;
				// 	height: 0;
				// 	border-bottom: 4upx solid $base-color;
				// }
			}
		}

		.p-box {
			display: flex;
			flex-direction: column;

			.yticon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30upx;
				height: 14upx;
				line-height: 1;
				margin-left: 4upx;
				font-size: 26upx;
				color: #888;

				&.active {
					color: $base-color;
				}
			}

			.xia {
				transform: scaleY(-1);
			}
		}

		.cate-item {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80upx;
			position: relative;
			font-size: 44upx;

			&:after {
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36upx;
			}
		}
	}

	.mask {
		position: fixed;
		top: 260upx;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .4);
		z-index: 10;
		transition: .3s;
	}

	.cate-content {
		width: 100%;
		position: absolute;
		top: 85upx;
		z-index: 20;
		background-color: #F8F8F8;

		.mask-con {
			display: inline-block;
			width: 50%;
			margin-bottom: 30upx;
			box-sizing: border-box;
			padding: 30upx 30upx 0 30upx;
			color: #333333;
		}

		.mask-button {
			width: 750upx;
			margin-top: 10upx;

			.button-reset,
			.button-confirm {
				display: inline-block;
				width: 50%;
				height: 100upx;
				line-height: 100upx;
				text-align: center;
				background: white;
				color: #333333;
			}

			.button-confirm {
				color: white;
				background: #F05161;
			}
		}
	}

	.none {
		display: none;
	}

	.show {
		display: block;

		.cate-content {
			transform: translateX(0);
		}
	}

	/* 商品列表 */
	.goods-list {
		display: flex;
		flex-wrap: wrap;
		padding: 0 30upx;

		// background: #fff;
		.goods-item {
			margin: 10upx 0;
			background: #fff;
			display: flex;
			flex-direction: column;
			width: 48%;
			border-radius: 15upx;

			// padding-bottom: 10upx;
			&:nth-child(2n+1) {
				margin-right: 4%;
			}
		}

		.image-wrapper {
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			// overflow: hidden;

			image {
				width: 100%;
				height: 330upx;
				// opacity: 1;
    //     z-index: 1111111111;
			}
		}

		.title1 {
			font-size: 28upx;
			color: #333333;
			// line-height: 60upx;
			padding: 0 10upx;
			margin: 10upx 0;
			overflow: hidden;
			// height: 80upx;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}

		.price-box {
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
			padding: 0 10upx;
			margin: 10upx 0;
		}

		.price {
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
			// &:before{
			//   content: '￥';
			//   font-size: 26upx;
			// }
		}

		.describe {
			color: #999999;
			font-size: 24upx;
			margin-bottom: 10upx;
			padding: 0 10upx;
		}

		.goodsClassify {
			font-size: 20upx;
			margin: 13upx 0 20upx 0;
			padding: 0 10upx;

			.classifyList1 {
				color: #F05161;
				border: 1px solid #F05161;
				display: inline-block;
				width: 80upx;
				margin-right: 10upx;
				text-align: center;
			}

			.classifyList2 {
				color: white;
				background-color: #F05161;
				border: 1px solid #F05161;
				display: inline-block;
				width: 80upx;
				text-align: center;
				margin-right: 10upx;
			}

			.evaluation {
				color: #999999;
			}
		}
	}


	.oldPrice {
		color: #999999;
		font-size: 24upx;
		padding-left: 20upx;
		text-decoration: line-through;
		// &:before{
		//   content: '￥';
		//   font-size: 24upx;
		// }
	}

	.screen-box {
		position: relative;
		background-color: white;
		font-size: 28upx;
		margin-bottom: 20upx;

		.screen {
			display: inline-block;
			width: 156upx;
			height: 64upx;
			line-height: 64upx;
			text-align: center;
			background-color: #F8F8F8;
			margin: 10upx 0 10upx 30upx;

			image {
				width: 10upx;
				height: 10upx;
				margin-left: 5upx;
				margin-bottom: 2upx;
			}
		}

		.screenRed {
			color: #F05161;
		}
	}
	// 商品列表第二套样式
	.goods-list1 {

		.goods-item {
			margin: 10upx 0;
			width: 100%;
			background-color: white;
			padding: 20upx;
			overflow: hidden;
			display:flex;
			// justify-content: space-between;
		}

		.image-wrapper {
			width: 280upx;
			height: 220upx;
			// border: 1upx solid #303133;
			margin-right: 20upx;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
.listRight{
	// border: 1upx solid #4399FC;
	// width: 450upx;
	.nameBox{
		margin: 10upx auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		font-weight: 550;
    width: 425upx;
		.state{
			padding: 5upx 15upx;
			color: #fff;
			background: #4399FC;
			border-radius: 10upx;
			font-size: 24upx;
			font-weight: 300;
		}
	}
	.houseAddress{
		color: #C0C4CC;
		font-size: 28upx;
		margin: 10upx auto;
		.area{
			margin-left: 20upx;
		}
	}
	.tagBox{
		// border: none;
		// padding: 0;
		// display: flex;
		margin: 10upx auto;
		.tagList{
			display: inline-block;
			border: 1upx solid #DCDFE6;
			color: #999999;
			font-size: 24upx;
			padding: 5upx 10upx;
      margin-right: 10upx;
		}
	}
	.price{
		color: #E02020;
		font-size: 30upx;
		display: flex;
		.priceLeft{
			margin-right: 30upx;
		}
	}
}

	}
</style>
