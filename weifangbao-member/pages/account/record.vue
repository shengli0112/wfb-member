<template>  
    <view class="container">  
	  <view class="box" v-if="dataList.length>0">
	  	<view class="list" v-for="(val,index) in dataList" :key='index' v-if="dataList.length>0">
			<view class="list-left">
				<view class="list-title" v-if="val.priceType==1">好友下单返利</view>
				<view class="list-title" v-if="val.priceType==2">订单支付抵扣</view>
				<view class="list-title" v-if="val.priceType==3">提现</view>
				<view class="list-title" v-if="val.priceType==4">提现失败</view>
				<view class="text">订单编号：{{val.orderSn}}</view>
				<view class="text" v-if="val.priceType==2">支付时间：{{val.payTime}}</view>
				<view class="text" v-if="val.priceType==1">返利时间：{{val.payTime}}</view>
				<view class="text" v-if="val.priceType==3">申请时间：{{val.createDate}}</view>
				<view class="text" v-if="val.priceType==4">退款时间：{{val.payTime}}</view>
			</view>
			<view class="list-right" v-if="val.priceType==2 || val.priceType==3">-{{val.rebateAmount}}金币</view>
			<view class="list-right1" v-if="val.priceType==1 || val.priceType==4">+{{val.rebateAmount}}金币</view>
		</view>
	  </view>
	  <uni-load-more :status="loadingType"></uni-load-more>
    </view>  
</template>  
<script>  
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    export default {
		components: {
			uniLoadMore,
		},
		data(){
			return {
				dataList:[],
				priceType:'',
				page:1,
				loadingType: 'more', //加载更多状态
				token:''
			}
		},
		onLoad(options){
			 this.token=options.token;
			 this.getData();
		},
		 //加载更多
		onReachBottom(){
		// this.loadData();
		if(this.loadingType === 'nomore'){
			return;
		}
		this.page++;
		this.getData();
    },
        methods: {
			getData(){
				this.$api.httpRequest(
				  'GET',
				  this.$constant.API_HOME + '/rebate/rebatehistory/page',
				  {'page':this.page,'limit':10},
				  {token:this.token}
				).then((data) => {
					this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
				  // console.log(data);
				   if(this.page==1){
					   	this.dataList = data.list;
					   }else{
					   	for(var i=0;i<data.list.length;i++){
					   		this.dataList.push(data.list[i])
					   	}
					   }
				 // this.dataList=data.list;
				})
			}
		}  
    }  
</script>  
<style lang='scss'>
	page,.container{
		 background: #F0F1F5;
		 overflow: hidden;
	}
	.box{
		margin-top: 20upx;
		padding: 20upx 30upx;
		background: #FFFFFF;
		.list:last-child{
			border-bottom: 0upx;
		}
		.list{
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 2upx solid #E8E8E8;
			padding: 20upx 0;
			.list-left{
				.list-title{
					font-size: 32upx;
					color: #333333;
				}
				.text{
					color: #999999;
					font-size: 24upx;
					margin: 12upx 0;
				}
			}
			.list-right{
				font-size: 30upx;
				color: #F05161;
			}
			.list-right1{
				font-size: 30upx;
				color: #4EC053;
			}
		}
		
	}
</style>