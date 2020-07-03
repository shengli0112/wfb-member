<template>
	<view class="container">
		<view class="mp-search-box" @click="navToSearch">
			<!-- <input class="ser-input" type="text" value="" disabled placeholder="搜索您想要的商品"/> -->
			<image src="../../static/img/Search.png" mode=""></image>
			搜索您想要的商品
		</view>

		<!-- 头部轮播 -->
		<view class="carousel-section">
			<!-- 标题栏和状态栏占位符 -->
			<!-- <view class="titleNview-placing"></view> -->
			<!-- 背景色区域 -->
			<!-- <view class="titleNview-background" ></view> -->
			<swiper class="carousel" circular autoplay @change="swiperChange">
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToURL(item.url)">
					<image :src="item.imageUrl" />
				</swiper-item>
			</swiper>
			<!-- 自定义swiper指示器 -->
			<view class="swiper-dots">
				<text class="num">{{swiperCurrent+1}}</text>
				<text class="sign">/</text>
				<text class="num">{{swiperLength}}</text>
			</view>
		</view>
		<!-- 导航区 -->
		<view v-if="navMenus.length>0" class="cate-section" v-for="(navMenu,index) in navMenus " :key='index'>
			<view :class="cateItem" v-for="nav in navMenu " @click="navToNewsDetails(nav.pageUrl)" :key='nav.id'>
				<image :src="nav.icon"></image>
				<text>{{nav.name}}</text>
			</view>
		</view>
		<!-- 猜你喜欢 -->
		<view id="recommend_section" class="">
			<view class="guess-section">
				<view v-for="(item, index) in goodsList" :key="index" class="goods-item" @click="navToDetailPage(item)">
					<view class="imageBox">
						<image :src="item.mainPicture" mode=""></image>
						<!-- <image :src="item.mainPicture" mode="aspectFill"></image> -->
					</view>
					<view class="goodListRight">
						<view class="title1" >{{item.name}}</view>
						<view class="price-box">
							<text class="price">¥{{item.sellingPrice}}</text>
							<!-- <text class="oldPrice">¥{{item.marketPrice}}</text> -->
						</view>
						<view class="goodsListBottom">
							<text>已售出2000件</text>
							<image src="../../static/img/car.png" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="shoppingCart" @click="navToCart">
			<image src="../../static/img/iconfontcart.png" mode=""></image>
			<text>购物车</text>
		</view>
		<uni-load-more :status="loadingType"></uni-load-more>
		<view class="mask" v-if="isShow">
		<page-authorization @isShow='cancle'></page-authorization>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				isShow:false,
				showWebView: false,
				cateItem: 'cate-item',
				loadingType: 'more', //加载更多状态
				page: 1,
				/* banner */
				titleNViewBackground: 'rgba(255,79,79,0.32)',
				swiperCurrent: 0,
				swiperLength: 0,
				carouselList: [],
				/* 导航 */
				navMenus: [],
				middleAd: {
					src: '/static/temp/ad1.jpg'
				},
				/* 为你推荐 */
				goodsList: [],
				newList: [],
			};
		},
		//加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') {
				return;
			}
			this.page++;
			this.getRecommend();
		},
		onLoad() {
			this.loadData();
		},
		computed: {},
		methods: {
			...mapMutations(['login', 'logout']),
			cancle(data) {
				this.isShow = data;
			},
			navToSearch(){
				uni.navigateTo({
				  url: '/pages/search/search'
				})
			},
			navToCart(){
				console.log(this.$store.state.hasLogin)
				if (!this.$store.state.hasLogin) {
					
					// 如果未登录
					this.isShow=true;
					// this.loginCode();
					return false;
					// url = '/pages/public/login';
				}
				uni.navigateTo({
					url:'/pages/cart/cart'
				})
			},
			joinCart(e){
				this.$api.httpRequest('GET', this.$constant.API_HOME + 'cart/cart/add_cart', 
				{	skuId: e.id,goodsNum:1},
				{token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:'',}
				).then((data) => {
					console.log(data)
				this.$api.msg('加入购物车')
				});
			},
			getRecommend() {
				this.$api.httpRequest('GET', this.$constant.API_HOME + 'index/recommend', {
					page: this.page,
					limit: '10',
					storeId: this.$constant.STORE_ID
				}).then((data) => {
					// let goodsList = data.list;
					// this.goodsList = goodsList || [];
					this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
					data.total == 0 ? this.loadingType = 'nomore' : '';
					if (this.page == 1) {
						this.goodsList = [];
						this.goodsList = data.list;
					} else {
						for (var i = 0; i < data.list.length; i++) {
							this.goodsList.push(data.list[i])
						}
					}
				});
			},
			//轮播图切换修改背景色
			swiperChange (e) {
			  const index = e.detail.current;
			  this.swiperCurrent = index;
			  //this.titleNViewBackground = this.carouselList[index].background;
			},
			async loadData() {
				this.$api.httpRequest('GET', this.$constant.API_HOME + 'index/shop_index', {
					storeId: this.$constant.STORE_ID
				}).then((data) => {
					console.log(data)
					let carouselList = data.wheelAdvertising;
					// this.titleNViewBackground = carouselList[0].background;
					this.swiperLength = carouselList.length;
					this.carouselList = carouselList;
					this.splitNavMenu(data.navigation);
				});
				this.getRecommend();
			},
			navToURL(url) {
				// console.log(url)
				if (url) {
					location.href = url
				}

			},
			// 导航 去数据结构重组
			splitNavMenu(navigation) {

				// 布局方式 1:2*4 2:3*4 3:2*5 4:3*5
				let layout = [1, 5];
				this.cateItem = 'cate-item1';
				if (navigation.layoutType == 1) {
					layout = [2, 4];
					this.cateItem = 'cate-item'
				}
				if (navigation.layoutType == 2) {
					layout = [3, 4];
					this.cateItem = 'cate-item'
				}
				if (navigation.layoutType == 3) {
					layout = [2, 5];
					this.cateItem = 'cate-item1';
				}
				if (navigation.layoutType == 4) {
					layout = [3, 5];
					this.cateItem = 'cate-item1';
				}
				let i = 0;
				for (let j = 0; j < layout[0]; j++) {
					this.navMenus[j] = []
					// let navMenu= [];
					for (let h = 0; h < layout[1]; h++) {
						if (i >= navigation.navigationList.length) {
							return false;
						}
						let nav = navigation.navigationList[i++];
						this.navMenus[j].push(nav);
					}
					console.log(this.navMenus);
				}

			},

			keywords: function(keyword) {
				if (!keyword) {
					return "　"
				}
				return keyword.replace(/,/g, " | ");
			},

			//详情页
			navToDetailPage(item) {
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}&type=1`
				})
			},
		}
	}
</script>

<style lang="scss">
	$page-section-margin: 24upx;

	.mp-search-box {
		background: pink;
		margin: 30upx 20upx;
		height: 80upx;
		line-height: 80upx;
		background: #F8F8F8;
		text-align: center;
		font-size: 28upx;
		color: #999999;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 28upx;
			height: 28upx;
		}
	}


	page {
		background: #FFFFFF;
	}

	.m-t {
		margin-top: 16upx;
	}

	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		// padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			// padding-top: 44px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}

	.carousel {
		width: 710upx;
		height: 336upx;
		margin: 0 auto;
		box-shadow: 0 0 16upx rgba(153, 153, 153, 0.8);
		border-radius: 8upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			border-radius: 8upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 8upx;
		}
	}

	.swiper-dots {
		display: flex;
		position: absolute;
		right: 60upx;
		bottom: 15upx;
		width: 72upx;
		height: 36upx;

		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
		background-size: 100% 100%;

		.num {
			width: 36upx;
			height: 36upx;
			border-radius: 50px;
			font-size: 24upx;
			color: #fff;
			text-align: center;
			line-height: 36upx;
		}

		.sign {
			position: absolute;
			top: 0;
			left: 50%;
			line-height: 36upx;
			font-size: 12upx;
			color: #fff;
			transform: translateX(-50%);
		}
	}

	/* 分类 */
	.cate-section {
		display: flex;
		// justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		// padding: 30upx 22upx;
		background: #fff;

		.cate-item {

			width: 25%;
			padding: 30upx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		.cate-item1 {
			width: 20%;
			padding: 30upx 0;
			display: flex;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}

		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 0 0 10upx rgba(0, 0, 0, 0.2);
		}
	}

	.ad-1 {
		margin: 20upx $page-section-margin;
		height: 160upx;
		overflow: hidden;

		// background: #fff;
		image {
			// border-radius:120upx;
			width: 100%;
			height: 100%;
		}
	}

	/* 为你推荐*/
	#recommend_section {
		.guess-section {
			.goods-item {
				display: flex;

				.imageBox {
					width: 200upx;
					height: 200upx;
					margin: 30upx;

					image {
						width: 200upx;
						height: 200upx;
					}
				}

				.goodListRight {
					margin: 30upx 30upx 30upx 20upx;
					width: 440upx;

					.title1 {
						font-size: 28upx;
						color: #333333;
						height: 80upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}

					.price {
						color: #F23D3D;
						font-size: 36upx;
						margin-right: 22upx;
					}

					.oldPrice {
						color: #999999;
						font-size: 24upx;
						text-decoration: line-through;
					}

					.goodsListBottom {
						display: flex;
						justify-content: space-between;
						align-items: center;

						image {
							width: 72upx;
							height: 72upx;
						}

						text {
							color: #999999;
							font-size: 24upx;
						}
					}
				}
			}
		}
	}
	// <view class="shoppingCart">
	// 		<image src="../../static/img/iconfontcart.png" mode=""></image>
	// 		<text>购物车</text>
	// 	</view>
		.shoppingCart{
			position: fixed;
			right: 60upx;
			bottom: 120upx;
			width: 100upx;
			height: 100upx;
			text-align: center;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 20upx;
			color: #fff;
			background: #F23D3D;
			border-radius:50%;
			box-shadow: 0 6upx 10upx #DF3636;
			image{
				width: 32upx;
				height: 32upx;
			}
		}
		.mask{
			position: fixed;
			top: 0;
			left: 0;
			z-index: 10;
		}
</style>
