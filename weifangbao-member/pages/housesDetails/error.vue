<template>
	<view class="content">
		<view class="orderBox">
			<view class="msg-img">
				<textarea name="" id="" placeholder="请输入错误描述" v-model="userNote" maxlength='-1'></textarea>
				<view>
					<view class="msg">
						<text>手机号</text>
						<input type="text" value="" placeholder="请填写您的手机号码" v-model="phNumber"/>
					</view>
					<view class="imgBox">
						<view class="imgTitle">上传错误信息截图（选填）</view>
						<sunui-upbasic :upImgConfig="upImgBasic" @onUpImg="upBasicData" @onImgDel="delImgInfo"  ref="uImage" ></sunui-upbasic>
					</view>
					
				</view>
				<view class="btn" @click="submit()">提交</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phNumber:'',
				imgArr:[],
				basicArr: [],
			propertyId:'',
				userNote:'',//用户留言
				// 基础版配置
				upImgBasic: {
					// 后端图片接口地址
					basicConfig: {
						url: this.$constant.API_OPEN_HOME+'sys/oss/upload', 
					},
					// 是否开启提示(提醒上传图片的数量)
					tips: true,
					// 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
					notli: true,
					// 图片数量
					count: 9,
					// 相机来源(相机->camera,相册->album,两者都有->all,默认all)
					sourceType: 'album',
					// 是否压缩上传照片(仅小程序生效)
					sizeType: true,
					// 上传图片背景修改 
					upBgColor: '#E8A400',
					// 上传icon图标颜色修改(仅限于iconfont)
					upIconColor: '#fff',
					// 上传svg图标名称
					// upSvgIconName: 'icon-card',
					// 上传文字描述(仅限四个字)
					// upTextDesc: '上传证书',
					// 删除按钮位置(left,right,bleft,bright),默认右上角
					delBtnLocation: '',
					// 是否隐藏添加图片
					// isAddImage: false,
					// 是否隐藏删除图标
					// isDelIcon: false,
					// 删除图标定义背景颜色
					// delIconColor: '',
					// 删除图标字体颜色
					// delIconText: '',
					// 上传图标替换(+),是个http,https图片地址(https://www.playsort.cn/right.png)
					iconReplace: ''
				}
			}
		},
		onLoad(options) {
			this.propertyId=options.propertyId
		},
		methods: {
				// 手动上传图片(适用于表单等上传) -2019/05/10增加
			uImageTap() {
				this.$refs.uImage.uploadimage(this.upImgBasic);
			},
			// 删除图片 -2019/05/12(本地图片进行删除)
			async delImgInfo(e) {
				console.log('你删除的图片地址为:', e, this.basicArr.splice(e.index, 1));
				console.log(this.basicArr);
			},
			// 基础版
			async upBasicData(ret,index) {
					console.log(ret)
					let fileList =ret.file_list;
					let dataKey =ret.datakey;
					// 上传图片数组
					let arrImg = [];
					// console.log(fileList);
					// for(var i=0;i<fileList.length;i++){
						this.basicArr.push(fileList[0].path_server);
					// }
					console.log(this.basicArr)
					// 图片信息保存到data数组
					// this.basicArr = arrImg;
					
					// 可以根据长度来判断图片是否上传成功. 2019/4/11新增
					if (arrImg.length == this.upImgBasic.count) {
						uni.showToast({
							title: `上传成功`,
							icon: 'none'
						});
					}
				},
			// 获取上传图片basic
			getUpImgInfoBasic() {
				console.log('后端转成一维数组:', this.basicArr.join().split(','));
			},
			submit(){
				console.log(this.basicArr);
				console.log(this.phNumber)
				console.log(this.userNote)
				console.log(this.propertyId)
				this.basicArr=JSON.stringify(this.basicArr)
				// return false;
					this.$api.httpRequest(
						'POST',
						this.$constant.API_HOME + 'property/correction' , 
					 {
							propertyId:this.propertyId,
							description:this.userNote,
							contactInfo:this.phNumber,
							screenshot:this.basicArr
						},
						{
							token: this.$store.state.userInfo.token.token
						}
					).then((data) => {
						console.log(data);
						// this.orderList = data;
						uni.navigateBack({
							delta: 1
						})
					})
				
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #F0F1F5;
	}
	/* .title{
		height: 60upx;
		line-height: 60upx;
		font-size: 28upx;
	} */
	.msg-img{
		width: 100%;
		height: 468upx;
		background: #FFFFFF;
		/* margin: 20upx 0; */
		/* padding: 20upx; */
		font-size: 24upx;
		textarea{
			width: 100%;
			height: 100%;
			padding: 20upx;
		}
	}
	.orderBox{
		margin-bottom: 100upx;
	}
	.btn{
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		color: #FFFFFF;
		font-size: 34upx;
		background: #3171F2;
		margin: 30upx auto;
    border-radius: 8upx;
		/* margin-top: 80upx; */
	}
	.msg{
		border-top: 1upx solid #D6D6D6;
		display: flex;
		background: #FFFFFF;
		height: 100upx;
		align-items: center;
		font-size: 32upx;
		padding: 32upx;
		text{
			margin-right: 10upx;
		}
	}
/* 	<view class="imgBox">
		<view class="imgTitle">上传错误信息截图（选填）</view>
		<sunui-upbasic :upImgConfig="upImgBasic" @onUpImg="upBasicData" @onImgDel="delImgInfo" ref="uImage" ></sunui-upbasic>
	</view> */
	.imgBox{
		background: #FFFFFF;
		position: relative;
		.imgTitle{
			margin-top: 20upx;
			color: #999999;
			font-size: 28upx;
			padding: 22upx;
			padding-bottom: 0;
		}
	}
</style>
