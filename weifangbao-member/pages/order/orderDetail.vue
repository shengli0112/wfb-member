<template>
	<view class="content">
		<view class="wrap">
			<view class="list">
				<view class="left">状态</view>
				<view class="right">{{dataList.statusName}}</view>
			</view>
			<view class="list">
				<view class="left">楼盘</view>
				<view class="right">{{dataList.propertyName}}</view>
			</view>
			<view class="list">
				<view class="left">佣金</view>
				<view class="right">{{dataList.commission}}</view>
			</view>
			<view class="list">
				<view class="left">客户姓名</view>
				<view class="right">{{dataList.customerName}}</view>
			</view>
			<view class="list">
				<view class="left">手机号</view>
				<view class="right">{{dataList.mobile}}</view>
			</view>
			<view class="list">
				<view class="left">看房时间</view>
				<view class="right">{{dataList.appointTime}}</view>
			</view>
		</view>
	</view>
</template> 

<script>
	export default {
		
		data() {
			return {
        dataList:{},
      };
		},
		onShow(){
			if(this.id!=''){
				this.goDetail(this.id);
			}
		},
		onLoad(options){
			this.goDetail(options.id);
			this.id=options.id
		},
		 
		methods: {
			goDetail(id){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'report/report/'+id,
					{token: this.$store.state.userInfo.token.token}
				).then((data) => {
					console.log(data);
					this.dataList=data;
          console.log(this.dataList.statusName)
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
</style>

