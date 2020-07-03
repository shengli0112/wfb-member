<template>
	<view class="wrap">
		<!-- 待入驻 -->
		<view class="title" v-if="storeCheckStatus==0">
			<image src="../../static/image/icon_seller.png" mode=""></image>
			<view class="titleOne">商家入驻</view>
			<view>完成资质认证，享受更多服务</view>
		</view>
		<view class="content" v-if="storeCheckStatus==0">
			<view class="contentTitle">认证材料</view>
			<view class="contentList">请确保您为店铺负责人并准备好以下相关材料</view>
			<view class="contentList">1.店铺负责人身份证正反面图片</view>
			<view class="contentList">2.企业营业执照</view>
			<view class="contentTitle">认证说明</view>
			<view class="contentList">1.您所提交的资料仅供仙宝认证使用，未经授权不会将消息透漏给第三方</view>
			<view class="contentList">2.请确保个体经营处于正常经营状态，若出现已被吊销、被列入经营异常名录等异常状态，将无法通过</view>
			<view class="contentList">3.审核通过后，不支持修改，请仔细确认无误后提交，若存在特殊情况需修改，请致电客服</view>
		</view>
		<view class="btn" @click="navToCertification"  v-if="storeCheckStatus==0">立即认证</view>
		<!-- 入驻审核中 -->
		<view class="title title1" v-if="storeCheckStatus==1">
			<image src="../../static/image/ing.png" mode=""></image>
			<view>认真审核中！</view>
			<view>请耐心等待审核结果</view>
		</view>
		<!-- 入驻通过 -->
		<view class="title title1" v-if="storeCheckStatus==2">
			<image src="../../static/image/sucess.png" mode=""></image>
			<view>认证成功!</view>
		</view>
		<!-- 入驻被拒 -->
		<view class="title title1" v-if="storeCheckStatus==3">
			<image src="../../static/image/ing.png" mode=""></image>
			<view>认证失败！</view>
		</view>
		<view class="failureBtn" v-if="storeCheckStatus==3" @click="storeCheckStatus=0">重新认证</view>
		<view class="reason" v-if="storeCheckStatus==3">
			<view class="reasonTitle">失败原因：</view>
			<view>{{cause}}</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				id:'',
				storeCheckStatus:3,
				cause:''//失败备注
			}
		},
		onLoad(options){
			this.id=options.id;
			this.$api.httpRequest(
			  'GET',
			 this.$constant.API_HOME+'//store/store/appApplyStoreInfo',
			  {'token':this.$store.state.userInfo.token.token},
			).then((data) => {
			  console.log(data.storeCheckStatus);
			  this.cause=data.applyLogs?data.applyLogs[0].cause:'';
			  // 店铺审核状态 0申请中 1入驻待审核、2入驻通过、3入驻被拒
			  this.storeCheckStatus=data.storeCheckStatus;
			})
		},
		methods: {
			navToCertification(){
				uni.navigateTo({
					url:'/pages/merchants/certification?id='+this.id
				})
			}
		},

	}
</script>
<style lang="scss">
	page{
		background: #FFFFFF;
		padding-bottom: 160upx;
	}
	.content{
		margin: 20upx 0;
	}
	.title{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30upx 0;
		background: #F2F6FF;
		image{
			width: 136upx;
			height: 136upx;
			margin-bottom: 30upx;
		}
		.titleOne{
			font-size: 40upx;
			font-weight: 600;
			margin-bottom: 30upx;
		}
	}
	.content{
		padding: 20upx;
		padding-top: 0;
		font-size: 28upx;
		.contentTitle{
			font-weight: 550;
			margin: 20upx 0;
		}
		.contentList{
			color: #999999;
		}
	}
	.btn{
		width: 690upx;
		height: 96upx;
		line-height: 96upx;
		text-align: center;
		background: #F05161;
		color: white;
		font-size: 32upx;
		position: absolute;
		bottom: 10upx;
		left: 0;
		right: 0;
		margin: 0 auto;
	}
	.title1{
		background: #FFFFFF;
		margin-top: 50upx;
		image{
			width: 180upx;
			height: 200upx;
			margin-bottom: 30upx;
		}
	}
	.failureBtn{
		width: 434upx;
		height: 96upx;
		line-height: 96upx;
		text-align: center;
		background: #F05161;
		color: white;
		font-size: 32upx;
		margin: 40upx auto;
		border-radius: 48upx;
	}
	.reason{
		padding: 40upx;
		font-size: 32upx;
		color: #999999; 
		.reasonTitle{
			color: #333;
			margin-bottom: 20upx;
		}
	}
</style>

