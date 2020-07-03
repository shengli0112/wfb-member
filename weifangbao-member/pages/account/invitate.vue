<template>
  <view class="content">
    <!-- <scroll-view :scroll-y="isScroll">  -->
    <view class="box">
      <image class="invitateImg" src="../../static/img/invitateBg.png" mode=""></image>
      <view class="headImg">
        <image src="../../static/img/erweima.png" mode=""></image>
      </view>
      <!-- <view class="name">{{nickname}}</view>
        <view class="invitate-code">
          <view class="text">邀请码</view>
          <view class="code">{{inviteCode}}</view>
        </view> -->
    </view>
    <!-- <view v-if="from_uid">{{from_uid}}</view> -->
    <!-- <view class="rules">
      <view class="rules-title">活动规则</view>
      <view class="rules-content">
        1.活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容</br></br>

        1.活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容活动规则段落文字内容，活动规则段落文字内容活动规则段落文字内容
      </view>
    </view> -->
    <!-- </scroll-view> -->
    <view class="button" v-if="isOwnUser">
      <!--      <button class="button1" data-id="shareBtn" open-type="share" plain="true"> 邀请好友</button>-->
      <!--       <view @click="isShare=true">生成海报</view>-->
      <view @tap="shareFc()">生成海报</view>
      <!--  <view @click="copy()">复制邀请码</view> -->
      <view @click="myInvitate">我的邀请</view>
    </view>
    <view class="button2" v-else @click="login">
      <view>接受邀请</view>
    </view>
    <view class="mask" v-if="isShare">
      <view class="mask-content">
        <view class="mask-title">分享到</view>
        <view class="mask-share">
          <view class="share">
            <image src="../../static/image/Rectangle@2x.png" mode="" @click="share('wechat')"></image>
            <view class="text">微信好友</view>
          </view>
          <view class="share">
            <image src="../../static/image/wchat.png" mode="" @click="share('wechatMoments')"></image>
            <view class="text">朋友圈</view>
          </view>
          <!-- <view class="share">
			   		<image src="../../static/image/phone.png" mode=""></image>
			   		<view class="text">保存到本地</view>
			   </view> -->
        </view>
        <view class="mask-btn" @click="isShare=false">取消</view>
      </view>
    </view>
    <view class="mask" v-if="isShow">
      <page-authorization @isShow='cancle' :inviteId='from_uid'></page-authorization>
    </view>


    <view class="flex_row_c_c modalView" :class="qrShow?'show':''" @tap="hideQr()">
      <view class="flex_column">
        <view class="backgroundColor-white padding1vh border_radius_10px">
          <image :src="poster.finalPath || ''" mode="widthFix" class="posterImage"></image>
        </view>
        <view class="flex_row marginTop2vh">
          <button type="primary" size="mini" @tap.prevent.stop="saveImage()" style=" background: #3171F2;height: 64rpx; line-height: 64rpx;">保存图片</button>
          <!--          <button type="primary" size="mini" @tap.prevent.stop="share()">分享图片</button>-->
        </view>
      </view>
    </view>
    <view class="hideCanvasView">
      <canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||10) + 'px', height: (poster.height||10) + 'px'}"></canvas>
    </view>

  </view>
