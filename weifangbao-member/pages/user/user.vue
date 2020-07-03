<template>
  <view class="container">

    <view class="user-section">
      <view class="user-info-box">
        <!-- #ifdef MP-WEIXIN-->
        <!-- <view class="portrait-box">
          <open-data class="portrait" type="userAvatarUrl"></open-data>
        </view>
        <view class="info-box">
          <open-data type="userNickName" class="username"></open-data>
          <view class="integral">
            <view>绑定手机号</view>
            <view>{{user.integral || 0}}积分</view>
          </view>
        </view> -->
        <!-- #endif -->

        <view class="portrait-box" @click="navToLogin()">
          <image class="portrait" :src="user.avatar" v-if="user.avatar"></image>
          <image class="portrait" src="/static/img/logo.png" v-else></image>
        </view>
        <view class="info-box">
          <text class="username" @click="navToLogin()">{{user.nickname || '游客'}}</text>
          <image src="../../static/img/toRz.png" mode="" v-if="user.isRealAuth!=1 && user.nickname" @click="navTo('/pages/user/approve')"></image>
          <image src="../../static/img/rz.png" mode="" v-if="user.isRealAuth==1 && user.nickname"></image>
          <!-- <text class="isRealAuth" v-if="user.isRealAuth==0 && user.nickname" @click="navTo('/pages/user/approve')">去认证>></text> -->
          <!-- <view class="integral">
            <view>{{user.integral || 0}}积分</view>
          </view> -->
        </view>

      </view>
    </view>

    <view class="cover-container" :style="[{
				transform: coverTransform,
				transition: coverTransition
			}]"
          @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">

      <!-- <view class="tj-sction">
        <view class="tj-item" @click="navToCollectGoods">
          <text class="num">{{user.medalNum || 0}}</text>
          <text>卡券</text>
        </view>
        <view class="tj-item" @click="navToCollectStore">
          <text class="num">{{user.ticketNum || 0}}</text>
          <text>我的奖牌</text>
        </view>
        <view class="tj-item" @click="account()">
          <text class="num">{{user.integral || 0}}</text>
          <text>我的积分</text>
        </view>
      </view> -->
      <!-- 订单 -->
      <view class="marginBox" ></view>
      <view class="order-section">
        <view class="order-title">
          <view>我的交易</view>
          <view class="title-right" @click="navTo('/pages/order/order?state=1')">全部交易<image src="../../static/image/Combined%20Shape@2x.png"
                                                                                            mode=""></image>
          </view>
        </view>
        <view class="order-box">

          <view class="order-item" @click="navTo('/pages/order/order?state=1')" hover-class="common-hover" :hover-stay-time="50">
            <image src="../../static/img/report.png" mode=""></image>
            <text>已报备</text>
          </view>
          <view class="order-item" @click="navTo('/pages/order/order?state=2')" hover-class="common-hover" :hover-stay-time="50">
            <image src="../../static/img/see.png" mode=""></image>
            <text>已看房</text>
          </view>
          <view class="order-item" @click="navTo('/pages/order/order?state=3')" hover-class="common-hover" :hover-stay-time="50">
            <image src="../../static/img/subscribe.png" mode=""></image>
            <text>已认购</text>
          </view>
          <view class="order-item" @click="navTo('/pages/order/order?state=4')" hover-class="common-hover"  :hover-stay-time="50">
            <image src="../../static/img/signing.png" mode=""></image>
            <text>已签约</text>
          </view>
        </view>

      </view>
      <view class="tool">
        <view class="tool-item">
          <view class="tool-list" @click="navTo('/pages/user/reportHouse?state=1',1)" >
            <view class="tool-left">
              <image src="../../static/img/myUser.png" mode=""></image>
              <text>渠道已报备</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/user/newReport',1)" >
            <view class="tool-left">
              <image src="../../static/img/newReport.png" mode=""></image>
              <text>新增报备</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/myHouses/myHouse',1)" >
            <view class="tool-left">
              <image src="../../static/img/myHouses.png" mode=""></image>
              <text>我的楼盘</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/user/myUser',1)" >
            <view class="tool-left">
              <image src="../../static/img/myUser.png" mode=""></image>
              <text>我的客户</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/goods/collectGoods?type=1')">
            <view class="tool-left">
              <image src="../../static/img/collection.png" mode=""></image>
              <text>我的收藏</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/user/approve')">
            <view class="tool-left">
              <image src="../../static/img/certification.png" mode=""></image>
              <text v-if="!isRealAuth">我的认证</text>
              <text v-else>修改认证</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/notice/notice')">
            <view class="tool-left">
              <image src="../../static/img/myMsg.png" mode=""></image>
              <text>我的消息</text>
              <view class="newMessage" v-if="isNewMsg"></view>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="invitate">
            <view class="tool-left">
              <image src="../../static/img/shareFriend.png" mode=""></image>
              <text>邀请好友</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navToAbout">
            <view class="tool-left">
              <image src="../../static/img/aboutUs.png" mode=""></image>
              <text>关于我们</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navToOpinion">
            <view class="tool-left">
              <image src="../../static/img/edit.png" mode=""></image>
              <text>意见反馈</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <!-- <view class="tool-list" @click="navToStatement">
          	<view class="tool-left">
          			<image src="../../static/img/statement.png" mode=""></image>
          	  <text>平台声明</text>
          	</view>
          	<image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view> -->
          <view class="tool-list" @click="call">
            <view class="tool-left">
              <image src="../../static/img/call.png" mode=""></image>
              <text>客服电话</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>
          <view class="tool-list" @click="navTo('/pages/set/set')">
            <view class="tool-left">
              <image src="../../static/img/set.png" mode=""></image>
              <text>设置</text>
            </view>
            <image class="tool-right" src="../../static/image/jiantou.png" mode=""></image>
          </view>


        </view>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN-->
    <view class="mask" v-if="isShow">
      <page-authorization @isShow='cancle'></page-authorization>
    </view>
    <!-- #endif -->
    <!-- #ifdef H5 -->
    <view class="mask" v-if="isShow">
      <page-phLogin @isShow='cancle'></page-phLogin>
    </view>
    <!-- #endif -->
  </view>
