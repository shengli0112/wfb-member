<template>
  <view class="content">
<!-- <view class="user">
   <view class="list">
 		   <view class="user-img"><image src="../../static/missing-face.png" mode=""></image></view>
 		   <view class="user-content">
 			   <view class="name">eee</view>
 			   <view class="time">注册时间：2019-01-12</view>
 		   </view>
   </view>
   
 </view> -->
   <view class="user">
	   <view class="list" v-for="(val,index) in unionList" :key='index'>
		   <view class="user-img"><image :src="val.avatar" mode=""></image></view>
		   <view class="user-content">
			   <view class="name">{{val.nickname}}</view>
			   <view class="time">注册时间：{{val.createDate}}</view>
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
    data () {
      return {
		 layer:1,
		 unionList:[],
     page:1,
     loadingType: 'more', //加载更多状态
	  }
    },
    onReachBottom() {
    	if (this.loadingType === 'nomore') {
    		return;
    	}
    	this.page++;
    	this.getList();
    },
    onLoad (options) {
      this.getList();
    },
    methods: {
		getList(){
      this.$api.httpRequest(
          'GET',
          this.$constant.API_HOME+'member/invite/page',
          {
            page:this.page,
            limit:10
          },
          {token:this.$store.state.userInfo.token.token}
      ).then((data) => {
        this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
        data.total == 0 ? this.loadingType = 'nomore' : '';
        if (this.page != 1) {
        	for (var i = 0; i < data.list.length; i++) {
        		this.unionList.push(data.list[i]);
        	}
        } else {
        	this.unionList = data.list;
        }
      // this.unionList=data.list;
        console.log(data);
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
			  .name{
				  color: #333333;
				  font-size:32upx;
			  }
			  .time{
				  margin-top: 10upx;
				  color: #999999;
				  font-size: 24upx;
			  }
		  }
	  }  
  }
</style>