</template>
<script>
    import copy             from '../../common/ican-H5Api.js'
    import _app             from '@/util/QS-SharePoster/app.js';
    import {getSharePoster} from '@/util/QS-SharePoster/QS-SharePoster.js';
    import constant         from "../../constant";

    export default {
        data(){
            return {
                isShare   :false,
                isOwnUser :false, //游客or用户
                inviteCode:'', //邀请码
                nickname  :'', //用户名
                avatar    :'', //头像
                token     :this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
                userInfo  :this.$store.state.hasLogin ? this.$store.state.userInfo : '',
                userId    :'',
                from_uid  :'',
                isShow    :false,
                poster    :{},
                qrShow    :false,
                canvasId  :'default_PosterCanvasId'

            }
        },
        onLoad(options){
            console.error('options:',options);
            console.error('userInfo:',this.$store.state.userInfo);
            if(options.from_uid){
                this.from_uid = options.from_uid
                if(!this.$store.state.hasLogin){
                    this.isOwnUser = false;
                }else{
                    this.userId = options.from_uid
                }
                // this.loginCode()
            }
            if(options.scene){
                this.from_uid = options.scene;
            }
            if(options.id){
                this.userId = options.id;
            }

            if(this.$store.state.hasLogin){
                this.isOwnUser = true;
            }
            // this.$api.httpRequest(
            //   'GET',
            //   this.$constant.API_HOME + '/member/shareInviteCode', {
            //     'id': id
            //   },
            // ).then((data) => {
            //   console.log(data);
            //   this.inviteCode = data.inviteCode;
            //   this.nickname = data.nickname;
            //   this.avatar = data.avatar;

            // })
        },
        methods:{
            login(){
                this.isShow = true;
            },
            cancle(data){
                this.isShow = data;
            },
            onShareAppMessage:function(res){
                if(res.from === 'button'){
                    // 来自页面内转发按钮
                    console.log(res.target)
                }
                return {
                    title   :'您的好友邀请您领取新人礼包',
                    path    :'/pages/account/invitate?from_uid=' + this.userId,
                    imageUrl:'http://xshop.img.ruitukeji.net/061c770f59d00d0df6c936b99c58a253.jpg'
                }
            },
            loginCode(){
                let _this = this;
                uni.login({
                    provider:'weixin',
                    success :function(loginRes){
                        _this.$api.httpRequest(
                          'POST',
                          _this.$constant.API_HOME + 'member/miniapp/login/code', {
                              code         :loginRes.code,
                              rawData      :'',
                              signature    :'',
                              encryptedData:'',
                              iv           :''
                          },
                        ).then((data) => {
                            // 记录token有效期
                            var myDate = new Date();
                            uni.setStorage({//缓存用户登陆状态
                                key :'time',
                                data:myDate.getTime() + 43000 * 1000,
                            })
                            _this.$store.commit('login', data)
                            // 登录成功 获取个人信息
                            // _this.getUserInfo();
                        })
                    }
                });
            },
            copy(){
                let _this = this;
                uni.setClipboardData({
                    data   :this.inviteCode,
                    success:function(){
                        _this.$api.msg('复制成功')
                    }
                });

            },
            share(type){
                window.android.share(type);
                this.isShare = false;
            },
            myInvitate(){
                uni.navigateTo({
                    url:'/pages/account/invitateFriend'
                })
            },
            async shareFc(){
                try{
                    console.log('准备生成:' + new Date())
                    const d = await getSharePoster({
                        _this          :this, //若在组件中使用 必传
                        type           :'testShareType',
                        backgroundImage:'/static/img/invitate-bg.png',
                        formData       :{
                            //访问接口获取背景图携带自定义数据
                        },
                        posterCanvasId :this.canvasId,	//canvasId
                        delayTimeScale :20, //延时系数
                      /* background: {
                       width: 1080,
                       height: 1920,
                       backgroundColor: '#666'
                       }, */
                        drawArray      :({bgObj, type, bgScale}) => {
                            const dx         = bgObj.width * 0.3;
                            const fontSize   = bgObj.width * 0.045;
                            const lineHeight = bgObj.height * 0.04;
                            //可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
                            return new Promise((rs, rj) => {
                                rs([
                                    {
                                        type     :'image',
                                        url      :this.userInfo.avatar,
                                        circleSet:true,
                                        dx       :232,
                                        dy       :96,
                                        dWidth   :90,
                                        dHeight  :90,
                                    },
                                    {
                                        type     :'text',
                                        text     :this.userInfo.nickname,
                                        dx       :275,
                                        dy       :220,
                                        size     :30,
                                        color    :'#D9BC91',
                                        textAlign:'center'
                                    },
                                    {
                                        type   :'image',
                                        // url  :'/static/img/erweima.png',
                                        url    :constant.API_HOME + '/member/invite/qrcode?token=' + this.$store.state.userInfo.token.token,
                                        alpha  :1,
                                        dx     :140,
                                        dy     :430,
                                        dWidth :280,
                                        dHeight:280,
                                    }
                                ]);
                            })
                        },
                        setCanvasWH    :({bgObj, type, bgScale}) => { // 为动态设置画布宽高的方法，
                            this.poster = bgObj;
                        }
                    });
                    console.log('海报生成成功, 时间:' + new Date() + '， 临时路径: ' + d.poster.tempFilePath)
                    this.poster.finalPath = d.poster.tempFilePath;
                    this.qrShow           = true;
                }catch(e){
                    _app.hideLoading();
                    _app.showToast(JSON.stringify(e));
                    console.log(JSON.stringify(e));
                }
            },
            saveImage(){
                // #ifndef H5
                uni.saveImageToPhotosAlbum({
                    filePath:this.poster.finalPath,
                    success(res){
                        _app.showToast('保存成功');
                    }
                })
                // #endif
                // #ifdef H5
                _app.showToast('保存了');
                // #endif
            },
            hideQr(){
                this.qrShow = false;
            }
        },
        watch  :{
            '$store.state.hasLogin':function(){
                if(this.$store.state.hasLogin){
                    this.isOwnUser = true
                }
            },
        }
    }
</script>

