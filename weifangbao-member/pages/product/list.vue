<template>
	<view class="content">
		<view class="navbar" :style="{position:headerPosition,top:headerTop}">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<view class="nav-item" :class="{current: filterIndex === 3}" @click="tabClick(3)">
				新品
			</view>
			<view class="nav-item" :class="{current: filterIndex === 4}" @click="tabClick(4)">
				好评
			</view>
			<text class="cate-item yticon icon-fenlei1" @click="goodsListClass=='goods-list'?goodsListClass='goods-list1':goodsListClass='goods-list'"></text>
		</view>
		<view :class="goodsListClass">
			<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)" v-if="isOneSelf || item.ownStoreTag=='自营'">
				<view style="padding-bottom: 10upx;">
					<view class="image-wrapper">
						<image :src="item.mainPicture" mode="aspectFill"></image>
					</view>
					<view class="title1">{{item.name}}</view>
					<!-- 商品描述 -->
					<view class="describe" v-if="item.keyword!=null">
						{{item.keyword}}
					</view>
					<view class="price-box">
						<!-- <text class="price">{{item.sellingPrice}}</text> -->
						<text class="price" v-if="item.goodsType==1">¥{{item.sellingPrice}}</text>
						<text class="price" v-if="item.goodsType==2">{{item.sellingPrice}}积分</text>
						<!-- <text class="oldPrice">{{item.marketPrice}}</text> -->
					</view>
					<view class="goodsClassify">
						<text class="classifyList1" v-if="item.ownStoreTag">{{item.ownStoreTag}}</text>
						<!-- <text class="classifyList2">特价</text> -->
						<text class="evaluation">{{item.favorableRate}}%好评</text>
					</view>
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
			uniLoadMore
		},
		data() {
			return {
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
				page: [1, 1, 1, 1, 1], //请求页数
				order: 'asc', //价格升序asc or 降序desc
				orderField: '', //筛选
				isOneSelf: true, //用来判断不是自营的商品显示与否
				token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
				keywords: '',
				type: 1,
				storeCateId: '', //店铺分类id
				storeId: '', //店铺id
			};
		},

		onLoad(options) {
			// console.log(options);
			if (options.type) {
				this.type = options.type;
			}
			if (options.storeCateId) {
				this.storeCateId = options.storeCateId;
			}
			if (options.storeId) {
				this.storeId = options.storeId;
			}
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight + 'px';
			// #endif
			if (!options.keywords) {
				this.cateId = options.cateid;
			}
			if (options.keywords) {
				this.keywords = options.keywords;
				console.log(this.keywords);
			}
			// this.cateId ='1121617780693073922'
			// this.loadCateList(options.fid,options.sid);
			// this.loadComprehensive();
			this.getData(0);
			if (options.token) {
				this.token = options.token;
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
			this.page = [1, 1, 1, 1, 1]
			this.getData(this.filterIndex, 'refresh');
		},
		//加载更多
		onReachBottom() {
			// this.loadData();
			if (this.loadingType === 'nomore') {
				return;
			}
			this.page[this.filterIndex]++;
			this.getData(this.filterIndex, 'isadd');
		},
		methods: {

			// 封装加载
			getData(index, type = 'refresh') {
				let data;
				if (index == 0) {
					this.orderField = '';
					// 是否有关键字 判断关键字搜索是否来自店铺
					if (this.keywords == '') {
						data = {
							"page": this.page[0],
							"limit": 10,
							storeId: this.$constant.STORE_ID,
							storeCateId: this.storeCateId,
							orderField: this.orderField
						}
					} else {
						// 若有关键字 判断是否来自店铺
						data = {
							"page": this.page[0],
							"limit": 10,
							keywords: this.keywords,
							orderField: this.orderField,
							storeId: this.$constant.STORE_ID
						}
					}

				} else if (index == 1) {
					this.orderField = 'sales_val';
					if (this.keywords == '') {
						data = {
							"page": this.page[1],
							"limit": 10,
							storeId: this.$constant.STORE_ID,
							storeCateId: this.storeCateId,
							orderField: this.orderField
						}


					} else {

						data = {
							"page": this.page[1],
							"limit": 10,
							keywords: this.keywords,
							orderField: this.orderField,
							storeId: this.$constant.STORE_ID
						}

					}

				} else if (index == 2) {
					this.orderField = 'selling_price';
					if (this.keywords == '') {

						data = {
							"page": this.page[2],
							"limit": 10,
							storeId: this.$constant.STORE_ID,
							storeCateId: this.storeCateId,
							orderField: this.orderField,
							order: this.order
						};


					} else {

						data = {
							"page": this.page[2],
							"limit": 10,
							keywords: this.keywords,
							orderField: this.orderField,
							order: this.order,
							storeId: this.$constant.STORE_ID
						};

					}
				} else if (index == 3) {
					this.orderField = 'is_new';
					if (this.keywords == '') {

						data = {
							"page": this.page[3],
							"limit": 10,
							storeId: this.$constant.STORE_ID,
							storeCateId: this.storeCateId,
							orderField: this.orderField
						}


					} else {

						data = {
							"page": this.page[3],
							"limit": 10,
							keywords: this.keywords,
							orderField: this.orderField,
							storeId: this.$constant.STORE_ID
						}

					}
				} else if (index == 4) {
					this.orderField = 'favorable_rate';
					if (this.keywords == '') {

						data = {
							"page": this.page[4],
							"limit": 10,
							storeId: this.$constant.STORE_ID,
							storeCateId: this.storeCateId,
							orderField: this.orderField
						}


					} else {

						data = {
							"page": this.page[4],
							"limit": 10,
							keywords: this.keywords,
							orderField: this.orderField,
							storeId: this.$constant.STORE_ID
						}


					}
				}
				this.$api.httpRequest(
					'GET',
					this.url + 'goods/goodsspu/page_by_condition',
					data, {
						token: this.token
					}
				).then((data) => {
					if (type == 'refresh') {
							uni.stopPullDownRefresh();
						if (this.page[index] == 1) {
							this.goodsList = data.list;
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
					this.page[index] == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
					data.total == 0 ? this.loadingType = 'nomore' : '';

				})
			},
			//筛选点击
			tabClick(index) {
				if (this.filterIndex === index && index !== 2) {
					return;
				}
				this.filterIndex = index;
				if (index === 2) {
					this.order = this.order === 'asc' ? 'desc' : 'asc';
					this.priceOrder = this.priceOrder === 1 ? 2 : 1;
				}
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
			navToDetailPage(item) {
				let id = item.id;
				if (this.type == 1) {
					uni.navigateTo({
						url: '/pages/product/product?id=' + id + '&type=' + this.type
					})
				} else {
					uni.navigateTo({
						url: '/pages/product/product?id=' + id + '&type=' + this.type + '&token=' + this.token
					})

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
			stopPrevent() {}
		},
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
		padding-left: 30upx;
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
				color: $base-color;

				&:after {
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120upx;
					height: 0;
					border-bottom: 4upx solid $base-color;
				}
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
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
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
		}

		.image-wrapper {
			float: left;
			width: 240upx;
			height: 240upx;
			margin-right: 40upx;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}

		.list-right {
			float: right;
			width: 424upx;
		}

		.title1 {
			font-size: 28upx;
			color: #333333;
			height: 120upx;
			padding: 0 10upx;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;

		}

		.price-box {
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
			padding: 0 10upx;
			margin-top: 20upx;
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
			margin: 10upx 0;
			padding: 0 10upx;
		}

		.goodsClassify {
			font-size: 20upx;
			margin: 20upx 0;
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
				// display: block;
				// margin-top: 20upx;
			}
		}
	}
</style>
