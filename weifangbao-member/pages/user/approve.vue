<template>
	<view class="wrap">
		<view class="titleBox">
			<view class="titleList" :class="[status==0?'titleList1':'']">1.提交资料</view>
			<view class="titleList" :class="[status==1?'titleList1':'']">2.等待审核</view>
			<view class="titleList" :class="[status==2 || status==3?'titleList1':'']">3.审核通过</view>
		</view>
		<view class="content">
			<view class="selectList">
				<view class="selectLeft">公司名称</view>
				<view class="selectRight">
          <input type="text" v-model="companyName"  class='rightContent' placeholder="请输入公司名称" v-if="status!=1 && isEdit"/>
					<input type="text" v-model="companyName"  class='rightContent' placeholder="请输入公司名称" v-else readOnly/>
            <!-- <view v-else class='rightContent'>{{companyName}}</view> -->
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">门店地址</view>
				<view class="selectRight">
						<input type="text" v-model="companyAddress"  class='rightContent' placeholder="请输入门店地址" v-if="status!=1 && isEdit"/>
            <input type="text" v-model="companyAddress"  class='rightContent' placeholder="请输入门店地址" v-else readOnly/>
            <!-- <view v-else class='rightContent'>{{companyAddress}}</view> -->
				</view>
			</view>
			<view class="effect">
				<view class="effectTitle">
		营业执照
				</view>
       
				<view class="effectImg" v-if="licenseImg!=''">
					<view class="delBtn" @click="delEffectImg()" v-if="status!=1 && isEdit">×</view>
					<image :src="licenseImg" mode=""></image>
				</view>
        <view class="uploadBtn" @click="upLoadImg()" v-if="licenseImg=='' && !isLoadingImg">+</view>
			</view>
	<view class="effect">
			<view class="effectTitle">
	门头照
			</view>
			<view class="effectImg" v-if="companyImg!=''">
				<view class="delBtn" @click="delEffectImg1()" v-if="status!=1 && isEdit">×</view>
				<image :src="companyImg" mode=""></image>
       <!-- <view class="loadingImg" v-if="isLoadingImg">
          <image src="../../static/img/timg.gif" mode=""></image>
        </view> -->
			</view>
		<view class="uploadBtn" @click="upLoadImg(2)" v-else>+</view>
		</view>
		<view class="submit" @click="upload()" v-if="status!=1 && status!=2">提交</view>
    <view class="submit" @click="isEdit=true" v-if="status==2 && !isEdit">编辑</view>
    <view class="subMitBox" v-if="isEdit && status==2">
      <view class="submitBtn" @click="upload(),isEdit=false">提交</view>
      <view class="submitBtn1" @click="isEdit=false">取消编辑</view>
    </view>
	</view>
	<!-- <view v-if="status==2" class="sucess">
		审核通过
	</view> -->
	<!-- <view v-if="status==3" class="sucess">
		审核失败
	</view> -->
  <view class="loadingImg" v-if="isLoadingImg">
     <image src="../../static/img/timg.gif" mode=""></image>
   </view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
      btnMsg:'提交',
			licenseImg:'',
			companyImg:'',
			companyName:'',
			companyAddress:'',
			status:0,
      isread:false,
      isEdit:true,
      isLoadingImg:false,
				}
		},
		onLoad(options) {
			this.getApproveInfo();
		},
		methods: {
			// 删除效果图
			delEffectImg(){
				this.licenseImg=''
			},
			delEffectImg1(){
				this.companyImg=''
			},
			getApproveInfo(){
				this.$api.httpRequest(
					  'GET',
					 this.$constant.API_HOME+'member/userauthentication/info',
					  {'token':this.$store.state.userInfo.token.token},
					).then((data) => {
					  console.log(data.status);
					  // this.user=data;
					 if(data.status){
							this.status=data.status;
        if(data.status==1 || data.status==2){
									this.companyImg=data.companyPhoto;
									this.licenseImg=data.businessLicense;
									this.companyName=data.companyName;
									this.companyAddress=data.companyAddress;
								}
                if(data.status==1){
                  this.status=1;
                }
                if(data.status==2){
                  this.isEdit=false;
                  this.btnMsg='编辑'
                }
                if(data.status==3){
                  this.status=0;
                  this.companyImg=data.companyPhoto;
                  this.licenseImg=data.businessLicense;
                  this.companyName=data.companyName;
                  this.companyAddress=data.companyAddress;
                  uni.showModal({
                      title:'认证失败',
                      content: data.remark,
                      showCancel: false,
                      success:function(res){
                        console.log(res)
                      }
                  });
                }
						}
					})
			},
			// 上传图片
			upLoadImg(type=1) {
			  var _this = this;
       
			  uni.chooseImage({
			    count: 1, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'],
			    success: function (res) {
			      // console.log('resresresresres',res);
			      const tempFilePaths = res.tempFilePaths;
             _this.isLoadingImg=true;
			      uni.uploadFile({
			      	url: _this.$constant.API_OPEN_HOME+'sys/oss/upload',
			      	filePath: tempFilePaths[0],
			      	name: 'file',
			      	formData: {
			      		'user': 'test'
			      	},
			      	success: (uploadFileRes) => {
			      		console.log(uploadFileRes.data);
			      		// console.log(JSON.parse(uploadFileRes.data).data)
			      		_this.userImg=JSON.parse(uploadFileRes.data).data.src
			      		console.log(_this.userImg)
											if(type==1){
												_this.licenseImg=_this.userImg
                        _this.isLoadingImg=false;
											}else{
												_this.companyImg=_this.userImg
                         _this.isLoadingImg=false;
											}
											
			      		// _this.changeUserInfo(1,_this.userImg);
			      	}
			      });
			    }
			  });
			},
		upload(){
			this.$api.httpRequest(
				'POST',
				this.$constant.API_HOME+'member/userauthentication',
				{"companyName":this.companyName,"companyAddress":this.companyAddress,"businessLicense":this.licenseImg,"companyPhoto":this.companyImg},
				{token:this.$store.state.userInfo.token.token}
				).then((data)=>{
			    console.log(data);
					this.$api.msg('提交成功')
          let _this=this;
          setTimeout(function() {
            _this.getApproveInfo();
          }, 1000);
			});
		}
			
		},
		
	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: $page-color-base;
	}
  .loadingImg{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.5);
    z-index: 100;
    image{
      width: 200upx;
      height: 200upx;
    }
  }
	.content{
		border-top: 2upx solid #E8E8E8;
		padding:30upx;
		.effectTitle{
			font-size: 32upx;
			margin: 20upx auto;
		}
	}
	.submit{
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		background: #3171F2;
		color: #fff;
    border-radius: 8upx;
	}
 
	.titleBox{
		display: flex;
		.titleList{
			width: calc(100% / 3);
			text-align: center;
			padding: 20upx 0;
			font-size: 28upx;
		}
		.titleList1{
			color: #4399FC;
		}
	}
	.uploadBtn{
		// width: 95%;
		margin: 20upx auto;
		font-size: 120upx;
		background: #EEEEEE;
		color: #fff;
		text-align: center;
		height: 720upx;
		line-height: 720upx;
	}
	.effectImg{
		position: relative;
		margin: 20upx auto;
		image{
			width: 100%;
			height: 720upx;
		}
		.delBtn{
			width: 50upx;
			height: 50upx;
			text-align: center;
			line-height: 50upx;
			position: absolute;
			right: 5upx;
			top: 5upx;
			font-size: 40upx;
			font-weight: 550;
			background: rgba(0,0,0,0.5);
			border-radius: 50%;
			color: #D6D6D6;
			z-index: 111;
		}
    
	}
	.apartmentPictures{
		width: calc(100% / 3);
		padding: 10upx;
		border: 1upx solid #303133;
		display: inline-block;
		image{
			width: 100%;
			height: 720upx;
		}
		.delBtn{
			width: 30upx;
			height: 30upx;
			text-align: center;
			line-height: 30upx;
			position: absolute;
			right: 5upx;
			top: 5upx;
			font-size: 20upx;
			font-weight: 550;
			background: rgba(0,0,0,0.5);
			border-radius: 50%;
			color: #D6D6D6;
			z-index: 111;
		}
	}
	.selectBox{
		margin: 20upx auto;
	}
	.selectList{
	 font-size: 32upx;
		height: 100upx;
		display: flex;
		align-items: center;
		border: 1upx solid #DCDFE6;
		background: #fff;
		.selectLeft{
			width: 200upx;
			text-align: right;
			box-sizing: border-box;
			padding-right: 30upx;
		}
		.selectRight{
			width: 500upx;
			height: 100%;
			picker{
				height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
			}
			.rightContent{
				width: 100%;
				height: 100%;
			}
		}
	}
	.labelBox{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30upx 20upx 0 20upx;
		border: 1upx solid #DCDFE6;
		background: #FFFFFF;
		margin: 20upx auto;
		.labelList{
			width: 30%;
			text-align: center;
			height: 60upx;
			line-height: 60upx;
			border-radius: 30upx;
			border: 1upx solid #DCDFE6;
			color: #999999;
			font-size: 28upx;
			background: #fff;
			margin-bottom: 30upx;
		}
		.labelList1{
			background: #E54D42;
			color: #fff;
		}
	}
	.sucess{
		text-align: center;
		margin: 30upx auto;
		}
    // <view class="subMitBox" v-if="isEdit">
    //   <view class="submitBtn" @click="upload(),isEdit=false">提交</view>
    //   <view class="submitBtn" @click="isEdit=false">取消编辑</view>
    // </view>
    .subMitBox{
      display: flex;
      justify-content: space-between;
      border-radius: 8upx;
      overflow: hidden;
      .submitBtn,.submitBtn1{
        width: 324upx;
        height: 100upx;
        line-height: 100upx;
        background: #3171F2;
        color: #fff;
        text-align: center;
      }
      .submitBtn1{
        background: #FA6400;
      }
    }
</style>

