<template>
  <view class="content">
   	<!-- 店铺 -->
   <scroll-view class="box" scroll-x="true" v-for="(val,index) in storeDetail" :key='index' :scroll-left='scrollLeft' @scroll="scroll">
	    <view class="store">
	   	   <view class="storeContent">
	   	  			<view class="store-img">
	   	  				<image :src="val.storeAvatar" mode=""></image>
	   	  			</view>
	   	  			<view class="storeInfo">
	   	  				<view class="storeName">{{val.storeName}}</view>
	   	  				<view class="storeFans">{{val.collectNum}}人关注</view>
	   	  			</view>
	   	  			<view class="inStore" @click="goStore(val.storeId)">进店逛逛</view>
	   	  </view>
	   	  <view class="del" @click="delStore(val.id)">删除</view>
	   </view>
   </scroll-view>
   <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  export default {
	  components: {
		  uniLoadMore
		},
    data () {
      return {
		token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:'',
		storeDetail:[],
		type:1,
		scrollLeft:0,
		oldScrollLeft:0,
		loadingType: 'more', //加载更多状态
		page: 1, //请求页数
	  }
    },
	  //加载更多
		onReachBottom(){
		// this.loadData();
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		this.getCollectList();
		
    },
    onLoad (options) {
		this.type=options.type;
		if(options.token){
			this.token=options.token;
		}
      	this.getCollectList();
    },
    methods: {
		scroll: function(e) {
		    this.oldScrollLeft = e.detail.scrollLeft
		},
		getCollectList(){
			this.$api.httpRequest(
				'GET',
				this.$constant.API_HOME+'store/storecollect//page',
				{page:this.page,limit:10},
				 {token:this.token}
			).then((data) => {
				this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
					if(this.page!=1){
						for(var i=0;i<data.list.length;i++){
							this.storeDetail.push(data.list[i]);
						}
					}else{
						this.storeDetail=data.list;
					}
				})
		},
		delStore(id){
				this.$api.httpRequest(
				'DELETE',
				this.$constant.API_HOME+'store/storecollect',
				JSON.stringify([id]),
				{token:this.token},
			).then((data) => {
				this.getCollectList();
				this.scrollLeft=this.oldScrollLeft;
				this.$nextTick(function(){
					this.scrollLeft=0;
				})
				})
		},
		goStore(id){
			uni.navigateTo({
				url:"../store/store?id="+id+"&token="+this.token+"&type="+this.type
			})
		}
	}
  }
</script>

<style lang='scss'>
  page,
  .content {
    height: 100%;
    background-color: #f8f8f8;
  }
 ::-webkit-scrollbar {
		width: 0;
		height: 0;
		background-color: transparent;
	}
  .store{
  	margin-top: 20upx;
  	background-color: white;
	width: 900upx;
	display: flex;
	justify-content: space-between;
	align-items: center;
  	.del{
		width: 150upx;
		background: #F05161;
		color: #fff;
		height: 128upx;
		line-height: 128upx;
		font-size: 30upx;
		text-align: center;
	}
	.storeContent{
		width: 750upx;
		height: 128upx;
		padding:20upx 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		.store-img{
			width: 88upx;
			height: 88upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.storeInfo{
			width: 400upx;
			text-align: left;
			font-size: 24upx;
			.storeFans{
				color: #999999;
			}
		}
		.inStore{
			width: 168upx;
			height: 56upx;
			text-align: center;
			line-height: 56upx;
			border-radius: 28upx;
			background-color: #F05161;
			color: white;
			font-size: 24upx;
		}
	}
  	
  }
</style>
