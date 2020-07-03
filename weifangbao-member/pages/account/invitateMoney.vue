<template>
  <view class="content">
   <view class="user">
	   <view class="list" v-for="(val,index) in dataList" :key='index' v-if="dataList.length>0">
		   <view class="user-img"><image :src="val.avatar" mode=""></image></view>
		   <view class="user-content">
			   <view class="name">{{val.nickname}}</view>
			   <view class="layer" v-if="val.priceType==1">一级好友</view>
			   <view class="layer" v-if="val.priceType==2">二级好友</view>
			   <view class="time">注册时间：{{val.createDate}}</view>
		   </view>
		   <view class="gold">+{{val.rebateAmount}}金币</view>
	   </view>
	    <!-- <view class="list">
	   		   <view class="user-img"><image src="../../static/missing-face.png" mode=""></image></view>
	   		   <view class="user-content">
	   			   <view class="name">齐天大圣</view>
				   <view class="layer">一级好友</view>
	   			   <view class="time">注册时间：2019-02-21 18:00</view>
	   		   </view>
			   <view class="gold">+100金币</view>
	   </view> -->
   </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
		 dataList:[],
		 token:''
	  }
    },
    onLoad (options) {
	  this.token=options.token;
      this.$api.httpRequest(
        'GET',
        this.$constant.API_HOME + '/rebate/rebatelog/getRebatePage',
        {'page':1,'limit':10},
        {token:this.token}
      ).then((data) => {
        console.log(data);
       this.dataList=data.list;
      })
    },
    methods: {
		
	}
  }
</script>

<style lang='scss'>
  page,
  .content {
    height: 100%;
    background-color: #f8f8f8;
  }
  .user{
	  margin-top: 20upx; 
	  .list:last-child{
			  border: 0upx;
		  }
	  .list{
		  display: flex;
		  align-items: center;
		  padding: 30upx;
		  background: #FFFFFF;
		  border-bottom: 1upx solid #E8E8E8;
		 
		  .user-img{
			  image{
				    width: 90upx;
					height: 90upx;
					border-radius: 50%;
			  } 
		  }
		  .user-content{
			  margin-left: 30upx;
			  width: 400upx;
			  .name{
				  color: #333333;
				  font-size:32upx;
			  }
			  .time,.layer{
				  margin-top: 10upx;
				  color: #999999;
				  font-size: 24upx;
			  }
		  }
		  .gold{
			  color: #4EC053;
			  font-size: 30upx;
			  width: 180upx;
			  text-align: right;
		  }
	  }  
  }
</style>
