<template>
  <view class="container">
    <view class="contentTop">
      <view class="topTitle">
        <view class="houseName">{{houseDetail.propertyName}}</view>
        <view class="houseStatus" v-if="houseDetail.saleStatus">{{houseDetail.saleStatus}}</view>
      </view>
      <view class="houseLable" v-for="(val,index) in labelsArr" :key='index'>{{val}}</view>
    </view>
    <view class="carousel">
      <swiper indicator-dots circular=true duration="400" indicator-active-color='#3171F2' indicator-color='rgb(255,255,255)'>
        <swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index" @click="navToImgDetail(index)">
          <view class="image-wrapper">
            <image :src="item" class="loaded" mode="aspectFill"></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="housesDescribe">
      <view class="left">
        <view class="describeLeft1">
          <view class="totalTitle">参考价格（均价/总价）</view>
          <view class="totalContent" v-if="houseDetail.unitPrice && houseDetail.totalPrice">{{houseDetail.unitPrice}}元/{{houseDetail.totalPrice}}万元</view>
          <view class="totalContent" v-else>-</view>
        </view>
        <view class="describeLeft2">
          <view class="totalTitle">结构：</view>
          <view class="totalContent" v-if="houseDetail.buildingStructure">{{houseDetail.buildingStructure}}</view>
          <view class="totalContent" v-else>-</view>
        </view>
        <view class="describeLeft2">
          <view class="totalTitle">户型：</view>
          <view class="totalContent" v-if="houseDetail.saleApartment">{{houseDetail.saleApartment}}</view>
          <view class="totalContent" v-else>-</view>
        </view>

        <view class="address">
          <view class="addressTitle">地址：</view>
          <view class="addressText" v-if="houseDetail.propertyAddress">{{houseDetail.propertyAddress}}</view>
          <view class="totalContent" v-else>-</view>
        </view>
      </view>
      <view class="right">
        <view class="describeright1">
          <view class="totalTitle">建面：</view>
          <view class="totalContent" v-if="houseDetail.maxBuildArea">{{houseDetail.minBuildArea}}㎡~{{houseDetail.maxBuildArea}}㎡</view>
          <view class="totalContent" v-else>-</view>
        </view>
        <view class="describeright2">
          <view class="totalTitle">开盘：</view>
          <view class="totalContent" v-if="houseDetail.openingDate">{{houseDetail.openingDate}}</view>
          <view class="totalContent" v-else>-</view>
        </view>
        <view class="describeright2">
          <view class="totalTitle" v-show="houseDetail.commission && isRealAuth">佣金：</view>
          <view class="totalContent" v-show="houseDetail.commission && isRealAuth">{{houseDetail.commission}}元</view>
          <!-- <view class="totalContent" v-else>-</view> -->
        </view>


      </view>
    </view>
    <view class="map">
      <cover-view class="mapMask" @click="navToMap"></cover-view>
      <view class="mapMark" @click="navToMap">
        <view class="goNav">{{houseDetail.propertyName}}
          <view class="navTwo">{{houseDetail.propertyAddress}}</view>
        </view>
        <view class="triangle"></view>
      </view>
      <map style="width: 100%; height: 100%;" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
    </view>
    <!-- 户型图 -->
    <view class="houseImgBox" v-if="apartmentPictures">
      <view class="houseImgTitle">户型图</view>
      <scroll-view scroll-x="true">
        <view class="imgScollBox">
          <view class="imgBox" v-for="(val,index) in apartmentPictures" :key='index'>
            <image :src="val.picture" mode="" @click="changeBigImg(val,1)"></image>
            <view class="imgText" v-if="val.model">
              {{val.model}}
            </view>
            <view class="imgText1" v-if="val.desc">{{val.desc}}</view>

          </view>

          <!-- <view class="imgBox">
						<image src="../../static/emptyCart.jpg" mode=""></image>
					</view>
					<view class="imgBox">
						<image src="../../static/emptyCart.jpg" mode=""></image>
					</view> -->
        </view>
      </scroll-view>
    </view>
    <view class="bigImg" v-if="isBig" @click="isBig=false">
      <image :src="bigImg" mode="widthFix"></image>
      <view class="imgDesc" v-if="imgDesc">{{imgDesc}}</view>
      <view class="imgModel" v-if="imgModel">{{imgModel}}</view>
    </view>
    <view class="houseBtn">
      <view class="leftBtn" @click="navToNewHouse">
        <image src="../../static/img/send.png" mode=""></image>发布楼盘
      </view>
      <view class="rightBtn" @click="setError">
        <image src="../../static/img/eraser.png" mode=""></image>楼盘纠错
      </view>
    </view>
    <!-- 基础信息 -->
    <view class="infoBox">
      <view class="infoTitle">基础信息</view>
      <view class="infoContent">
        <view class="infoLeft">楼盘别名</view>
        <view class="infoRight" v-if="houseDetail.propertyAliasName">{{houseDetail.propertyAliasName}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">楼盘特色</view>
        <view class="infoRight" v-if="houseDetail.propertyCharacteristics">{{houseDetail.propertyCharacteristics}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">参考均价</view>
        <view class="infoRight" v-if="houseDetail.unitPrice">{{houseDetail.unitPrice}}元</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">参考总价</view>
        <view class="infoRight" v-if="houseDetail.totalPrice">{{houseDetail.totalPrice}}万元</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">物业类型</view>
        <view class="infoRight" v-if="houseDetail.propertyType">{{houseDetail.propertyType}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">建筑类型</view>
        <view class="infoRight" v-if="houseDetail.buildingStructure">{{houseDetail.buildingStructure}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">装修标准</view>
        <view class="infoRight" v-if="houseDetail.decorationStandard">{{houseDetail.decorationStandard}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">产权年限</view>
        <view class="infoRight" v-if="houseDetail.propertyRightYears">{{houseDetail.propertyRightYears}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">开发商</view>
        <view class="infoRight" v-if="houseDetail.developer">{{houseDetail.developer}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">所在区域</view>
        <view class="infoRight" v-if="houseDetail.areaName">{{houseDetail.areaName}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
    </view>
    <!-- 销售信息 -->
    <view class="infoBox">
      <view class="infoTitle">销售信息</view>
      <view class="infoContent">
        <view class="infoLeft">售卖状态</view>
        <view class="infoRight" v-if="houseDetail.saleStatus">{{houseDetail.saleStatus}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">售楼地址</view>
        <view class="infoRight" v-if="houseDetail.saleAddress">{{houseDetail.saleAddress}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">售卖楼栋</view>
        <view class="infoRight" v-if="houseDetail.saleBuilding">{{houseDetail.saleBuilding}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">售卖户型</view>
        <view class="infoRight" v-if="houseDetail.saleApartment">{{houseDetail.saleApartment}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">最新开盘</view>
        <view class="infoRight" v-if="houseDetail.latestOpening">{{houseDetail.latestOpening}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">最新交房</view>
        <view class="infoRight" v-if="houseDetail.latestHand">{{houseDetail.latestHand}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
    </view>
    <!-- 小区概括 -->
    <view class="infoBox">
      <view class="infoTitle">小区概括</view>
      <view class="infoContent">
        <view class="infoLeft">占地面积</view>
        <view class="infoRight" v-if="houseDetail.coverArea">{{houseDetail.coverArea}}㎡</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">建筑面积</view>
        <view class="infoRight" v-if="houseDetail.buildingArea">{{houseDetail.buildingArea}}㎡</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">容 积 率</view>
        <view class="infoRight" v-if="houseDetail.plotRatio">{{houseDetail.plotRatio}}%</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">绿 化 率</view>
        <view class="infoRight" v-if="houseDetail.afforestationRatio">{{houseDetail.afforestationRatio}}%</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">规划车位</view>
        <view class="infoRight" v-if="houseDetail.planPark">{{houseDetail.planPark}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">车位配比</view>
        <view class="infoRight" v-if="houseDetail.parkRatio">{{houseDetail.parkRatio}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">规划楼栋</view>
        <view class="infoRight" v-if="houseDetail.planBuilding">{{houseDetail.planBuilding}}栋</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">规划户型</view>
        <view class="infoRight" v-if="houseDetail.planHouseholds">{{houseDetail.planHouseholds}}户</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">物业公司</view>
        <view class="infoRight" v-if="houseDetail.propertyCompany">{{houseDetail.propertyCompany}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">物 业 费</view>
        <view class="infoRight" v-if="houseDetail.propertyCost">{{houseDetail.propertyCost}}元/月/㎡</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">供暖方式</view>
        <view class="infoRight" v-if="houseDetail.heatingMode">{{houseDetail.heatingMode}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">供水</view>
        <view class="infoRight" v-if="houseDetail.waterSupply">{{houseDetail.waterSupply}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
      <view class="infoContent">
        <view class="infoLeft">供电</view>
        <view class="infoRight" v-if="houseDetail.powerSupply">{{houseDetail.powerSupply}}</view>
        <view class="infoRight" v-else>-</view>
      </view>
    </view>
    <!-- 预售许可证 -->
    <view class="infoBox" v-if="preSalePermit.length>0">
      <view class="infoTitle">预售许可证</view>
      <view class="infoList" v-for="(item,index) in preSalePermit" :key='index'>
        <view class="infoContent">
          <view class="infoLeft">预 售 证</view>
          <view class="infoRight">{{item.preSaleCard}}</view>
        </view>
        <view class="infoContent">
          <view class="infoLeft">发证时间</view>
          <view class="infoRight">{{item.preSaleDate}}</view>
        </view>
        <view class="infoContent">
          <view class="infoLeft">绑定楼栋</view>
          <view class="infoRight">{{item.preSaleHouse}}</view>
        </view>
      </view>
    </view>
    <view class="goods-list1">
      <view class="goods-item" v-for="(val,index) in goodsList" :key='index' @click="navToDetail(val.id)" v-if="index<5">

        <view class="image-wrapper">
          <view class="topLabel" v-if="val.topLabel">{{val.topLabel}}</view>
          <image :src="(JSON.parse(val.designPictures))[0]" mode="aspectFill"></image>
        </view>
        <view class="listRight">
          <view class="nameBox">
            <view class="houseName">{{val.propertyName}}</view>
            <view class="state" v-if="val.saleStatus">{{val.saleStatus}}</view>
          </view>
          <view class="houseAddress">
            <text>{{val.areaName}}</text>
            <text class="area">建面：{{val.minBuildArea}}㎡~{{val.maxBuildArea}}㎡</text>
          </view>
          <view class="tagBox">
            <view class="tagList" :key='index1' v-for="(val1,index1) in labelArr[index]">{{val1}}</view>
          </view>
          <view class="price">
            <text class="priceLeft">{{val.unitPrice}}元</text>
            <!-- <text class="classifyList2">特价</text> -->
            <text class="priceLeft" v-if="isRealAuth">佣金：{{val.commission?val.commission:'-'}}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="kong" style="height: 120upx;"></view>
    <!-- 底部操作菜单 -->
    <view class="page-bottom">
      <view class="bottom-left">
        <view class="p-b-btn">
          <button class="button1" data-id="shareBtn" open-type="share" plain="true"></button>
          <image src="../../static/img/share.png" mode="" class="tabImg"></image>
          <text>分享</text>
        </view>
        <view class="p-b-btn" @click="toFavorite">
          <image src="../../static/img/heart.png" mode="" class="tabImg" v-if="!isFavorite"></image>
          <!-- <image src="../../static/image/sc2.png" mode="" class="tabImg"></image> -->
          <image src="../../static/img/heart2.png" mode="" class="tabImg" v-else></image>
          <text>关注</text>
        </view>
      </view>
      <view class="action-btn-group">
        <button type="primary" class=" action-btn no-border buy-now-btn" :class="[!isRealAuth?'unRealAuth':'']" @click="call">电话咨询</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" @click="navToReport" v-if="isRealAuth">快速报备</button>
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
  import share from '@/components/share';

  export default {
    components: {
      share
    },

    data() {
      return {
        imgModel: '', //户型图规格
        imgDesc: '', //户型图描述
        goodsList: [],
        labelArr: [],
        page: 1,
        preSalePermit: [],
        bigImg: '',
        isBig: false,
        labelsArr: [],
        apartmentPictures: [],
        isShow: false,
        houseDetail: {},
        imgList: [],
        propertyId: '',
        isFavorite: false,
        mobile: '',
        latitude: 39.909,
        longitude: 116.39742,
        isRealAuth: false,
        covers: [{
          latitude: 39.909,
          longitude: 116.39742,
          iconPath: '/static/img/round.png',
          width: 30,
          height: 30
        }]
      };
    },
    onShow() {
      // console.log(this.$store.state.hasLogin, this.$store.state.userInfo.isRealAuth)
      if (this.$store.state.hasLogin && this.$store.state.userInfo.isRealAuth == 1) {
        // 登录并已认证
        this.isRealAuth = true;
        console.log('已认证')
      }
    },
    async onLoad(options) {
      let id = options.id;
      this.propertyId = options.id;
      this.getGoodsDetails(id);
      this.getRecommend();
    },
    methods: {
      navToImgDetail(index) {
        // console.log(this.imgList)
        uni.navigateTo({
          url: '/pages/housesDetails/imageDetail?imgList=' + JSON.stringify(this.imgList) + '&index=' + index
        })
      },
      navToDetail(id) {
        uni.navigateTo({
          url: '/pages/housesDetails/housesDetail?id=' + id
        })
      },
      getRecommend() {
        this.$api.httpRequest('GET', this.$constant.API_HOME + 'property/property/list/hot',

        ).then((data) => {
          // this.goodsList = [];
          this.goodsList = data;

          for (var a = 0; a < this.goodsList.length; a++) {
            this.labelArr[a] = [];
            for (var b = 0; b < this.goodsList[a].labels.split(',').length; b++) {
              this.labelArr[a][b] = this.goodsList[a].labels.split(',')[b]
            }
          }
        });
      },
      onShareAppMessage: function(res) {
        if (res.from === 'button') {
          // 来自页面内转发按钮
          // console.log(res.target)
        }
        return {
          title: this.houseDetail.propertyIntroduce,
          path: '/pages/housesDetails/housesDetail?id=' + this.propertyId,
          imageUrl: this.imgList[0]
        }
      },
      changeBigImg(val, type = 0) {

        this.isBig = true;
        if (type == 1) {
          this.imgDesc = val.desc;
          this.imgModel = val.model;
          this.bigImg = val.picture;
          // console.log(val)
        } else {
          this.bigImg = val;
          this.imgDesc = '';
          this.imgModel = '';
        }
        // console.log(val)
      },
      navToMap() {
        if (this.isBig) {
          this.isBig = false;
          return false;
        }
        let _this = this;
        wx.openLocation({ //​使用微信内置地图查看位置。

          latitude: _this.latitude, //要去的纬度-地址

          longitude: _this.longitude, //要去的经度-地址
          name: _this.houseDetail.propertyAddress
        })
      },
      call() {
        uni.makePhoneCall({
          phoneNumber: this.mobile
        });
      },
      cancle(data) {
        this.isShow = data;
      },
      setError() {
        uni.navigateTo({
          url: '/pages/housesDetails/error?propertyId=' + this.houseDetail.id
        })
      },
      // 获取楼盘详情
      getGoodsDetails(id) {
        this.$api.httpRequest(
          'GET',
          this.$constant.API_HOME + '/property/property/' + id, {}, {
            token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : ''
          }
        ).then((data) => {
          this.houseDetail = data;
          this.preSalePermit = JSON.parse(this.houseDetail.preSalePermit)
          this.isFavorite = data.isCollect;
          this.mobile = data.mobile;
          this.imgList = JSON.parse(this.houseDetail.designPictures)
          this.covers[0].latitude = data.addressLat;
          this.covers[0].longitude = data.addressLon;
          // this.covers[0].callout.content=data.propertyAddress;
          this.latitude = data.addressLat;
          this.longitude = data.addressLon;
          this.labelsArr = data.labels.split(',')
          this.apartmentPictures = JSON.parse(data.apartmentPictures)
          // console.log(this.imgList)
        });
      },
      navToNewHouse() {
        if (!this.$store.state.hasLogin) {
          this.isShow = true;
        } else {
          // if(!this.isRealAuth){
          //   this.$api.msg('未认证，暂不可发布楼盘');
          //   return false;
          // }
          // if(this.isRealAuth){
          //   uni.navigateTo({
          //   	url:'/pages/release/releaseAll'
          //   })
          // }else{
          uni.navigateTo({
            url: '/pages/release/release'
          })
          // }
        }
      },
      //分享
      share() {
        this.$refs.share.toggleMask();
      },
      navToReport() {
        if (!this.$store.state.hasLogin) {
          this.isShow = true;
        } else {
          if (this.isRealAuth) {
            uni.navigateTo({
              url: '/pages/user/newReport?id=' + this.propertyId + '&houseName=' + this.houseDetail.propertyName
            })
          } else {
            uni.showModal({
              title: ' ',
              content: '您暂未认证，认证后可快速报备',
              confirmText: '去认证',
              success: function(res) {
                if (res.confirm) {
                  uni.navigateTo({
                    url: '/pages/user/approve'
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消');
                }
              }
            });
            // this.$api.msg('未认证')
          }

        }

      },
      //收藏
      toFavorite() {
        if (!this.$store.state.hasLogin) {
          // this.$api.msg('未登录');
          this.isShow = true;
          return false;
        }
        this.favorite = !this.favorite;

        this.$api.httpRequest(
          'POST',
          this.$constant.API_HOME + 'property/propertycollect', {
            propertyId: this.propertyId
          }, {
            token: this.$store.state.userInfo.token.token
          }
        ).then((data) => {
          this.isFavorite = !this.isFavorite;
        })

      },
    },
    watch: {
    //  ' $store.state.isAuthorization ': function() {
    //   const state = uni.getStorageSync('state');
    //   if (state == 2) {
    //     this.isShow = true;
    //   }
    //   // this.isShow = true;
    // },
    '$store.state.userInfo.isRealAuth': function(data) {
      this.isRealAuth = data;
      // console.log(data)
    },

  }
  }
</script>

<style lang='scss'>
  page {
    background: #F8F8F8;
    /* padding-bottom: 160upx; */
    overflow-x: hidden;
    height: 100%;
    overflow-y: scroll;
    /* border-bottom: 1upx solid white; */
  }

  .unRealAuth {
    width: 400upx !important;
  }

  .bigImg {
    position: fixed;
    top: 0;
    left: 0;
    width: 750upx;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #333333;
    z-index: 9999;
    color: #FFFFFF;
    font-size: 30upx;

    image {
      width: 750upx;
      /* height: 500upx; */
      /* z-index: 111111; */
    }

    .imgDesc {
      margin: 20upx auto;
    }
  }

  .contentTop {
    padding: 20upx 30upx 20upx 30upx;
    background: #fff;

    .topTitle {
      display: flex;
      align-items: center;

      .houseName {
        font-weight: 550;
        font-size: 44upx;
      }

      .houseStatus {
        margin-left: 40upx;
        font-size: 22upx;
        color: #fff;
        background: #4399FC;
        height: 30upx;
        line-height: 30upx;
        padding: 0 5upx;
      }
    }

    .houseLable {
      display: inline-block;
      /* border: 0.5upx solid #CCCCCC; */
      border: 1upx solid #DCDFE6;
      color: #999999;
      font-size: 20upx;
      padding: 5upx 10upx;
      margin-right: 10upx;
      border-radius: 5upx;
    }
  }

  /* <view class="address">
					<view class="addressTitle">地址：</view>
					<view class="addressText" v-if="houseDetail.propertyAddress">{{houseDetail.propertyAddress}}</view>
          <view class="totalContent" v-else>-</view>
				</view> */
  .address {

    width: 750upx;
    display: flex;

    .addressTitle {
      color: #999999;
      width: 90upx !important;
    }

    .addressText {
      width: 600upx;
    }
  }

  .map {
    background: #fff;
    width: 100%;
    padding: 20upx;
    height: 300upx;
    /* border: 1upx solid #333333; */
    /* margin: 30upx auto; */
    position: relative;

    /* padding: 0 30upx; */
    .mapMask {
      position: absolute;
      top: 0;
      left: 0;
      width: 750upx;
      height: 300upx;
      background: rgba(0, 0, 0, 0);
    }

    .mapMark {
      position: absolute;
      top: 0;
      left: 0;
      width: 750upx;
      height: 300upx;
      z-index: 103;

      background: rgba(0, 0, 0, 0);
      display: flex;
      justify-content: center;

      /* align-items: center; */
      .goNav {
        max-width: 350upx;
        min-width: 200upx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 8upx 10upx 0;
        /* border: 1upx solid #333333; */
        margin-top: 40upx;
        text-align: left;
        height: 75upx;
        font-weight: 550;
        /* line-height: 100upx; */
        background: #FFFFFF;
        color: #333;
        font-size: 26upx;
        border-radius: 5upx;

        .navTwo {
          min-width: 200upx;
          height: 50upx;
          max-width: 350upx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          /* text-align: ; */
          font-weight: 200;
          /* display: flex;
         justify-content: center;
         align-items: center; */
          font-size: 20upx;
          color: dimgrey;
          /* image{
           width: 30upx;
           height: 30upx;
         } */
        }

      }

      .goNav:after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 8px;
        border-color: #fff transparent transparent transparent;
        position: absolute;
        /* margin-top: 15px;
        margin-left: -10px; */
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 110upx auto;
      }

      /* .triangle{
        content:'';
        width: 0;
        height: 0;
        border-style:solid;
        border-width:8px;
        border-color:#fff transparent transparent transparent;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin:108upx auto;
      } */
    }
  }

  .scrollBox {
    width: 100%;
    overflow-x: scroll;
  }

  .houseImgBox {
    background: #fff;
    padding: 30upx;
    padding-right: 0;

    .houseImgTitle {
      font-size: 40upx;
      font-weight: 550;
    }

    .imgScollBox {
      margin: 30upx auto;
      display: flex;

      .imgBox {
        width: 300upx;
        /* height: 650upx; */
        display: inline-block;
        margin-right: 40upx;
        /* border: 1upx solid #555555; */

        image {
          width: 300upx;
          height: 300upx;
        }

        .imgText {
          width: 300upx;
          min-height: 45upx;
          font-size: 28upx;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .imgText1 {
          color: #999999;
          min-height: 60upx;
          text-align: center;
          font-size: 24upx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .houseBtn {
    background: #fff;
    padding: 30upx;
    /* padding-top: 0; */
    display: flex;
    justify-content: space-between;
    margin-top: 30upx;

    .leftBtn,
    .rightBtn {
      width: 320upx;
      height: 80upx;
      line-height: 80upx;
      text-align: center;
      color: #3171F2;
      border: 1upx solid #3171F2;
      font-size: 32upx !important;
      border-radius: 8upx;
      background: #F3F7FF;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 40upx;
        height: 40upx;
        margin-right: 20upx;
      }
    }
  }

  .infoBox {
    background: #FFFFFF;
    padding: 30upx;
    margin: 30upx auto;

    .infoList {
      padding-bottom: 30upx;
      border-bottom: 1upx solid #C0C4CC;
    }

    .infoList:last-child {
      border: 0;
    }

    .infoTitle {
      font: 40upx;
      font-weight: 550;
    }

    .infoContent {
      display: flex;
      align-items: top;
      justify-content: space-between;
      margin: 30upx auto;

      .infoLeft {
        width: 140upx;
        font-size: 30upx;
        color: #999999;
      }

      .infoRight {
        width: 476upx;
        font-size: 30upx;
        margin-right: 34upx;
      }
    }

    .infoContent:last-child {
      margin-bottom: 0;
    }
  }

  .groupBtn1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24upx;
  }

  .carousel {
    width: 710upx;
    margin: 0 auto;
    height: 422upx;
    position: relative;

    /* margin: 20upx auto; */
    swiper {
      height: 100%;
    }

    .image-wrapper {
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      display: flex;
      justify-content: center;
      align-content: center;
      height: 750upx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }

  }

  .housesDescribe {
    width: 750upx;
    box-sizing: border-box;
    background: #FFFFFF;
    padding: 20upx 30upx;
    display: flex;
    font-size: 30upx;
    overflow-x: hidden;

    .left,
    .right {
      width: 50%;
    }

    .describeLeft1,
    .describeright1 {
      color: #999999;

      .totalContent {
        font-size: 32upx;
        color: red;
        margin: 10upx 0 42upx;
      }
    }

    .totalTitle {
      min-width:96upx;
      color: #999999;
      /* height: 30upx; */
    }

    .describeLeft2,
    .describeright2 {
      margin: 30upx auto;
      display: flex;
      height: 45upx;
    }
  }

  /* 分享 */
  .share-section {
    display: flex;
    align-items: center;
    color: $font-color-base;
    background: linear-gradient(left, #fdf5f6, #fbebf6);
    padding: 12upx 30upx;

    .share-icon {
      display: flex;
      align-items: center;
      width: 70upx;
      height: 30upx;
      line-height: 1;
      border: 1px solid $uni-color-primary;
      border-radius: 4upx;
      position: relative;
      overflow: hidden;
      font-size: 22upx;
      color: $uni-color-primary;

      &:after {
        content: '';
        width: 50upx;
        height: 50upx;
        border-radius: 50%;
        left: -20upx;
        top: -12upx;
        position: absolute;
        background: $uni-color-primary;
      }
    }

    .icon-xingxing {
      position: relative;
      z-index: 1;
      font-size: 24upx;
      margin-left: 2upx;
      margin-right: 10upx;
      color: #fff;
      line-height: 1;
    }

    .tit {
      font-size: $font-base;
      margin-left: 10upx;
    }

    .icon-bangzhu1 {
      padding: 10upx;
      font-size: 30upx;
      line-height: 1;
    }

    .share-btn {
      flex: 1;
      text-align: right;
      font-size: $font-sm;
      color: $uni-color-primary;
    }

    .icon-you {
      font-size: $font-sm;
      margin-left: 4upx;
      color: $uni-color-primary;
    }
  }

  .goods-list1 {
    margin-bottom: 90upx;

    .goods-item {
      margin: 10upx 0;
      width: 100%;
      background-color: white;
      padding: 20upx;
      overflow: hidden;
      display: flex;
    }

    .image-wrapper {
      width: 280upx;
      height: 220upx;
      margin-right: 20upx;
      position: relative;

      image {
        width: 100%;
        height: 100%;
        opacity: 1;
      }

    }

    .topLabel {
      position: absolute;
      background: #3171F2;
      padding: 5upx 10upx;
      color: #fff;
      z-index: 100;
      font-size: 24upx;
      border-radius: 5upx;
    }

    .listRight {
      width: 470upx;

      .nameBox {
        margin: 10upx auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30upx;
        font-weight: 550;

        .state {
          padding: 5upx 15upx;
          color: #fff;
          background: #3171F2;
          border-radius: 10upx;
          font-size: 24upx;
          font-weight: 300;
        }
      }

      .houseAddress {
        color: #C0C4CC;
        font-size: 28upx;
        margin: 10upx auto;

        .area {
          margin-left: 20upx;
        }
      }

      .tagBox {
        margin: 10upx auto;

        .tagList {
          display: inline-block;
          border: 1upx solid #DCDFE6;
          color: #999999;
          font-size: 24upx;
          padding: 5upx 10upx;
          margin-right: 10upx;
          border-radius: 5upx;
        }
      }

      .price {
        color: #E02020;
        font-size: 30upx;
        display: flex;

        .priceLeft {
          margin-right: 30upx;
        }
      }
    }
  }

  /* <view class="page-bottom">
  	<view class="p-b-btn">
      <button class="button1" data-id="shareBtn" open-type="share" plain="true"></button>
  		<image src="../../static/img/share.png" mode="" class="tabImg"></image>
  		<text>分享</text>
  	</view>
  	<view class="p-b-btn" @click="toFavorite">
  		<image src="../../static/img/heart.png" mode="" class="tabImg" v-if="!isFavorite"></image>
  		<!-- <image src="../../static/image/sc2.png" mode="" class="tabImg"></image> -->
  		<image src="../../static/img/heart2.png" mode="" class="tabImg" v-else></image>
  		<text>关注</text>
  	</view>
  	<view class="action-btn-group">
  		<button type="primary" class=" action-btn no-border buy-now-btn" :class="[!isRealAuth?'unRealAuth':'']" @click="call">电话咨询</button>
  		<button type="primary" class=" action-btn no-border add-cart-btn" @click="navToReport" v-if="isRealAuth">快速报备</button>
  	</view>
  </view>
  */
  /* 底部操作菜单 */
  .page-bottom {
    position: fixed;
    left: 0upx;
    bottom: 0upx;
    z-index: 105;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 150upx;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border-top: 1upx solid #F8F8F8;

    /* box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5); */
    /* border-radius: 16upx; */
    .bottom-left {
      width: 220upx;
      display: flex;
      justify-content: space-around;
      padding-left: 20upx;
      /* padding: 0 ; */
    }

    .tabImg {
      width: 48upx;
      height: 48upx;
    }

    button[plain] {
      border: 0
    }

    .button1 {
      position: absolute;
      top: 0;
      left: 0;
      width: 80upx;
      height: 90upx;
      z-index: 5000;
      /* margin-left: 60upx; */
    }

    .p-b-btn,
    .p-b-btn1 {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: $font-sm;
      color: $font-color-base;
      /* width: 116upx; */
      height: 90upx;

      .yticon {
        font-size: 40upx;
        line-height: 48upx;
        color: $font-color-light;
      }

      &.active,
      &.active .yticon {
        color: $uni-color-primary;
      }

      .icon-fenxiang2 {
        font-size: 42upx;
        transform: translateY(-2upx);
      }

      .icon-shoucang {
        font-size: 48upx;
      }
    }

    .p-b-btn1 {
      width: 35%;
    }

    .action-btn-group,
    .action-btn-group1 {
      width: 530upx;
      display: flex;
      padding-right: 20upx;
      height: 110upx;
      /* padding:0 20upx; */
      align-items: center;
      /* border-radius: 100px; */
      overflow: hidden;
      /* box-shadow: 0 20upx 40upx -16upx #fa436a; */
      /* box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4); */
      /* background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C); */
      /* margin-right: 30upx; */
      position: relative;

      /* &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateY(-50%);
        height: 28upx;
        width: 0;
        border-right: 1px solid rgba(255, 255, 255, .5);
      } */

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 200upx;
        height: 90upx;
        font-size: $font-base;
        /* padding: 0; */
        border-radius: 0;
        /* background: transparent; */
        background: #FA6400;
        border-radius: 8upx;
      }

      .buy-now-btn {
        font-weight: 600;
      }

      .add-cart-btn {
        background: #3171F2;
        font-weight: 600;
        /* margin-left: 30upx; */
      }
    }

    .action-btn-group1 {
      width: 50%;
    }
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>
