<template>  
    <view class="container">  
		<view class="box">
			
			<view class="box-top">
				<view class="top-left">
					<view>金币余额</view>
					<!-- <text>{{dataObj.goldCount}}</text> -->
				</view>
				<view class="top-right" @click="isMask=true"><image src="../../static/image/33333.png" mode=""></image>提现说明</view>
			</view>
			<view class="box-gold">
				<text>{{dataObj.goldCount}}</text>
				<view class="gold-right" @click="withdrawal">
					提现
				</view>
			</view>
			<view class="box-bottom">
				<view class="bottom-left">
					<view>今日金币</view>
					<text>{{dataObj.todayGoldCount}}</text>
				</view>
				<view class="bottom-right">
					<view>累计赚取</view>
					<text>{{dataObj.goldCountTotal}}</text>
				</view>
			</view>
		</view>	
		<view class="record" @click="goRecord">收支记录<image src="../../static/image/Combined%20Shape@2x.png" mode=""></image></view>
		<!-- <view class="instructions" @click="isMask=true">提现说明</view> -->
		<view class="mask" v-if="isMask">
			<view class="mask-content">
				<view class="mask-title">提现说明</view>
				<scroll-view :scroll-y='true' class="mask-scroll">1.提现到账时间：<br/>
通常情况下提交提现后24小时到账，请耐心等待哦<br/>
4.具体提现到账时间按提现申请后的提示时间为准哦~<br/>
1.提现到账时间：<br/>
通常情况下提交提现后24小时到账，请耐心等待哦<br/>
4.具体提现到账时间按提现申请后的提示时间为准哦~<br/>
</scroll-view>
				<view class="mask-btn" @click="isMask=false">我知道了</view>
			</view>
		</view>
    </view>  
</template>  
<script>  
    export default {
		data(){
			return {
				isMask:false,//提现说明是否显示
				dataObj:{
					'goldCount':'',
					'todayGoldCount':'',
					'goldCountTotal':'',
					'inventUsersCount':''
				},
				token:'',
				type:1,
			}
		},
		onLoad(options){
			if(options.token){
				this.token=options.token;
				this.type=2;
			}else{
				this.token=this.$store.state.userInfo.token.token
			}
			
			this.$api.httpRequest(
			    'GET',
			    this.$constant.API_HOME+'rebate/rebatelog/rebateTotal',
			    {token:this.token}
			).then((data) => {
			  console.log(data);
			  this.dataObj.goldCount=data.goldCount;
			  this.dataObj.todayGoldCount=data.todayGoldCount;
			  this.dataObj.goldCountTotal=data.goldCountTotal;
			  this.dataObj.inventUsersCount=data.inventUsersCount;
			})
		},
		
        methods: {
			// 收支记录
			goRecord(){
				uni.navigateTo({
					url:'/pages/account/record?token='+this.token
				})
			},
			// 提现
			withdrawal(){
				uni.navigateTo({
					url:'/pages/account/withdrawal?type='+this.type+'&token='+this.token
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
		width: 710upx;
		height: 332upx;
		margin: 20upx;
		background: linear-gradient(left,#F0B851,#FB3535);
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		color: #FFFFFF;
		box-sizing: border-box;
		padding: 40upx;
		border-radius: 20upx;
		.box-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.top-left{
				font-size: 24upx;
				text{
					font-size: 60upx;
					display: block;
					margin-top: 20upx;
				}
			}
			.top-right{
				/* width: 168upx; */
				/* height: 56upx; */
				text-align: center;
				/* line-height: 56upx; */
				/* background: #FFFFFF; */
				/* color: #F05161; */
				font-size: 24upx;
				/* border-radius: 28upx; */
				display: flex;
				align-items: center;
				image{
					width: 24upx;
					height: 24upx;
					margin-right: 5upx;
				}
			}
		}
		.box-gold{
			display: flex;
			justify-content: space-between;
			font-size: 60upx;
			align-items: center;
			.gold-right{
				width: 168upx;
				height: 56upx;
				text-align: center;
				line-height: 56upx;
				background: #FFFFFF;
				color: #F05161;
				font-size: 24upx;
				border-radius: 28upx;
			}
			
		}
		.box-bottom{
			display: flex;
			/* justify-content: space-between; */
			.bottom-left,.bottom-right{
				width: 50%;
				font-size: 24upx;
				text{
					font-size: 36upx;
					display: block;
					margin-top: 10upx;
				}
			}
			.bottom-right{
				border-left: 4upx solid #F39C4B;
				padding-left: 54upx;
			}
		}
	}
	.record{
		padding: 28upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		background: #FFFFFF;
		margin: 20upx;
		border-radius: 10upx;
		image{
			width: 30upx;
			height: 30upx;
		}
	}
	.instructions{
		font-size: 26upx;
		text-align: right;
		/* padding: 20upx; */
		/* background: #FFFFFF; */
		margin: 20upx;
		position: absolute;
		top: 0;
	}
	.mask{
		position: absolute;
		top: -20upx;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
		.mask-content{
			width: 632upx;
			margin: 196upx auto;
			background: #FFFFFF;
			border-radius: 15upx;
			.mask-title{
				text-align: center;
				font-size: 42upx;
				color: #333333;
				padding-top: 40upx;
			}
			.mask-scroll{
				width: 540upx;
				margin: 34upx auto;
				max-height: 500upx;
				color: #999999;
				font-size: 30upx;
			}
			.mask-btn{
				width: 100%;
				text-align: center;
				color: #FFFFFF;
				background: #F05161;
				font-size: 34upx;
				height: 88upx;
				line-height: 88upx;
				border-bottom-right-radius: 15upx;
				border-bottom-left-radius: 15upx;
			}
		}
	}
</style>