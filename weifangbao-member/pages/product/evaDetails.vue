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
					<!-- <view class="bot">
						<text class="time">{{evaList.createDate}}</text>
					</view> -->
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
			this.evaList=JSON.parse(options.evaList);
			 for(var i=0;i<this.evaList.star;i++){
				this.starImg.push(this.img1)
			}
			for(var j=0;j<5-this.evaList.star;j++){
				 this.starImg.push(this.img2);
			}
		},
		methods: {
			
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
