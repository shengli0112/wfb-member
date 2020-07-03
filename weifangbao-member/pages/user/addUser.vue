<template>
	<view class="wrap">
    <view class="wrapHead">
      <view class="starBox" @click="changeMark">
        <image src="../../static/img/star0.png" mode="" v-if="isMarked==0"></image>
        <image src="../../static/img/star1.png" mode="" v-else></image>
      </view>
     <view class="userImg" @click="isChangeImg=true">
       <image :src="userImg?userImg:'../../static/img/logo.png'" mode=""></image>
     </view>
     <view class="delBtn" @click="delUser()" v-if="status==1">删除</view>
    </view>
		<view class="content">
			<view class="selectList">
				<view class="selectLeft">姓名</view>
				<view class="selectRight">
						<input type="text" v-model="userNameHead"  class='rightContent' placeholder="请输入姓名"/>
				</view>
			</view>
		<!-- 	<view class="selectList">
				<view class="selectLeft">名字</view>
				<view class="selectRight">
						<input type="text" v-model="userName"  class='rightContent' placeholder="请输入名字"/>
				</view>
			</view> -->
			<view class="selectList">
				<view class="selectLeft">电话号码</view>
				<view class="selectRight">
						<input type="text" v-model="userPh"  class='rightContent' placeholder="请输入电话号码" maxlength="11"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">性别</view>
				<view class="selectRight selectRight1">
						<view class="leftBtn" :class="[gender==1?'selectBtn':'']" @click="gender=1">男</view>
						<view class="rightBtn" :class="[gender==2?'selectBtn':'']" @click="gender=2">女</view>
				</view>
			</view>
			<view class="selectList2">
				<view class="selectLeft">备注</view>
				<view class="selectRight">
						<textarea  v-model="userNote"  class='rightContent' placeholder="请输入客户预算、需求区域、面积，客户特点等"/>
				</view>
			</view>
      <view style="background: #FFFFFF; padding-bottom: 300upx; padding-top: 30upx;">
        <view class="btnBox">
           <view class="submit" @click="changeSubmit()" v-if="status==1">提交修改</view>
              
           <view class="submit" @click="upload()" v-if="status==0">提交</view>
           <view class="submit" @click="tell()">呼叫</view>
         </view>
            
        <!-- <view class="submit delBtn" @click="delUser()" v-if="status==1">删除</view> -->
      </view>
     
	</view>
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
	export default {

		data() {
			return {
				userNameHead:'',
				userName:'',
				userPh:'',
		  userNote:'',
			 status:0,
				gender:1,
				isMarked:0,
        id:'',
        delArr:[],
        isChangeImg:false,
        userImg:'',
				}
		},
		onLoad(options) {
			if(options.id){
        this.id=options.id;
        this.delArr[0]=this.id;
        this.getUserInfo();
        this.status=1
      }
		},
		methods: {
      changeMark(){
        if(this.id){
          this.isMarked=this.isMarked==1?0:1;
          this.changeSubmit();
        }else{
          this.$api.msg('请先保存客户信息！')
        }
        
      },
      getUserInfo(){
        this.$api.httpRequest(
        	'GET',
        	this.$constant.API_HOME+'customer/customer/'+this.id,
        	{},
        	{token:this.$store.state.userInfo.token.token}
        	).then((data)=>{
            console.log(data);
        		this.userName=data.name
            this.userNameHead=data.surname
            this.userPh=data.mobile
            this.userNote=data.remark
            this.gender=data.gender
            this.isMarked=data.isMarked
            this.userImg=data.avatar
        });
      },
      changeSubmit(){
        if(this.userPh.length!=11){
          this.$api.msg('请输入正确的手机号');
          return false;
        }
        if(this.userNameHead==''){
          this.$api.msg('请输入客户姓名')
          return false;
        }
        if(this.userPh==''){
          this.$api.msg('请输入客户联系方式')
          return false;
        }
        this.$api.httpRequest(
        	'PUT',
        	this.$constant.API_HOME+'customer/customer',
        	{"id":this.id,"surname":this.userNameHead,"name":'',"mobile":this.userPh,"gender":this.gender,remark:this.userNote,isMarked:this.isMarked,avatar:this.userImg},
        	{token:this.$store.state.userInfo.token.token}
        	).then((data)=>{
            console.log(data);
        		this.$api.msg('修改成功！')
            setTimeout(function() {
              uni.navigateBack()
            }, 1000);
        });
      },
			tell(){
				uni.makePhoneCall({
					 phoneNumber: this.userPh 
				})
			},
      delUser(){
        let _this=this;
        uni.showModal({
            title: ' ',
            content: '确认删除改客户吗？',
            confirmText:'确认',
            success: function (res) {
                if (res.confirm) {
                   _this.$api.httpRequest(
                   	'DELETE',
                   	_this.$constant.API_HOME+'customer/customer',
                      JSON.stringify(_this.delArr),
                   	{token:_this.$store.state.userInfo.token.token}
                   	).then((data)=>{
                       console.log(data);
                   		_this.$api.msg('删除成功')
                       setTimeout(function() {
                         uni.navigateBack();
                       }, 1000);
                   });
                } else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
        
      },
		upload(){
      if(this.userPh.length!=11){
        this.$api.msg('请输入正确的手机号');
        return false;
      }
      if(this.userNameHead==''){
        this.$api.msg('请输入客户姓名')
        return false;
      }
      if(this.userPh==''){
        this.$api.msg('请输入客户联系方式')
        return false;
      }
			this.$api.httpRequest(
				'POST',
				this.$constant.API_HOME+'customer/customer',
				{"surname":this.userNameHead,"name":'',"mobile":this.userPh,"gender":this.gender,remark:this.userNote,isMarked:this.isMarked,avatar:this.userImg},
				{token:this.$store.state.userInfo.token.token}
				).then((data)=>{
			    console.log(data);
					this.$api.msg('提交成功！')
          setTimeout(function() {
            uni.navigateBack()
          }, 1000);
			});
		},
    upLoadImg(sourceType) {
      this.sourceType = sourceType;
      var _this = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: [_this.sourceType],
        success: function (res) {
          // console.log('resresresresres',res);
          const tempFilePaths = res.tempFilePaths;
          uni.uploadFile({
          	url: _this.$constant.API_OPEN_HOME+'sys/oss/upload',
          	filePath: tempFilePaths[0],
          	name: 'file',
          	formData: {
          		'user': 'test'
          	},
          	success: (uploadFileRes) => {
          		// console.log(uploadFileRes.data);
          		// console.log(JSON.parse(uploadFileRes.data).data.src)
          		_this.userImg=JSON.parse(uploadFileRes.data).data.src
          		console.log(_this.userImg)
              // this.changeSubmit();
          		// _this.changeUserInfo(1,_this.userImg);
          	}
          });
        }
      });
    },
			
		},
		
	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: #F8F8F8;
    overflow: hidden;
	}
  .wrapHead{
    width: 750upx;
    height: 200upx;
    box-sizing: border-box;
    border: 1upx solid #FFFFFF;
    background: #FFFFFF;
    margin-bottom: 20upx;
    position: relative;
    .delBtn{
      position: absolute;
      top: 10upx;
      right: 20upx;
      background: #fff;
      color: red;
    }
    // <view class="starBox">
    //   <image src="../../static/img/star0.png" mode="" v-if="isMarked==0"></image>
    //   <image src="../../static/img/star1.png" mode="" v-else></image>
    // </view>
    .starBox{
      position: absolute;
      top: 10upx;
      left: 20upx;
      width: 50upx;
      height: 50upx;
      image{
        width: 50upx;
        height: 50upx;
      }
    }
    .userImg{
      width: 120upx;
      height: 120upx;
      border-radius: 50%;
      overflow: hidden;
      margin: 50upx auto;
      image{
        width: 120upx;
        height: 120upx;
      }
    }
  }
	.content{
		// border-top: 1upx solid #E8E8E8;
		// padding:30upx;
		.effectTitle{
			font-size: 32upx;
			margin: 20upx auto;
		}
	}
  .btnBox{
    display: flex;
    width: 650upx;
    justify-content: space-between;
    align-items: center;
    margin:20upx auto;
  }
	.submit{
		width: 298upx;
		height: 80upx;
		line-height: 80upx;
		text-align: center;
		background: #3171F2;
		color: #fff;
		margin: 50upx auto;
    border-radius: 8upx;
    font-size: 32upx;
	}
 
	.uploadBtn{
		// width: 95%;
		margin: 20upx auto;
		font-size: 120upx;
		background: #EEEEEE;
		color: #fff;
		text-align: center;
		height: 250upx;
		line-height: 250upx;
	}
	.effectImg{
		position: relative;
		margin: 20upx auto;
		image{
			width: 100%;
			height: 250upx;
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
			height: 200upx;
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
		border-bottom: 1upx solid #F1F1F1;
    border-top: 0;
		background: #fff;
		.selectLeft{
			width: 200upx;
			text-align: right;
			box-sizing: border-box;
			padding-right: 30upx;
      font-size: 32upx;
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
		.selectRight1{
			display: flex;
			flex-direction: row-reverse;
			align-items: center;
			text-align: center;
			margin-right: 30upx;
      border-radius: 10upx;
      overflow: hidden;
      width: 206upx;
      height: 50upx;
      // margin-left: 250upx;
      border: 1upx solid #3171F2;
			// background: #4CD964;
			.leftBtn,.rightBtn{
				width: 103upx;
				height: 50upx;
				line-height: 50upx;
				background: #FFFFFF;
				// border: 1upx solid #3171F2;
        font-size: 28upx;
			}
			.selectBtn{
				background: #3171F2;
        color: #fff;
			}
		}
   
	}
  .selectList2{
    height: 250upx;
    display: flex;
    align-items: top;
    background: #fff;
    // color: #333;
    padding: 20upx 0;
    border-bottom: 1upx solid #F1F1F1;
    .selectLeft{
    	width: 200upx;
    	text-align: right;
    	box-sizing: border-box;
    	padding-right: 30upx;
      font-size: 32upx;
    }
    .selectRight{
      width: 500upx;
      height: 100%;
      .rightContent{
        width: 100%;
        height: 100%;
        border: 1upx solid #F1F1F1;
        padding: 10upx;
      }
     
    }
  }
  // .selectList:first-child{
  //   border-top: 1upx solid #F1F1F1;
  // }
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
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 5;
  }
  .changeImg {
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
  
    .listBox {
      border-radius: 15upx;
      margin: 20upx 0;
      background: rgba(255, 255, 255, 0.9);
  
      .list:last-child {
        border: 0;
      }
  
      .list {
        height: 100upx;
        line-height: 100upx;
        border-bottom: 1upx solid #CFCFCF;
      }
    }
  
    .cancle {
      border-radius: 15upx;
      background: rgba(255, 255, 255, 0.95);
      height: 100upx;
      line-height: 100upx;
      margin: 20upx 0;
    }
  }
</style>
