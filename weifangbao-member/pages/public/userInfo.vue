<template>
  <view class="container">
    <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="isChangeImg=true">
      <text class="cell-tit">头像</text>
      <view class="userImg">
        <image :src="userImg" mode=""></image>
      </view>
      <image class="rightImg" src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
    </view>
    <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50"
          @click="navToNickName(userInfo.nickname)">
      <text class="cell-tit">昵称</text>
      <view>{{userInfo.nickname}}</view>
      <image class="rightImg" src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
    </view>
    <!-- <view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
      <view class="uni-input cell-tit">性别</view>
      <picker @change="changeGender" :value="index" :range="array" class="right">
        <text>{{gender}}</text>
        <image class="rightImg" src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
      </picker>

    </view> -->
   <!-- <view class="list-cell" hover-class="cell-hover" :hover-stay-time="50">
      <text class="cell-tit">出生日期</text>
      <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange" class="right">
        <text>{{date}}</text>
        <image class="rightImg" src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
      </picker>
    </view> -->
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
        userInfo: '',
        gender: '',
        sourceType: '',
        userImg: '',
        isChangeImg: false,
        array: ['男', '女', '保密'],
        index: 0,
        date: '',
      };
    },
    onShow(options) {
      this.getUserInfo();
    },
    computed: {
      startDate() {
        return this.getDate('start');
      },
      endDate() {
        return this.getDate('end');
      }
    },
    methods: {
      getDate(type) {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (type === 'start') {
          year = year - 60;
        } else if (type === 'end') {
          year = year + 0;
        }
        month = month > 9 ? month : '0' + month;
        ;
        day = day > 9 ? day : '0' + day;
        return `${year}-${month}-${day}`;
      },
      bindDateChange: function (e) {
        this.date = e.target.value
        this.changeUserInfo(4, this.date)
      },
      changeGender: function (e) {
        console.log('picker发送选择改变，携带值为', e.target.value)
        // this.index = e.target.value
        this.changeUserInfo(3, e.target.value + 1)
      },
      navToNickName(nickname) {
        uni.navigateTo({
          url: '/pages/public/nickname?nickname=' + nickname
        })
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
            		// console.log(this.userImg)
            		_this.changeUserInfo(1,_this.userImg);
            	}
            });
          }
        });
      },
      getUserInfo() {
        this.$api.httpRequest(
            'GET',
            this.$constant.API_HOME + '/member/userInfo',
												{storeId:this.$constant.STORE_ID},
            {'token': this.$store.state.userInfo.token.token},
        ).then((data) => {
          this.userInfo = data;
          this.userImg = this.userInfo.avatar;
          this.date = data.birthday;
          if (this.userInfo.gender == 0) {
            this.gender = ''
          } else if (this.userInfo.gender == 1) {
            this.gender = '男'
          } else if (this.userInfo.gender == 2) {
            this.gender = '女'
          } else if (this.userInfo.gender == 3) {
            this.gender = '保密'
          }
        })
      },
      changeUserInfo(type, item) {
        var data;
        if (type == 1) {
          // 头像
          data = {avatar: item}
        } else if (type == 2) {
          // 昵称
          data = {nickname: item}
        } else if (type == 3) {
          data = {gender: item}
        } else if (type == 4) {
          data = {birthday: item}
        }
        this.$api.httpRequest(
            'POST',
            this.$constant.API_HOME + '/member/update',
            data,
            {'token': this.$store.state.userInfo.token.token},
        ).then((data) => {
          this.getUserInfo();
        })
      }
    }
  }
</script>

<style lang='scss'>
  page {
    background: $page-color-base;
  }

  .list-cell {
    font-size: 28upx;
    display: flex;
    align-items: center;
    padding: 20upx $page-row-spacing;
    line-height: 60upx;
    position: relative;
    background: #fff;
    justify-content: center;

    .rightImg {
      display: block;
      width: 32upx;
      height: 32upx;
      margin-left: 30upx;
    }

    &.log-out-btn {
      margin-top: 40upx;

      .cell-tit {
        color: $uni-color-primary;
        text-align: center;
        margin-right: 0;
      }
    }

    &.cell-hover {
      background: #fafafa;
    }

    &.b-b:after {
      left: 30upx;
    }

    &.m-t {
      margin-top: 16upx;
    }

    .cell-tit {
      flex: 1;
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      margin-right: 10upx;
    }

    .userImg {
      width: 100upx;
      height: 100upx;

      image {
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
      }
    }

    .cell-tip {
      font-size: $font-base;
      color: $font-color-light;
    }

    switch {
      transform: translateX(16upx) scale(.84);
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

  .right {
    image {
      float: right;
      margin-top: 15upx;
    }
  }
</style>
