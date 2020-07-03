<template>
	<view class="content">
		<view class="wrap">
			<view class="list">
				<view class="left">状态</view>
				<view class="right">{{detail.statusName}}</view>
			</view>
			<view class="list">
				<view class="left">楼盘</view>
				<view class="right">{{detail.propertyName}}</view>
			</view>
			<view class="list">
				<view class="left">客户姓名</view>
				<view class="right">{{detail.customerName}}</view>
			</view>
			<view class="list">
				<view class="left">手机号</view>
				<view class="right">{{detail.mobile}}</view>
			</view>
			<view class="list">
				<view class="left">看房时间</view>
				<view class="right">{{detail.appointTime}}</view>
			</view>
		</view>
    <view class="stateBtn" v-if="detail.status==1" @click="changeStatus">确认看房</view>
    <view class="stateBtn" v-if="detail.status==2" @click="changeStatus">确认认购</view>
    <view class="stateBtn" v-if="detail.status==3" @click="changeStatus">确认签约</view>
	</view>
</template> 

<script>
	export default {
		
		data() {
			return {
        detail:{},
      };
		},
		onLoad(options){
      console.log(options.detail)
			this.detail=JSON.parse(options.detail)
      console.log(this.detail)
		},
		 
		methods: {
			changeStatus(){
				this.$api.httpRequest(
					'PUT',
					this.$constant.API_HOME + '/report/report/status',
          {
           id:this.detail.id,
           status:this.detail.status-0+1 
          },
					{token: this.$store.state.userInfo.token.token}
				).then((data) => {
					console.log(data);
          this.$api.msg('提交成功',2000)
          setTimeout(function() {
            uni.navigateBack()
          }, 2000);
					// this.dataList=data;
     //      console.log(this.dataList.statusName)
				})
			},
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: #F8F8F8;
		height: 100%;
	}
	.wrap{
		width: 710upx;
		margin: 20upx auto;
		background: #fff;
		font-size: 28upx;
		border: 1upx solid #fff;
		border-radius: 8upx;
		.list{
			display: flex;
			justify-content: space-between;
			margin: 28upx;
			.right{
				color: #666666;
			}
		}
	}
  .stateBtn{
    margin: 30upx auto;
    width: 690upx;
    height: 80upx;
    line-height: 80upx;
    border-radius: 10upx;
    text-align: center;
    background: #3171F2;
    color: #FFFFFF;
  }
</style>

