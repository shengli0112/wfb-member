<template>
	<view class="wrap">
		<view class="content">
			<view class="list">
				<view class="listTitle"><text class="import">*</text>店铺名称</view>
				<input type="text" value="" placeholder="请填写" v-model="storeName"/>
			</view>
			<view class="list">
				<view class="listTitle"><text class="import">*</text>店铺负责人姓名</view>
				<input type="text" value="" placeholder="请填写" v-model="storePersonName"/>
			</view>
			<view class="list">
				<view class="listTitle"><text class="import">*</text>店铺负责人身份证号码</view>
				<input type="text" value="" placeholder="请填写" v-model="storePersonIdentity"/>
			</view>
			<view class="list">
				<view class="listTitle"><text class="import">*</text>统一信用代码/注册号</view>
				<input type="text" value="" placeholder="请填写" v-model="businessLicenceNumber"/>
			</view>
			<view class="list2">
				<view class="listTitle"><text class="import">*</text>经营者证件信息</view>
				<view>请确保证件图片真实，证件号码清晰可见</view>
			</view>
			<view class="list" @click="isChangeImg=true,imgIndex=0">
				<view class="listTitle"><text class="import">*</text>身份证正面</view>
				<view class="listBtn">
					<text v-if="!userImg[0]">+</text>
					<image v-else :src="userImg[0]" mode=""></image>
				</view>
			</view>
			<view class="list" @click="isChangeImg=true,imgIndex=1">
				<view class="listTitle"><text class="import">*</text>身份证反面</view>
				<view class="listBtn">
					<text v-if="!userImg[1]">+</text>
					<image v-else :src="userImg[1]" mode=""></image>
				</view>
			</view>
			<view class="list" @click="isChangeImg=true,imgIndex=2">
				<view class="listTitle"><text class="import">*</text>手持身份证照</view>
				<view class="listBtn">
					<text v-if="!userImg[2]">+</text>
					<image v-else :src="userImg[2]" mode=""></image>
				</view>
			</view>
			<view class="list" @click="isChangeImg=true,imgIndex=3">
				<view class="listTitle"><text class="import">*</text>营业执照</view>
				<view class="listBtn">
					<text v-if="!userImg[3]">+</text>
					<image v-else :src="userImg[3]" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="btn" @click="submit">提交审核</view>
		<view class="mask" v-if="isChangeImg" @click="isChangeImg=false"></view>
		<view class="changeImg" v-if="isChangeImg">
			<view class="listBox">
				<view class="list" @click="isChangeImg=false,upLoadImg('camera')">拍照</view>
				<view class="list" @click="isChangeImg=false,upLoadImg('album')">从相册选择</view>
			</view>
			<view class="cancle" @click="isChangeImg=false">取消</view>
		</view>
	</view>
</template>

<script>
	
	export default{
		data(){
			return {
				isChangeImg:false,
				userImg:[],
				sourceType:'',
				imgIndex:0,
				storeName:'',//店铺名
				storePersonName:'',//姓名
				storePersonIdentity:'',//身份证
				businessLicenceNumber:'',//营业执照号
			}
		},
		onLoad(){
			
		},
		methods: {
			navToCertification(){
				uni.navigateTo({
					url:'/pages/merchants/merchants'
				})
			},
			// 上传图片
			upLoadImg(sourceType){
				this.sourceType=sourceType;
				let _this=this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [this.sourceType], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
						const tempFilePaths = res.tempFilePaths;
						uni.uploadFile({
							url: 'http://47.101.184.111:9000/x_open/sys/oss/upload',
							filePath: tempFilePaths[0],
							name: 'file',
							formData: {
								'user': 'test'
							},
							success: (uploadFileRes) => {
								console.log(JSON.parse(uploadFileRes.data).data.src)
								_this.$set(_this.userImg,_this.imgIndex,JSON.parse(uploadFileRes.data).data.src)
							}
						});
					}
				});
			},
			// 入驻第一步
			auditOne(){
				this.$api.httpRequest(
				  'POST',
				 this.$constant.API_HOME+'/store/store/appApplyStore1',
				  {id:this.id,storeName:this.storeName,storePersonName:this.storePersonName,storePersonIdentity:this.storePersonIdentity,businessLicenceNumber:this.businessLicenceNumber},
				  {'token':this.$store.state.userInfo.token.token},
				).then((data) => {
				  this.auditTwo();
				})
			},
			// 入驻第二步
			auditTwo(){
				this.$api.httpRequest(
				  'POST',
				 this.$constant.API_HOME+'/store/store/appApplyStore2',
				  {id:this.id,storePersonCertFront:this.userImg[0],storePersonCertBack:this.userImg[1]},
				  {'token':this.$store.state.userInfo.token.token},
				).then((data) => {
				  this.auditThree();
				})
			},
			// 入驻第三步
			auditThree(){
				this.$api.httpRequest(
				  'POST',
				 this.$constant.API_HOME+'/store/store/appApplyStore3',
				  {id:this.id,storePersonCertHand:this.userImg[2],businessLicenceCert:this.userImg[3]},
				  {'token':this.$store.state.userInfo.token.token},
				).then((data) => {
				  uni.navigateBack({
				  	delta: 1
				  })
				})
			},
			
			// 提交审核
			submit(){
				if(this.storeName==''){
					this.$api.msg('店铺名不能为空')
					return false;
				}else if(this.storePersonName==''){
					this.$api.msg('负责人姓名不能为空')
					return false;
				}else if(this.storePersonIdentity==''){
					this.$api.msg('负责人身份证不能为空')
					return false;
				}else if(this.businessLicenceNumber==''){
					this.$api.msg('统一信用代码不能为空')
					return false;
				}else if(this.userImg.length!=4){
					this.$api.msg('请上传图片！')
					return false;
				}
				this.auditOne();
			}
		},

	}
</script>
<style lang="scss">
	page{
		background: #F0F1F5;
		padding-bottom: 160upx;
	}
	.content{
		margin: 20upx 0;
	
	.list,.list2{
		background: #fff;
		font-size: 28upx;
		padding:20upx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #F0F1F5;
		.listTitle{
			.import{
				color: #E64241;
				margin-right: 5upx;
			}
		}
		
		input{
			text-align: right;
		}
		.listBtn{
			width: 90upx;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			font-size: 40upx;
			font-weight: 600;
			color: #9B9B9B;
			border: 1upx solid #F0F1F5;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.list2{
		background: #F0F1F5;
		display: block;
		color: #9B9B9B;
		.listTitle{
			color: #333;
			margin-bottom: 10upx;
		}
	}
	}
	.mask{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.5);
		z-index: 5;
	}
	.changeImg{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		z-index: 6;
		width: 95%;
		text-align: center;
		color: #007AFF;
		font-size: 36upx;
		.listBox{
			border-radius: 15upx;
			margin: 20upx 0;
			background: rgba(255,255,255,0.9);
			.list:last-child{
				border: 0;
			}
			.list{
				height: 100upx;
				line-height: 100upx;
				border-bottom: 1upx solid  #CFCFCF;
			}
		}
		.cancle{
			border-radius: 15upx;
			background: rgba(255,255,255,0.95);
			height: 100upx;
			line-height: 100upx;
			margin: 20upx 0;
		}
	}
	.right{
		image{
			float: right;
			margin-top: 15upx;
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
</style>

