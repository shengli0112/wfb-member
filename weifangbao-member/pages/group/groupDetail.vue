<template>
	<view class="content">
		<view class="goodsList">
			<view class="goodsImage">
				<image :src="goodsDetail.mainPicture" mode=""></image>
			</view>
			<view class="goodsContent">
				<view class="goodsTitle">{{goodsDetail.goodsSpuName}}</view>
				<view class="keyWords">已选:{{goodsDetail.goodsSpecName}}</view>
				<view class="groupPrice">拼团价￥{{goodsDetail.goodsGroupPrice}}</view>
				<view class="price">单买价￥{{goodsDetail.goodsSellingPrice}}</view>
			</view>
		</view>
		<view class="groupBoxContent" >
			<view class="userNum" v-if="goodsDetail.groupOrderStatus==2">
				<text class="userNumLeft">还差{{goodsDetail.leftPersonNum}}人成团，还剩 </text>
				<text class="groupTime">{{hour}}</text>
				<text class="groupTime">{{minutes}}</text>
				<text class="groupTime">{{seconds}}</text>
			</view>
			<view class="userNum1" v-if="goodsDetail.isJoin==1 && goodsDetail.groupOrderStatus==3">
				<image src="../../static/image/green.png" mode=""></image>
				<text class="userNumLeft">恭喜您拼团成功</text>
			</view>
			<view class="userNum1" v-if="goodsDetail.isJoin==1 && goodsDetail.groupOrderStatus==4">
				<image src="../../static/image/red.png" mode=""></image>
				<text class="userNumLeft">拼团失败，未满足拼团要求，我们将在24小时内为您退款！</text>
			</view>
			<view class="autoBox">
				<view class="imgBox">
					<view class="userImg" v-for="(item1,index1) in goodsDetail.memberList" :key='index1' v-if="index1<5">
						<image :src="item1.userAvatar" mode=""></image>
					</view>
					<view class="userImg" v-for="(item2,index2) in groupNum" :key='index2' v-if="index2<goodsDetail.groupPersonNum && index2+1>goodsDetail.memberList.length">
						?
					</view>
				</view>
			</view>
			<view class="groupBtn" @click="navToGroup(goodsDetail.id)" v-if="goodsDetail.isJoin==0 && goodsDetail.groupOrderStatus==2">我要参团</view>
			<view class="groupBtn"  v-if="goodsDetail.isJoin==1 && goodsDetail.groupOrderStatus==2">我已参团，邀请好友</view>
			<view class="groupBtn" @click="navToOrder(goodsDetail.id)" v-if="goodsDetail.isJoin==1 && goodsDetail.groupOrderStatus==3">已成团，查看订单</view>
			<view class="groupBtn"  v-if="goodsDetail.isJoin==1 && goodsDetail.groupOrderStatus==4">去逛逛其他商品</view>
		</view>
		<view class="recommended">
			  <view class="rec-title">
			    <image src="../../static/image/recommend.png" mode=""></image>
			  </view>
			  <view class="rec-goods-list">
			    <view
			        class="goods-item"
			        @click="navToDetailPage(val)"
			        v-for="(val,index) in recommendedList" :key='index'
			    >
			      <view style="padding-bottom: 10upx;">
			        <view class="image-wrapper">
			          <image :src="val.mainPicture" mode="aspectFill"></image>
			        </view>
			        <view class="title1">{{val.name}}</view>
			        <view class="describe">
			          {{val.keyword}}
			        </view>
			        <view class="price-box">
			          <text class="price">{{val.sellingPrice}}</text>
			          <text class="oldPrice">￥{{val.marketPrice}}</text>
			        </view>
			        <view class="goodsClassify">
			          <text class="classifyList1" v-if="val.isOwnShopName=='自营'">{{val.isOwnShopName}}</text>
			          <text class="evaluation">{{val.favorableRate}}好评</text>
			        </view>
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
				goodsDetail:{},
				groupNum:[0,0,0,0,0],
				hour:0,
				minutes:0,
				seconds:0,
				seckillTime:0,
				loadingType: 'more', //加载更多状态
				page:1,
				recommendedList:[],
				num:'',
			};
		},
		//加载更多
		onReachBottom() {
			if (this.loadingType === 'nomore') {
				return;
			}
			this.page++;
			this.recommended();
		},
		onLoad(options){
			this.num=options.num;
			this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME+'group/grouporder/groupOrderInfo/'+options.id,
					{token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:''}
				).then((data) => {
					// console.log(data)
					this.goodsDetail=data;
					this.seckillTime=data.countDown;
					this.timer();
				})
			this.recommended();
		},

		methods: {
			timer(){
				var _this=this;
				var seckill=setInterval(function(){
					_this.seckillTime-=1000;
					_this.hour=parseInt(_this.seckillTime / 3600000);
					_this.minutes =parseInt((_this.seckillTime % 3600000) / 60000) ;
					_this.seconds =parseInt((_this.seckillTime % 60000 ) / 1000) ;
				},1000)
				if(_this.seckillTime<0){
					clearInterval(seckill)
				}
			},
			// 立即支付
			navToGroup(id){
				uni.navigateTo({
				url: '/pages/order/createOrder?submitNow=true&groupBuyingId='+id+'&goodsNum='+this.num+'&isGroup='+2,
				 })
			},
			 //为你推荐
			recommended(){
			  this.$api.httpRequest(
			      'GET',
			      this.$constant.API_HOME+'index/recommend',
			      {page:this.page,limit:'10'}
			  ).then((data) => {
				  this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
				  data.total == 0 ? this.loadingType = 'nomore' : '';
				  if(this.page==1){
						this.recommendedList = data.list;
					}else{
						for(var i=0;i<data.list.length;i++){
							this.recommendedList.push(data.list[i])
						}
					}
			    // this.recommendedList=data.list;
			  });
			},
			// 进入订单
			navToOrder(id){
				uni.navigateTo({
					url: '/pages/order/orderDetail?id='+id
				})
			},
			 // 进入商品详情
			navToDetailPage(item){
			  //测试数据没有写id，用title代替
			  let id = item.id;
			  uni.navigateTo({
			    url: `/pages/product/product?id=${id}&type=1`,
			  })
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #fff;
		height: 100%;
	}
	.goodsList{
		border-top: 1upx solid #E8E8E8;
		border-bottom: 1upx solid #E8E8E8;
		display: flex;
		justify-content: space-between;
		padding: 20upx 30upx;
		background: #fff;
		.goodsImage{
			width: 198upx;
			height: 198upx;
			image{
				width: 198upx;
				height: 198upx;
			}
		}
		.goodsContent{
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.goodsTitle{
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 472upx;
				font-size: 28upx;
				color: #333333;
			}
			.keyWords{
				font-size: 24upx;
				color: #999;
			}
			.groupPrice{
				color: #F05161;
				font-size: 30upx;
			}
			.price{
				color: #999999;
				font-size: 24upx;
				text-decoration: line-through;
			}
		}
	}
	.groupBoxContent{
		text-align: center;
		.autoBox{
			display: flex;
			justify-content: space-around;
		}
		.imgBox{
			display: flex;
			margin: 30upx auto;
		}
		.userImg{

			margin-left: -20upx;
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			background: #EEEEEE;
			color: #999999;
			font-size: 32upx;
			text-align: center;
			line-height: 80upx;
			border: 1upx solid #fff;
			image{
				width: 80upx;
				height: 80upx;
				border-radius: 50%;
			}
		}
		.userNum1{
			font-size: 26upx;
			color: #999999;
			margin: 30upx auto;
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 30upx;
				height: 30upx;
			}
		}
		.userNum{
			margin: 30upx auto;
			// display: flex;
			// align-items: center;
			// flex-direction: column;
			font-size: 26upx;
			color: #999999;

			.userNumLeft{
				margin-right: 10upx;
			}
			.groupTime{
				background: #F05161;
				color: #fff;
				display: inline-block;
				width: 36upx;
				height: 36upx;
				text-align: center;
				line-height: 36upx;
				margin: 0 5upx;
				font-size: 20upx;
			}
		}
		.groupBtn{
			width: 690upx;
			height: 100upx;
			margin: 10upx auto;
			text-align: center;
			line-height: 100upx;
			background: #F05161;
			color: #fff;
			font-size: 34upx;
			border-radius: 8upx;
		}
	}
	 /* 为你推荐 */
	.recommended{
		margin-top: 30upx;
		padding: 0 20upx;
	  .rec-title{
	    image{
	      width: 100%;
	      height: 100upx;
	    }
	  }
	  .rec-goods-list{
	    display:flex;
	    flex-wrap:wrap;
		justify-content: space-between;
	    /* padding: 0 10upx; */
	    .goods-item{
	      margin: 10upx 0;
	      background: #fff;
	      display:flex;
	      flex-direction: column;
	      width: 349upx;
	      border-radius: 15upx;
	     /* &:nth-child(2n+1){
	        margin-right: 4%;
	      } */
	    }
	    .image-wrapper{
	      width: 100%;
	      height: 330upx;
	      border-radius: 3px;
	      overflow: hidden;
	      image{
	        width: 100%;
	        height: 100%;
	        opacity: 1;
	      }
	    }
	    .title1{
	      font-size: 28upx;
	      color: #333333;
	      padding:0 10upx;
	      margin: 10upx 0;
	      overflow: hidden;
	      text-overflow: ellipsis;
	      display: -webkit-box;
	      -webkit-line-clamp: 1;
	      -webkit-box-orient: vertical;
	    }
	    .price-box{
	      padding-right: 10upx;
	      font-size: 24upx;
	      color: $font-color-light;
	      padding:0 10upx;
	      margin: 10upx 0;
	    }
		.oldPrice{
		  text-decoration: line-through;
		}
	    .price{
	      font-size: $font-lg;
	      color: $uni-color-primary;
	      line-height: 1;
	      margin-right: 10upx;
	      &:before{
	        content: '￥';
	        font-size: 26upx;
	      }

	    }
	    .describe{
	      color: #999999;
	      font-size: 24upx;
	      margin-bottom: 10upx;
	      padding:0 10upx;
	    }
	    .goodsClassify{
	      font-size: 20upx;
	      margin: 13upx 0 20upx 0;
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
	      }
	    }

	  }

	}
</style>
