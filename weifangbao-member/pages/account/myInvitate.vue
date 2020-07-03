<template>
  <view class="content">
	<view class="friend">
		<text class="title">累计邀请好友</text>
		<view class="num">
			{{inventUsersCount}}人
			<view class="right" @click="invitateDetail">详情<image src="../../static/image/right.png" mode=""></image></view>
		</view>
	</view>
	<view class="money">
		<text class="title">累计获得返利</text>
		<view class="num">
			{{goldCountTotal}}金币
			<view class="right" @click="moneyDetail">详情<image src="../../static/image/right.png" mode=""></image></view>
		</view>
	</view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
		 token:'',
		 goldCountTotal:0,
		 inventUsersCount:0,
	  }
    },
    onLoad (options) {
      this.token=options.token;
	  this.$api.httpRequest(
	    'GET',
	    this.$constant.API_HOME + '/rebate/rebatelog/rebateTotal',
	    {token:this.token},
	  ).then((data) => {
		this.goldCountTotal=data.goldCountTotal;
	  	this.inventUsersCount=data.inventUsersCount;	
	  })
    },
    methods: {
		invitateDetail(){
			uni.navigateTo({
				url:"/pages/account/invitateFriend?token="+this.token
			})
		},
		moneyDetail(){
			uni.navigateTo({
				url:"/pages/account/invitateMoney?token="+this.token
			})
		}
	}
  }
</script>

<style lang='scss'>
  page,
  .content {
    height: 100%;
    background-color: #FFFFFF;
  }
.friend,.money{
	margin: 30upx 20upx;
	background: #F05161;
	color: #FFFFFF;
	height: 236upx;
	border-radius: 10upx;
	box-sizing: border-box;
	padding: 20upx;
	.title{
		display: block;
		color: #FFFFFF;
		font-size: 28upx;
		margin-bottom: 20upx;
		height: 40upx !important;
		line-height: 40upx;
	}
	.num{
		font-size: 72upx;
		text-align: center;
		.right{
			margin-top: 30upx;
			display: flex;
			align-items: center;
			float: right;
			font-size: 28upx;
			image{
				width: 34upx;
				height: 34upx;
			}
		}
	}
}
.money{
	background: #3C8AF6;
}
</style>