</template>
<script>
    import listCell from '@/components/mix-list-cell';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
    import {
        mapState
    } from 'vuex';
    let startY = 0,
        moveY = 0,
        pageAtTop = true;
    export default {
        components: {
            listCell,
            uniLoadMore
        },
        data() {
            return {
                coverTransform: 'translateY(0px)',
                coverTransition: '0s',
                moving: false,
                user: {},
                recommendedList: [], //推荐列表
                loadingType: 'more', //加载更多状态
                page: 1,
                bannerImg: '',
                isShow: false,
                isRealAuth:false,
                isNewMsg:false,
                Tel:''
            }
        },
        //加载更多
        onReachBottom() {
            if (this.loadingType === 'nomore') {
                return;
            }
            this.page++;
            // this.recommended();
        },
        onShow(){
            console.log('登录状态',this.$store.state.hasLogin)
            if(this.$store.state.hasLogin && this.$store.state.isRealAuth==1){
                // 登录并已认证
                this.isRealAuth=true;
                console.log('已认证')
            }
            if(!this.$store.state.hasLogin){
                this.isRealAuth=false;
                console.log(this.isRealAuth)
                // #ifdef MP-WEIXIN
                // this.isShow=true;
                this.user='';
                // #endif
                // #ifdef H5
                // this.getUserInfo();
                this.user={};
                this.isShow=true;

                // #endif
            }else{
                // 获取个人信息

                this.getUserInfo();
                this.newMessage();
                // this.getApproveInfo();
            }
        },
        onLoad() {
            this.$api.httpRequest(
              'GET',
              this.$constant.API_HOME+'/common/params/TEL',
            ).then((data) => {
                console.log(data)
                this.Tel=data;
            })
            if(this.$store.state.hasLogin){
                // 获取个人信息
                this.getUserInfo();
            }else{
                this.isShow=true;
            }
        },
        // #ifndef MP
        onNavigationBarButtonTap(e) {
            const index = e.index;
            if (index === 0) {
                this.navTo('/pages/set/set');
            } else if (index === 1) {
                // #ifdef APP-PLUS
                const pages = getCurrentPages();
                const page = pages[pages.length - 1];
                const currentWebview = page.$getAppWebview();
                currentWebview.hideTitleNViewButtonRedDot({
                    index
                });
                // #endif
                uni.navigateTo({
                    url: '/pages/notice/notice'
                })
            }
        },
        // #endif
        computed: {
            ...mapState(['hasLogin', 'userInfo'])
        },
        methods: {
            call(){
                uni.makePhoneCall({
                    phoneNumber: this.Tel
                });
            },
            // 意见反馈
            navToOpinion(){
                uni.navigateTo({
                    url:'/pages/set/opinion'
                })
            },
            // 平台声明
            navToStatement(){
                uni.navigateTo({
                    url:'/pages/set/statement'
                })
            },
            // 关于我们
            navToAbout(){
                uni.navigateTo({
                    url:'/pages/set/aboutXb'
                })
            },
            newMessage(){
                this.$api.httpRequest(
                  'GET',
                  this.$constant.API_HOME+'message/messageuser/newMessage',
                  {token:this.$store.state.userInfo.token.token}
                ).then((data) => {

                    // this.isNewMsg=data;
                    if(data==1){
                        this.isNewMsg=true;
                    }else{
                        this.isNewMsg=false;
                    }
                    console.log(data)
                });
            },
            // navToCollect(){
            // 	this.navTo('/pages/goods/collectGoods?type=1')
            // },
            // navToMsg(){
            // 	uni.navigateTo({
            // 		url:'/pages/notice/notice'
            // 	})
            // },
            // 跳转分享
            invitate() {
                this.navTo('/pages/account/invitate?id=' + this.user.id)
            },
            // navToMyUser(){
            // 	console.log('进入客户列表页')
            // 	uni.navigateTo({
            // 		url:'/pages/user/myUser'
            // 	})
            // },
            // navToApprove(){
            // 	uni.navigateTo({
            // 		url:'/pages/user/approve'
            // 	})
            // },
            // navToMyHouses(){
            // 	console.log('我的楼盘')
            // 	uni.navigateTo({
            // 		url: '/pages/myHouses/myHouse'
            // 	});
            // },

            cancle(data) {
                this.isShow = data;
            },
            getUserInfo(){
                this.$api.httpRequest(
                  'GET',
                  this.$constant.API_HOME+'member/userInfo',
                  {storeId:this.$constant.STORE_ID},
                  {'token':this.$store.state.userInfo.token.token},
                ).then((data) => {
                    // console.log(data);
                    this.user=data;
                    this.isRealAuth=data.isRealAuth;
                    this.$store.state.userInfo.isRealAuth=data.isRealAuth;
                    this.$store.state.userInfo.nickname = data.nickname;
                    this.$store.state.userInfo.avatar = data.avatar;
                    console.error(this.$store.state.userInfo)
                })
            },
            navToLogin(){
                if(!this.$store.state.hasLogin){
                    // uni.navigateTo({
                    // 	url:'../public/login'
                    // })
                    this.isShow=true;
                }else{
                    this.navTo('/pages/set/set');
                }
            },
            // loginCode(){
            // 	let _this=this;
            // 	uni.login({
            // 		provider: 'weixin',
            // 		success: function(loginRes) {
            // 			_this.$api.httpRequest(
            // 				'POST',
            // 				_this.$constant.API_MRTHOL + 'member/miniapp/login/code', {
            // 					storeId: _this.$constant.STORE_ID,
            // 					code: loginRes.code,
            // 					rawData: '',
            // 					signature: '',
            // 					encryptedData: '',
            // 					iv: ''
            // 				},
            // 			).then((data) => {
            // 				// 记录token有效期
            // 				var myDate = new Date();
            // 				uni.setStorage({//缓存用户登陆状态
            // 				  key: 'time',
            // 				  data: myDate.getTime()+43000*1000,
            // 				})
            // 				_this.$store.commit('login', data)
            // 				// 登录成功 获取个人信息
            // 				_this.getUserInfo();
            // 			})
            // 		}
            // 	});
            // },
            // banner跳转
            navToAdv(url) {
                if (url != '') {
                    location.href = url
                }
            },
            // 进入商品详情
            navToDetailPage(item) {
                //测试数据没有写id，用title代替
                let id = item.id;
                uni.navigateTo({
                    url: `/pages/product/product?id=${id}&type=1`,
                })
            },
            // 跳转我的账户
            account() {
                uni.navigateTo({
                    url: '/pages/account/account'
                })
            },
            // 跳转我的评价
            navToMyEva() {
                this.navTo('/pages/evaluation/evaluation')
            },

            /**
             * 统一跳转接口,拦截未登录路由
             * navigator标签现在默认没有转场动画，所以用view
             */
            navTo(url,type=0) {
                // console.log(this.$store.state.hasLogin)

                // if (!this.$store.state.isAuthorization) {
                //
                // 	// 如果未登录
                // 	// this.loginCode();
                // 	this.isShow=true;
                // 	return false;
                // 	// url = '/pages/public/login';
                // }
                if(!this.$store.state.hasLogin){
                    // #ifdef H5
                    // const state =uni.getStorageSync('state');
                    // if(state==2){
                    // 	this.isShow=true;
                    // }else{
                    // 	uni.navigateTo({
                    // 		url:'/pages/public/empty'
                    // 	})
                    // }
                    uni.navigateTo({
                        url
                    })
                    return false;
                    // #endif
                    // #ifdef MP-WEIXIN
                    this.isShow=true;
                    return false;
                    // #endif
                }
                if(!this.isRealAuth && type==1){
                    // this.$api.msg('未认证')
                    uni.showModal({
                        title: ' ',
                        content: '您暂未认证，认证后可发布楼盘',
                        confirmText:'去认证',
                        success: function (res) {
                            if (res.confirm) {
                                uni.navigateTo({
                                    url:'/pages/user/approve'
                                })
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                    return false;
                }
                uni.navigateTo({
                    url
                })
            },
            //
            navToCollectStore() {
                this.navTo('/pages/store/collectStore?type=1')
            },
            navToCollectGoods() {
                this.navTo('/pages/goods/collectGoods?type=1')
            },
            /**
             *  会员卡下拉和回弹
             *  1.关闭bounce避免ios端下拉冲突
             *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
             *    transition设置0.1秒延迟，让css来过渡这段空窗期
             *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
             */
            coverTouchstart(e) {
                if (pageAtTop === false) {
                    return;
                }
                this.coverTransition = 'transform .1s linear';
                startY = e.touches[0].clientY;
            },
            coverTouchmove(e) {
                moveY = e.touches[0].clientY;
                let moveDistance = moveY - startY;
                if (moveDistance < 0) {
                    this.moving = false;
                    return;
                }
                this.moving = true;
                if (moveDistance >= 80 && moveDistance < 100) {
                    moveDistance = 80;
                }

                if (moveDistance > 0 && moveDistance <= 80) {
                    this.coverTransform = `translateY(${moveDistance}px)`;
                }
            },
            coverTouchend() {
                if (this.moving === false) {
                    return;
                }
                this.moving = false;
                this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
                this.coverTransform = 'translateY(0px)';
            }
        },
        watch: {
            '$store.state.isAuthorization': function() {
                const state =uni.getStorageSync('state');
                if(state==2){
                    this.isShow = true;
                }
            },
            '$store.state.hasLogin':function(){
                if(this.$store.state.hasLogin){
                    this.getUserInfo();
                }
            }
        }
    }
</script>
<style lang='scss'>
  page,
  .content {
    background: #f5f5f5;
  }

  %flex-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  %section {
    display: flex;
    justify-content: space-around;
    align-content: center;
    background: #fff;
    border-radius: 10upx;
  }
  .isRealAuth{
    color: #fff;
    /* font-weight: 550; */
    font-size: 28upx;
    margin-left: 10upx;
  }
  .user-section {
    height: 280upx;
    padding: 50upx 30upx 0;
    position: relative;
    background: #3171F2;
    color: #fff;
    border-radius: 0 0 20% 20%;
  }

  .user-section::after {
    content: '';
    width: 100%;
    height: 100upx;
    position: absolute;
    left: 0;
    top: 210upx;
    border-radius: 0 0 50% 50%;
    background: #3171F2;
  }

  .user-info-box {
    height: 200upx;
    /* padding-top: 50upx; */
    margin-top: 35upx;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
    /* border: 1upx solid transparent; */
    .portrait-box {
      width: 100upx;
      height: 100upx;
      border-radius: 50%;
      overflow: hidden;
      image{
        width: 100upx;
        height: 100upx;
        border-radius: 50%;
      }
    }

    .username {
      font-size: 36upx;
      color: #FFFFFF;
      margin-left: 20upx;
    }
    .integral{
      margin-top: 10upx;
      display: flex;
      view{
        font-size: 24upx;
        margin:0 15upx;
        border: 1upx solid #FFFFFF;
        height: 36upx;
        line-height: 36upx;
        border-radius: 18upx;
        padding:0 15upx;
      }
    }
    .info-box{
      display: flex;
      align-items: center;
      image{
        width: 128upx;
        height: 40upx;
        margin-left: 14upx;
      }
    }
  }

  .vip-card-box {
    display: flex;
    flex-direction: column;
    color: #f7d680;
    height: 240upx;
    background: linear-gradient(left, rgba(0, 0, 0, .7), rgba(0, 0, 0, .8));
    border-radius: 16upx 16upx 0 0;
    overflow: hidden;
    position: relative;
    padding: 20upx 24upx;

    .card-bg {
      position: absolute;
      top: 20upx;
      right: 0;
      width: 380upx;
      height: 260upx;
    }

    .b-btn {
      position: absolute;
      right: 20upx;
      top: 16upx;
      width: 132upx;
      height: 40upx;
      text-align: center;
      line-height: 40upx;
      font-size: 22upx;
      color: #36343c;
      border-radius: 20px;
      background: linear-gradient(left, #f9e6af, #ffd465);
      z-index: 1;
    }

    .tit {
      font-size: $font-base+2upx;
      color: #f7d680;
      margin-bottom: 28upx;

      .yticon {
        color: #f6e5a3;
        margin-right: 16upx;
      }
    }

    .e-b {
      font-size: $font-sm;
      color: #d8cba9;
      margin-top: 10upx;
    }
  }

  .cover-container {
    background: $page-color-base;
    /* margin-top: -50upx; */
    padding: 0 20upx;
    position: relative;
    /* position: absolute; */
    /* top: 350upx; */
    z-index: 2;
    background: #f5f5f5;

    /* padding-bottom: 20upx; */
    .arc {
      position: absolute;
      left: 0;
      top: -34upx;
      width: 100%;
      height: 36upx;
    }
  }

  .tj-sction {
    position: relative;
    top: -70upx;
    @extend %section;

    .tj-item {
      @extend %flex-center;
      flex-direction: column;
      height: 140upx;
      font-size: $font-sm;
      color: #75787d;
    }

    .num {
      font-size: $font-lg;
      color: $font-color-dark;
      margin-bottom: 8upx;
    }
  }
  .marginBox{
    height: 1upx;
    width: 100%;
  }
  .order-section {
    background: #FFFFFF;
    padding: 28upx 0;
    /* margin-top: -10upx; */
    position: relative;
    top: -30upx;
    .order-title {
      font-size: 28upx;
      /* padding:0 40upx 30upx 40upx; */
      margin: 0 40upx;
      padding-bottom: 25upx;
      display: flex;
      color: #333;
      justify-content: space-between;
      border-bottom: 1upx solid #E8E8E8;

      .title-right {
        display: flex;
        align-items: center;

        image {
          width: 24upx;
          height: 24upx;
          margin-left: 5upx;
        }
      }


    }

    .order-box {
      @extend %section;
      border-radius: 10upx;
    }

    .order-item {
      margin: 10upx 0;
      @extend %flex-center;
      width: 120upx;
      height: 120upx;
      border-radius: 10upx;
      font-size: 24upx;
      color: #333;

      image {
        width: 48upx;
        height: 48upx;
        margin-bottom: 10upx;
      }
    }

    .yticon {
      font-size: 48upx;
      margin-bottom: 18upx;
      color: #fa436a;
    }

    .icon-shouhoutuikuan {
      font-size: 44upx;
    }
  }

  .banner {
    margin: 20upx 0 10upx 0;

    image {
      width: 710upx;
      height: 212upx;
    }
  }

  .tool {
    background: #FFFFFF;
    padding: 10upx 0;
    border-radius: 10upx;
    margin-top: -20upx;
    margin-bottom: 30upx;
    .tool-title {
      font-size: 28upx;
      color: #333;
      padding-bottom: 20upx;
      border-bottom: 1upx solid #E8E8E8;
    }

    .tool-item {
      font-size: 28upx;
      .tool-list {
        padding:10upx 20upx;
        /* margin: 20upx auto; */
        display: flex;
        height: 120upx;
        /* flex-wrap: wrap; */
        align-items: center;
        justify-content: space-between;
        border-bottom: 1upx solid #F1F1F1;
        .tool-left{
          display: flex;
          align-items: center;
          .newMessage{
            width: 15upx;
            height: 15upx;
            background: red;
            border-radius: 50%;
            margin-left: 420upx;
          }
        }

        .tool-right{
          width: 25upx;
          height: 25upx;
        }
        image {
          width: 32upx;
          height: 32upx;
          margin-right: 20upx;
          /* margin: 28upx auto; */
        }
      }
      .tool-list:last-child{
        border: 0;
      }
    }
  }

  .results {
    font-size: 28upx;
    background: #fff;
    margin: 20upx auto;
    padding: 32upx 20upx 40upx 20upx;
    border-radius: 10upx;

    .resultsContent {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30upx 0;

      .leftBottom {
        margin-top: 20upx;
        color: #666666;
        font-size: 24upx;
      }

      .resultsRight {
        display: flex;
        align-items: center;
        color: #333333;
        font-size: 24upx;

        image {
          width: 24upx;
          height: 24upx;
        }
      }
    }

    .resultsBottom {
      display: flex;
      color: #F23D3D;
      font-size: 24upx;

      /* margin-bottom:20upx; */
      text {
        margin-right: 30upx;
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
</style>
