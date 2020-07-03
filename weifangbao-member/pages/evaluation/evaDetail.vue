<template>
	<view class="container">
		<view class="eva-con" v-if="evaList">
			<view class="eva-box">
				<view class="eva-first"> 
					<image class="portrait" :src="evaList.avatar" mode="aspectFill"></image>
					<view class="eva-star">
						<view class="eva-title">
							<text class="name">{{evaList.nickname}}</text>
							<text class="time">{{evaList.createDate}}</text>
						</view>
						<view class="starImg" >
							<image :src="val" mode="" v-for="(val,index) in starImg" :key='index'></image>
						</view>
					</view>
					

				</view>

				<view class="evaluation">
					<text class="con">{{evaList.content}}</text>
					<view class="right-img">
						<image :src="evaList.picture1" mode="widthFix" v-if="evaList.picture1"></image>
						<image :src="evaList.picture2" mode="widthFix" v-if="evaList.picture2"></image>
						<image :src="evaList.picture3" mode="widthFix" v-if="evaList.picture3"></image>
						<image :src="evaList.picture4" mode="widthFix" v-if="evaList.picture4"></image>
					</view>
					<view class="bot">
						<text class="attr"></text>
						<text class="time">{{evaList.createDate}}</text>
					</view>
				</view>
				<!-- <view class="replyEva" >
					<text class="replyName">店家：</text>
					<text>哈哈哈通天塔</text>
					<view class="replyTime">2019-03-15</view>
				</view> -->
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				evaList:null,
				userid:'',
				starImg:[],
				img1:'../../static/image/star2.png',
				img2:'../../static/image/Shape.png'
			};
		},
		async onLoad(options) {
			if(options.type && options.type==2){
				this.userid=options.userid;
				this.getEvaList(options.objId,options.orderGoodsId)
			}else{
				this.$api.httpRequest(
				  'GET',
				 this.$constant.API_HOME+'/member/userInfo',
				  {'token':this.$store.state.userInfo.token.token},
				).then((data) => {
				  this.userid=data.id;
				  this.getEvaList(options.spuId,options.orderGoodsId);
				
				})
			}
			
			
		},
		methods: {
			getEvaList(objId,orderGoodsId){
				this.evaList=[];
				this.$api.httpRequest(
					'GET',
					this.$constant.API_XOPEN_HOME + '/comment/topic/topicDetail', 
					{objId:objId,orderGoodsId:orderGoodsId,userid:this.userid},
					{key:'ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ'}
				).then((data) => {
					console.log(data);
					if(data){
						this.evaList=data;
						  for(var i=0;i<data.star;i++){
							this.starImg.push(this.img1)
						}
						for(var j=0;j<5-data.star;j++){
							 this.starImg.push(this.img2);
						}
						// console.log(data[0].star)
						console.log(this.starImg);
					}
					})
			},
		},

	}
</script>

<style lang='scss'>
	page,
	.container{
		background: $page-color-base;
		height: 100%;
		width: 100%;
		overflow-x: hidden;
	}
	

	.eva-box {
		background-color: white;
		padding: 10upx 30upx;
		margin-bottom:10upx;
		.eva-first {
			display: flex;
			align-items: center;
			padding-top: 10upx;
			.eva-star{
				display: flex;
				flex-direction: column;
				/* align-items: center; */
				.starImg{
					margin-left: 20upx;
					image{
						width: 32upx;
						height: 32upx;
					}
				}
				.eva-title{
					display: flex;
					justify-content: space-between;
					width: 620upx;
				}
				.time{
					color: #999999;
					/* float: right; */
					/* margin-top: 10upx; */
				}
			}
			image {
				width: 60upx;
				height: 60upx;
				border-radius: 50%;
			}

			text {
				font-size: 28upx;
				margin-left: 20upx;
			}
		}
		.line{
			width: 100%;
			background-color: gainsboro;
			height: 1upx;
			margin-bottom: 10upx;
		}
		.portrait {
			flex-shrink: 0;
			width: 80upx;
			height: 80upx;
			border-radius: 100px;
		}

	}

	.bot {
		display: flex;
		justify-content: space-between;
		font-size: $font-sm;
		color: #999999;
		margin-top: 20upx;
	}
	.eva-con{
		margin-top: 20upx;
	}
	.evaluation {
		font-size: 28upx;
.con{
				display: block;
				margin-top: 20upx;
			}
		.right-img {
			width: 100%;
			margin: 20upx 0;
			image {
				width: 100%;
				/* height: 160upx; */
				/* margin-right: 16upx; */
			}

		}
	}
	.replyEva{
		border-top: 1upx solid #F0F1F5;
		margin-top: 20upx;
		padding-top: 20upx;
		font-size: 24upx;
		.replyName{
			color: #F05161;
		}
		.replyTime{
			text-align: right;
			color: #999999;
		}
	}
</style>
