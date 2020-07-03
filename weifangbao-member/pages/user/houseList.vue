<template>
	<view class="content">
    <view class="search">
    	<input
    	@input="handleInput"
    	class="search-input"
    	type="text"
    	focus
    	placeholder="请输入要搜索的楼盘"
    	/>
      <view class="inputBtn" @click="getSearchList(),isSearch=true,page1=1,searchList=[]">搜索</view>
    </view>
			<view class="houseList"  v-for="(item, index) in goodsList" :key="index" @click="handleClick(item)" v-if="!isSearch">
      <view class="houseName">{{item.propertyName}}<text class="areaName">{{item.areaName}}</text></view>
      <view class="houseDetail">

        <text class="priceLeft" >{{item.unitPrice}}元/㎡</text>
        <text class="priceRight" >佣金：{{item.commission}}</text>
      </view>


			</view>
      <view class="houseList"  v-for="(item, index) in searchList" :key="index" @click="handleClick(item)" v-if="isSearch">
      	<view class="houseName">{{item.propertyName}}<text class="areaName">{{item.areaName}}</text></view>
      	<view class="houseDetail">

      	  <text class="priceLeft" >{{item.unitPrice}}元/㎡</text>
      	  <text class="priceRight" >佣金：{{item.commission}}</text>
      	</view>
      </view>
		<uni-load-more :status="loadingType" v-if="!isSearch"></uni-load-more>
    <uni-load-more :status="loadingType1" v-else></uni-load-more>
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
				loadingType: 'more', //加载更多状态
				goodsList: [],
				page: 1, //请求页数
				index:0,
        keyword:'',
        page1: 1,
        searchList: [],
        loadingType1: 'more', //加载更多状态
        isSearch: false
			};
		},

		onLoad(options) {
      console.log(options.index);
      this.index=options.index;
		this.getData();
		},

		//加载更多
		onReachBottom() {
			// this.loadData();
      if(this.isSearch){
        if (this.loadingType1 === 'nomore') {
        	return;
        }
        this.page1++;
        this.getSearchList();
      }else{
        if (this.loadingType === 'nomore') {
        	return;
        }
        this.page++;
        this.getData();
      }

		},
		methods: {
      getSearchList(){
        	this.$api.httpRequest(
        		'GET',
        		this.$constant.API_HOME + 'property/property/user/page',
        		{
        			page:this.page1,
        			limit:10,
              propertyName:this.keyword
        		},
        		{
        			token: this.$store.state.hasLogin?this.$store.state.userInfo.token.token:''
        		}
        	).then((data) => {

         if (this.page == 1) {
         	this.searchList = data.list;
         } else {

         for (var i = 0; i < data.list.length; i++) {
         	this.searchList.push(data.list[i])
         }
         }
        		this.page1 == Math.ceil(data.total / 10) ? this.loadingType1 = 'nomore' : this.loadingType1 = 'more';
        		data.total == 0 ? this.loadingType1 = 'nomore' : '';

        	})

      },
      handleInput (e) {
      	this.keyword = e.detail.value
        console.log(this.keyword)
        if(this.keyword==''){
          this.isSearch=false
        }
      },
      handleClick (e) {
      		this.$api.prePage().dataList[this.index].propertyId=e.id
      		this.$set(this.$api.prePage().propertyName,this.index,e.propertyName)
      		uni.navigateBack()
      		return ;
      },
			// 封装加载
			getData() {
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'property/property/user/page',
					{
						page:this.page,
						limit:10,
					},
					{
						token: this.$store.state.hasLogin?this.$store.state.userInfo.token.token:''
					}
				).then((data) => {

       if (this.page == 1) {
       	this.goodsList = data.list;
       } else {

       for (var i = 0; i < data.list.length; i++) {
       	this.goodsList.push(data.list[i])
       }
       }
					this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
					data.total == 0 ? this.loadingType = 'nomore' : '';

				})
			},


			},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: #F0F1F5;
	}
  .search{
  	background-color: #fff;
  	padding: 10upx 20upx;
  	border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
  }

  .search-input{
  	font-size:28upx;
  	border: 1px solid #e5e5e5;
  	border-radius: 3px;
  	padding: 10upx 20upx 10upx 20upx;
    height: 70upx !important;
    width: 650upx;
  }
  .inputBtn{
    width: 90upx;
    text-align: right;
    color: #333;
    // color-profile: ;
  }
  .houseList{
    background: #FFFFFF;
    // height: 92upx;
    // line-height: 92upx;
    padding: 20upx 30upx;
    border-bottom: 1upx solid #F0F1F5;
    color: #333;
    .areaName{
      margin-left: 20upx;
    }
    .houseDetail{
      margin-top: 20upx;
      .priceLeft{
        margin-right: 20upx;
      }
    }

  }
</style>