<style lang='scss'>
  page,
  .content{
    height: 100%;
    overflow: hidden;
  }

  .box{

    width: 100%;
    height: 100%;
    margin: 0 auto;
    margin-bottom: 0;
    /* background-image: url('../../static/img/invitateBg.png'); */
    /* background-size: contain; */
    /* background-repeat: no-repeat;
     background-size: 100% 100%; */
    /* border: 0upx; */
    /* padding-top: 420upx; */
    .invitateImg{
      position: relative;
      width: 100%;
      height: 100%;
    }

    .headImg{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 338upx;
      height: 338upx;

      image{
        width: 100%;
        height: 100%;
        /* border-radius: 50%; */
      }
    }

    .name{
      margin: 0 auto;
      width: 100%;
      text-align: center;
      margin-top: 20upx;
      color: #FFFFFF;
      font-size: 32upx;
    }

    .invitate-code{
      margin: 110upx auto;
      margin-bottom: 0;
      text-align: center;
      color: #FFFFFF;
      font-size: 32upx;

      .code{
        font-size: 52upx;
      }
    }
  }

  .rules{
    position: relative;
    background: white;

    &:after{
      position: absolute;
      left: 50%;
      top: 20upx;
      transform: translateX(-50%);
      width: 300upx;
      height: 0;
      content: '';
      border-bottom: 1px solid #ccc;
      z-index: 1;
    }

    .rules-title{
      width: 170upx;
      text-align: center;
      font-size: 30upx;
      color: #333333;
      background: #FFFFFF;
      z-index: 2;
      background: #fff;
      position: relative;
      margin: 0 auto;
      text-align: center;
    }

    .rules-content{
      margin-top: 10upx;
      padding: 0 58upx;
      color: #999999;
      font-size: 28upx;
      margin-bottom: 120upx;
      line-height: 45upx;
      letter-spacing: 3upx;
    }
  }

  .button{
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 100%;
    background: #FFFFFF;
    z-index: 2;

    button[plain]{
      border: 0
    }

    .button1, view{
      width: calc(100% / 2 - 1upx);
      background: #FFEB64;
      color: #BE7B22;
      text-align: center;
      font-size: 32upx;
      height: 96upx;
      line-height: 96upx;
      border-radius: 0;
      margin-left: 0;
      /* border: 1upx solid #FFEB64; */
    }
  }

  .button2{
    z-index: 2;
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #FFEB64;
    color: #BE7B22;
    text-align: center;
    font-size: 32upx;
    height: 96upx;
    line-height: 96upx;
  }

  .mask{
    z-index: 3;
    position: absolute;
    top: 0upx;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);

    .mask-content{
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 516upx;
      margin: 0 auto;
      background: #FFFFFF;

      &:after{
        position: absolute;
        left: 50%;
        top: 40upx;
        transform: translateX(-50%);
        width: 400upx;
        height: 0;
        content: '';
        border-bottom: 1px solid #CCCCCC;
        z-index: 1;
      }

      .mask-title{
        text-align: center;
        font-size: 28upx;
        color: #333333;
        margin: 20upx auto;
        text-align: center;
        background: #FFFFFF;
        z-index: 14;
        position: relative;
        width: 180upx;

      }

      .mask-share{
        display: flex;
        justify-content: space-around;
        padding: 80upx 0;

        .share{
          width: 200upx;
          text-align: center;

          image{
            width: 112upx;
            height: 112upx;
          }

          .text{
            color: #333333;
            font-size: 34upx;
            margin-top: 30upx;
          }
        }
      }

      .mask-btn{
        width: 100%;
        text-align: center;
        color: #333333;
        background: #FFFFFF;
        font-size: 32upx;
        height: 60upx;
        line-height: 60upx;
        z-index: 10;
      }
    }

  }

  .mask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }


  .hideCanvasView{
    position: relative;
  }

  .hideCanvas{
    position: fixed;
    top: -99999upx;
    left: -99999upx;
    z-index: -99999;
  }

  .flex_row_c_c{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .modalView{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    outline: 0;
    transform: scale(1.2);
    perspective: 2500upx;
    background: rgba(0, 0, 0, 0.6);
    transition: all .3s ease-in-out;
    pointer-events: none;
    backface-visibility: hidden;
    z-index: 999;
  }

  .modalView.show{
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
  }

  .flex_column{
    display: flex;
    flex-direction: column;
  }

  .backgroundColor-white{
    background-color: white;
  }

  .border_radius_10px{
    border-radius: 10px;
  }

  .padding1vh{
    padding: 1vh;
  }

  .posterImage{
    width: 60vw;
  }

  .flex_row{
    display: flex;
    flex-direction: row;
  }

  .marginTop2vh{
    margin-top: 2vh;
  }
</style>

</

style

>
