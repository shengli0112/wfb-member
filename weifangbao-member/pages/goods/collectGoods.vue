<template>
	<view class="content">
		<view class="goods-list1">
			<scroll-view scroll-x="true" v-for="(item, index) in goodsList" :key="index" :scroll-left='scrollLeft' @scroll="scroll">
				<view class="box">
					<view class="goods-item" @click="navToDetailPage(item.propertyId)">

							<view class="image-wrapper">
								<image :src="(JSON.parse(item.designPictures))[0]" mode="aspectFill"></image>
							</view>
							<view class="listRight">
								<view class="nameBox">
									<view class="houseName">{{item.propertyName}}</view>
										<!-- <view class="state">审核中</view> -->
								</view>
								<view class="houseAddress">
									<text>{{item.saleAddress}}</text>
									<text class="area">建面：{{item.minBuildArea}}~{{item.maxBuildArea}}</text>
								</view>
								<view class="tagBox">
									<view class="tagList" v-for="(val1,index1) in labelArr[index]" :key='index1'>{{val1}}</view>
								</view>
								<view class="price">
									<text class="priceLeft" >{{item.unitPrice}}元</text>
									<text class="priceLeft">佣金：{{item.commission}}</text>
								</view>
							</view>

					</view>
					<view class="del" @click="delGoods(item.id)">删除</view>
				</view>

			</scroll-view>

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
				token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
				goodsList: [],
				type:1,
				scrollLeft:0,
				oldScrollLeft:0,
				loadingType: 'more', //加载更多状态
				page: 1, //请求页数
        labelArr:[],
			}
		},
		onLoad(options) {
			this.type=options.type;
			if(options.token){
				this.token=options.token;
			}
			this.getGoodsList();

		},
		  //加载更多
		onReachBottom(){
		// this.loadData();
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		this.getGoodsList();

    },
		methods: {
			scroll: function(e) {
            this.oldScrollLeft = e.detail.scrollLeft
        },
			getGoodsList(){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'property/propertycollect/page', {
						page: this.page,
						limit: 10
					}, {
						token: this.token
					}
				).then((data) => {
					this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':''
					if(this.page!=1){
						for(var i=0;i<data.list.length;i++){
							this.goodsList.push(data.list[i]);
						}
					}else{
						this.goodsList=data.list;
					}
					for(var a=0;a<this.goodsList.length;a++){
					  this.labelArr[a]=[];
					  for(var b=0;b<this.goodsList[a].labels.split(',').length;b++){
					    this.labelArr[a][b]=this.goodsList[a].labels.split(',')[b]
					  }
					}
				})
			},
			 //详情
			  navToDetailPage(id){
				uni.navigateTo({
					url:'/pages/housesDetails/housesDetail?id='+id
				})
		},
		delGoods(id){
			this.$api.httpRequest(
				'DELETE',
				this.$constant.API_HOME+'property/propertycollect',
				JSON.stringify([id]),
				{token:this.token},
			).then((data) => {
				this.getGoodsList();
				this.scrollLeft=this.oldScrollLeft;
				this.$nextTick(function(){
					this.scrollLeft=0;
				})
				})
		}
	},
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.box{
		width: 900upx;
		display: flex;
		align-items: center;
		.del{
			width: 150upx;
			background: #F05161;
			color: #fff;
			height: 250upx;
			text-align: center;
			line-height: 250upx;
			font-size: 32upx;
		}
	}
	.goods-list1{


				.goods-item {
					margin: 10upx 0;
					width: 100%;
					background-color: white;
					padding: 20upx;
					overflow: hidden;
					display:flex;
				}

				.image-wrapper {
					width: 280upx;
					height: 220upx;
					margin-right: 20upx;
					image {
						width: 100%;
						height: 100%;
						opacity: 1;
					}
				}
		.listRight{
			.nameBox{
				margin: 10upx auto;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30upx;
				font-weight: 550;
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
	.goods-list1{/*
	  .goods-item{
	    margin: 10upx 0;
	    width: 750upx;
	    background-color: white;
	    padding: 20upx;
	    overflow: hidden;
	  }
	  .image-wrapper{
	    float: left;
	    width: 240upx;
	    height: 240upx;
	    margin-right:40upx;
	  image{
	    width: 100%;
	    height: 100%;
	    opacity: 1;
	  }
	  }
	  .list-right{
	    float: right;
	    width: 424upx;
	  }
	  .title1{
	    font-size: 28upx;
	    color: #333333;
	    height: 80upx;
	    padding:0 10upx;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp: 2;
	    -webkit-box-orient: vertical;

	  }
	  .price-box{
	    padding-right: 10upx;
	    font-size: 24upx;
	    color: $font-color-light;
	    padding:0 10upx;
	    margin-top: 20upx;
	  }
	  .price{
	    font-size: $font-lg;
	    color: $uni-color-primary;
	    line-height: 1;
	    &:before{
	      content: '￥';
	      font-size: 26upx;
	    }
	  }
	  .describe{
	    color: #999999;
	    font-size: 24upx;
	    margin: 10upx 0;
	    padding:0 10upx;
	  }
	  .goodsClassify{
	    font-size: 20upx;
	    margin: 20upx 0;
	    padding:0 10upx;
	    .classifyList1{
	      color: #F05161;
	      border: 1px solid #F05161;
	      display: inline-block;
	      width: 80upx;
	      margin-right: 10upx;
	      text-align: center;
	    }
	    .classifyList2{
	      color: white;
	      background-color: #F05161;
	      border: 1px solid #F05161;
	      display: inline-block;
	      width: 80upx;
	      text-align: center;
	      margin-right: 10upx;
	    }
	    .evaluation{
	      color: #999999;
	      // display: block;
	      // margin-top: 20upx;
	    }
	  }
	 */}
</style>
