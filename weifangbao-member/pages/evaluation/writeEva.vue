<template>
	<view class="wrap">
		<view class="content">
			<view class="contentBox" v-for="(val,index) in goodsList" :key='index'>
				<view class="goodsBox">
					<view class="goodsImg">
						<image :src="val.picUrl" mode=""></image>
					</view>
					<view class="goodsRight">
						<text>商品评分</text>
						<view class="starsBox">
							<view v-for="(val1,index1) in scoreImg[index]" :key='index1'>
								<image src="../../static/image/Shape.png" mode="" v-if="val1==0"  :key='index' @click="score(index,index1)"></image>
								<image src="../../static/image/star2.png" mode="" v-if="val1==1"  :key='index' @click="score(index,index1)"></image>
							</view>
							
						</view>
					</view>
				</view>
				<view class="evaContent">
					<textarea value="" placeholder="请填写您的评价内容" maxlength='-1' v-model="evaText[index]"/>
					<view>
						<view>
							<sunui-upbasic :upImgConfig="upImgBasic" @onUpImg="upBasicData" @onImgDel="delImgInfo" :datakey="index" ref="uImage" ></sunui-upbasic>
						</view>
					</view>
				</view>
				
			</view>
			<view class="storeScore">
				<view class="storeTitle">服务评价</view>
				<view class="storeList">
					<text>商品符合度</text>
					<view class="starsBox">
						<view v-for="(val,index) in storeScoreImg[0]" :key='index'>
							<image src="../../static/image/Shape.png" mode="" v-if="val==0"  :key='index' @click="scoreForStore(0,index)"></image>
							<image src="../../static/image/star2.png" mode="" v-if="val==1"  :key='index' @click="scoreForStore(0,index)"></image>
						</view>
					</view>
				</view>
				<view class="storeList">
					<text>店铺服务</text>
					<view class="starsBox">
						<view v-for="(val,index) in storeScoreImg[1]" :key='index'>
							<image src="../../static/image/Shape.png" mode="" v-if="val==0"  :key='index' @click="scoreForStore(1,index)"></image>
							<image src="../../static/image/star2.png" mode="" v-if="val==1"  :key='index' @click="scoreForStore(1,index)"></image>
						</view>
					</view>
				</view>
				<view class="storeList">
					<text>物流服务</text>
					<view class="starsBox">
						<view v-for="(val,index) in storeScoreImg[2]" :key='index'>
							<image src="../../static/image/Shape.png" mode="" v-if="val==0"  :key='index' @click="scoreForStore(2,index)"></image>
							<image src="../../static/image/star2.png" mode="" v-if="val==1"  :key='index' @click="scoreForStore(2,index)"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="anonymous" :class="{anonymous2:isAnonymous}">
				<text>匿名评价</text>
				<view class="btn" @click="isAnonymous=!isAnonymous">
					<view class="ball"></view>
				</view>
			</view>
			<view class="submit" @click="upLoadEva()">提交</view>
		</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
				scoreImg:[],//星星图
				goodsScore:[],//商品评分
				storeScoreImg:[[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],//店铺星星图
				imgArr:[],
				basicArr: [],
				storeScore:[0,0,0],//店铺打分
				shopTopicDto:{},//店铺评价
				isAnonymous:true,
				goodsList:[],
				evaText:[],//评价内容
				topicList:[],//商品评论
				userData:{},//用户信息
				storeId:'',//店铺id
				storeName:'',//店铺名称
				// 基础版配置
				upImgBasic: {
					// 后端图片接口地址
					basicConfig: {
						url: _this.$constant.API_OPEN_HOME+'sys/oss/upload', 
					},
					// 是否开启提示(提醒上传图片的数量)
					// tips: false,
					
					// 是否开启notli(开启的话就是选择完直接上传，关闭的话当count满足数量时才上传)
					notli: true,
					// 图片数量
					count: 2,
					// 相机来源(相机->camera,相册->album,两者都有->all,默认all)
					sourceType: 'camera',
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
			this.orderId=options.id;
			this.getDetail(options.id);
			this.$api.httpRequest(
				'GET',
				this.$constant.API_HOME + '/member/userInfo', {
					token: this.$store.state.userInfo.token.token
				}
			).then((data) => {
				// console.log(data);
				this.userData=data;
				
			})
		},
		methods: {
			getDetail(id) {
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'orders/order/' + id, {
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					// console.log(data);
					this.goodsList=data.subList[0].goodsList;
					// console.log(this.goodsList)
					this.storeId=data.storeId;
					this.storeName=data.storeName;
					for(var i=0;i<this.goodsList.length;i++){
						this.$set(this.scoreImg,i,[0,0,0,0,0]);
						this.topicList[i]={};
						this.basicArr[i]=[];
					}
				})
			},
			// 打分
			score(list,index){
				// this.scoreImg=[0,0,0,0,0]
				this.goodsScore[list]=index+1;
				for(var i=0;i<5;i++){
					this.$set(this.scoreImg[list],i,0);
				}
				for(var i=0;i<index+1;i++){
					this.$set(this.scoreImg[list],i,1);
				}
			},
			// 店铺打分
			scoreForStore(list,index){
				this.storeScore[list]=index+1;
				// console.log(this.storeScore)
				for(var i=0;i<5;i++){
					this.$set(this.storeScoreImg[list],i,0);
				}
				for(var j=0;j<index+1;j++){
					this.$set(this.storeScoreImg[list],j,1);
				}
			},
			// 取消当前评分
			// scoreForStoreCancle(list,index){
			// 	this.storeScore[list]=0;
			// 	console.log(this.storeScore)
			// 	for(var i=0;i<5;i++){
			// 		this.$set(this.storeScoreImg[list],i,0);
			// 	}
			// },
			// 评价完成后更改订单状态
			changeState(id){
									this.$api.httpRequest(
									'POST',
									this.$constant.API_HOME + '/orders/order/changeOrderStatus',
									{'id':id,'orderStatus':6},
									{token: this.$store.state.userInfo.token.token}
								).then((data) => {
									uni.navigateBack({
										delta: 2
									});
								})
			},
			// 保存评价
			upLoadEva(){
				for(var i=0;i<this.topicList.length;i++){
					this.topicList[i].module='商品评价';
					this.topicList[i].objId=this.goodsList[i].spuId
					this.topicList[i].content=this.evaText[i]
					this.topicList[i].userid=this.userData.id;
					this.topicList[i].nickname=this.userData.nickname;
					this.topicList[i].avatar=this.userData.avatar;
					this.topicList[i].star=this.goodsScore[i];
					this.topicList[i].orderGoodsId=this.goodsList[i].orderGoodsId;
					this.topicList[i].picture1=this.basicArr[i][0]?this.basicArr[i][0]:'';
					this.topicList[i].picture2=this.basicArr[i][1]?this.basicArr[i][1]:'';
					this.topicList[i].picture3=this.basicArr[i][2]?this.basicArr[i][2]:'';
					this.topicList[i].picture4=this.basicArr[i][3]?this.basicArr[i][3]:'';
					
				}
				this.shopTopicDto.platkey='ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ';
				this.shopTopicDto.module='店铺名称';
				this.shopTopicDto.objName=this.storeName;
				this.shopTopicDto.objId=this.storeId;
				this.shopTopicDto.goodsStar=this.storeScore[0];
				this.shopTopicDto.shopStar=this.storeScore[1];
				this.shopTopicDto.expressStar=this.storeScore[2];
				this.shopTopicDto.userid=this.userData.id;
				this.shopTopicDto.nickname=this.userData.nickname;
				console.log(this.topicList)
				console.log(this.shopTopicDto)
		 
				this.$api.httpRequest(
					'POST',
					this.$constant.API_XOPEN_HOME + 'comment/topic/saveAll', 
					{isAnonymous:!this.isAnonymous?1:0,topicList:this.topicList,shopTopicDto:this.shopTopicDto},
					{
						key: 'ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ'
					}
				).then((data) => {
					//console.log(data);
					this.changeState(this.orderId);
				})
			},
				// 手动上传图片(适用于表单等上传) -2019/05/10增加
				uImageTap() {
					this.$refs.uImage.uploadimage(this.upImgBasic);
				},
				// 删除图片 -2019/05/12(本地图片进行删除)
				async delImgInfo(e) {
					// console.log('你删除的图片地址为:', e, this.basicArr.splice(e.index, 1));
					// console.log(e);
					this.basicArr[e.datakey].splice(e.index, 1);
					// console.log(this.basicArr);
				},
				// 基础版
				async upBasicData(ret,index) {

					let fileList =ret.file_list;
					let dataKey =ret.datakey;
					// 上传图片数组
					let arrImg = [];
					// console.log(fileList);
					for(var i=0;i<fileList.length;i++){
						this.basicArr[dataKey][i]=fileList[i].path_server;
					}
					// console.log(this.basicArr)
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
				// 上传评价
				submitEva(){
					console.log(this.basicArr);
				}
		},
		
	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: $page-color-base;
	}
	.content{
		border-top: 2upx solid #E8E8E8;
	}
	.contentBox{
		padding: 30upx 0;
		background: #FFFFFF;
		.goodsBox{
			margin: 0 20upx;
			display: flex;
			align-items: center;
			.goodsImg{
			width: 124upx;
			height: 122upx;
			image{
				width: 100%;
				height: 100%
			}
		}
		.goodsRight{
			margin-left: 20upx;
			font-size: 32upx;
			color: #333333;
			display: flex;
			flex-direction: column;
			.starsBox{
				display: flex;
					image{
						width: 32upx;
						height: 32upx;
						margin-top: 10upx;
						margin-right: 14upx;
					}
			}
			
		}
		}
		.evaContent{
			padding: 30upx 0;
			font-size: 24upx;
			textarea{
				width:calc(100% - 40upx);
				margin: 0 auto;
				height: 240upx;
				// border: 1upx solid #333333;
			}
			.evaImg{
				margin-top: 10upx;
				display: flex;
				image{
					width: 120upx;
					height: 120upx;
				}
				.upImage{
					background: #EEEEEE;
					color: #999999;
					font-size: 48upx;
					height: 120upx;
					width: 120upx;
					display: inline-block;
					text-align: center;
					line-height: 120upx;
				}
			}
		}
	}
	.storeScore{
		margin: 20upx 0;
		background: #FFFFFF;
		padding: 20upx;
		font-size: 32upx;
		.storeTitle{
			padding-bottom: 20upx;
		}
		.storeList:last-child{
			padding-bottom: 0;
		}
		.storeList{
			padding: 20upx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28upx;
			border-top: 1upx solid #E8E8E8;
			.starsBox{
				display: flex;
					image{
						width: 32upx;
						height: 32upx;
						margin-top: 10upx;
						margin-right: 14upx;
					}
			}
		}
	}
	
	.anonymous{
		margin: 20upx 0;
		padding: 20upx;
		display: flex;
		justify-content: space-between;
		font-size: 28upx;
		background: #fff;
		.btn{
			position: relative;
			width: 70upx;
			height: 42upx;
			background: #F05161;
			border-radius: 21upx;
			.ball{
				position: absolute;
				height: 42upx;
				width: 42upx;
				border-radius: 50%;
				background: #fff;
				right: 0;
				top: 0,
			}
		}
	}
	.anonymous2{
		.btn{
			position: relative;
			width: 70upx;
			height: 42upx;
			background: #F5F5F5;
			border-radius: 21upx;
			border: 1upx solid #F5F5F5;
			.ball{
				position: absolute;
				height: 42upx;
				width: 42upx;
				border-radius: 50%;
				background: #fff;
				left: 0;
				top: 0,
			}
		}
	}
	.submit{
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background: #F05161;
		color: #fff;
	}
</style>
