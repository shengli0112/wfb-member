<template>
  <view class="container">
    <view class="mp-search-box" @click="navToSearch">
      <!-- <input class="ser-input" type="text" value="" disabled placeholder="搜索您想要的商品"/> -->
      <image src="../../static/img/Search.png" mode=""></image>
      请输入楼盘名称
    </view>

    <!-- 头部轮播 -->
    <view class="carousel-section">
      <!-- 标题栏和状态栏占位符 -->
      <!-- <view class="titleNview-placing"></view> -->
      <!-- 背景色区域 -->
      <!-- <view class="titleNview-background" ></view> -->
      <swiper class="carousel" circular :interval="2000" :autoplay="true" @change="swiperChange">
        <swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToURL(item.url)">
          <image :src="item.imageUrl"></image>
        </swiper-item>
      </swiper>
      <!-- 自定义swiper指示器 -->
      <view class="swiper-dots">
        <text class="num">{{swiperCurrent+1}}</text>
        <text class="sign">/</text>
        <text class="num">{{swiperLength}}</text>
      </view>
    </view>
    <!-- <view class="linshi" @click="navToRelease">发布楼盘</view> -->
    <!-- 导航区 -->
    <view class="cate-section">
      <view :class="cateItem" @click="navToAllHouse('new')">
        <image src="../../static/img/zuijin.png"></image>
        <text>最近楼盘</text>
      </view>
      <view :class="cateItem" @click="navToAllHouse('discount')">
        <image src="../../static/img/zhoubao.png"></image>
        <text>折扣好房</text>
      </view>
      <view :class="cateItem" @click="navToAllHouse('pop')">
        <image src="../../static/img/qblp.png"></image>
        <text>网红楼盘</text>
      </view>
<!--      <view :class="cateItem" @click="navToAllHouse">-->
<!--        <image src="../../static/img/qblp.png"></image>-->
<!--        <text>全部楼盘</text>-->
<!--      </view>-->
      <view :class="cateItem" @click="navToFind" v-if="!isRealAuth">
        <image src="../../static/img/fulp.png"></image>
        <text>帮找房</text>
      </view>
      <view :class="cateItem" @click="navToRelease" v-else>
        <image src="../../static/img/fulp.png"></image>
        <text>发布楼盘</text>
      </view>
    </view>
    <!-- 	<view v-if="navMenus.length>0" class="cate-section" v-for="(navMenu,index) in navMenus " :key='index'>
        <view :class="cateItem" v-for="nav in navMenu "  @click="navToNewsDetails(nav.pageUrl)" :key='nav.id'>
          <image :src="nav.icon"></image>
          <text>{{nav.name}}</text>
        </view>
      </view> -->
    <!-- <view class="findHouse" @click="navToFind">
      <view class="findTitle">帮找房</view>
      <view class="findContent">
        <view class="findLeft">
          <view class="leftText">小宝通过大数据为您找房。精准、极速、保密</view>
          <view class="leftBtn">立即找房></view>
        </view>
        <view class="findRight">
          <image src="../../static/img/find.png" mode=""></image>
        </view>
      </view>
    </view> -->
    <!-- 猜你喜欢 -->
    <view class="goods-list1">
      <view class="goods-item" v-for="(val,index) in goodsList" :key='index' @click="navToDetail(val.id)">

        <view class="image-wrapper">
          <view class="topLabel" v-if="val.topLabel">{{val.topLabel}}</view>
          <image :src="(JSON.parse(val.designPictures))[0]" mode="aspectFill"></image>
        </view>
        <view class="listRight">
          <view class="nameBox">
            <view class="houseName">{{val.propertyName}}</view>
            <view class="state" v-bind:class="{'chip':val.saleStatus=='认筹中','shopping':val.saleStatus=='在售','out':val.saleStatus=='售罄' }" v-if="val.saleStatus">{{val.saleStatus}}</view>
          </view>
          <view class="houseAddress">
            <text>{{val.areaName}}</text>
            <text class="area">建面：{{val.minBuildArea}}㎡~{{val.maxBuildArea}}㎡</text>
          </view>
          <view class="tagBox">
            <view class="tagList" :key='index1' v-for="(val1,index1) in labelArr[index]">{{val1}}</view>
          </view>
          <view class="price">
            <text class="priceLeft">{{val.unitPrice}}元/㎡</text>
            <!-- <text class="classifyList2">特价</text> -->
            <text class="priceLeft" v-if="isRealAuth && isLogin">佣金：{{val.commission?val.commission:'-'}}</text>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
    <view class="mask" v-if="isShow">
      <page-authorization @isShow='cancle'></page-authorization>
    </view>
  </view>
</template>

<script>
    import {
        mapMutations
    }                  from 'vuex';
    import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

    export default {
        components:{
            uniLoadMore
        },
        data(){
            return {
                isLogin             :false,
                isShow              :false,
                showWebView         :false,
                cateItem            :'cate-item',
                loadingType         :'more', //加载更多状态
                page                :1,
              /* banner */
                titleNViewBackground:'rgba(255,79,79,0.32)',
                swiperCurrent       :0,
                swiperLength        :0,
                carouselList        :[],
              /* 导航 */
                navMenus            :[],
                middleAd            :{
                    src:'/static/temp/ad1.jpg'
                },
              /*轮播*/

              /* 为你推荐 */
                goodsList :[],
                newList   :[],
                isRealAuth:0,
                labelArr  :[]
                // isCancle:true,
            };
        },
        computed  :{
            stringifyToArr(val){
                // console.log(val)
                return function(val){
                    // return ['1']
                    // console.log(val)
                }

                // return stringify.splice(',')

            },
        },
        //加载更多
        onReachBottom(){
            if(this.loadingType === 'nomore'){
                return;
            }
            this.page++;
            this.getRecommend();
        },
        onShow(){
            let _this = this;
            // this.$api.httpRequest(
            // 	  'GET',
            // 	 this.$constant.API_HOME+'member/userInfo',
            // 		{storeId:this.$constant.STORE_ID},
            // 	  {'token':this.$store.state.userInfo.token.token},
            // 	).then((data) => {
            // 	  // console.log(data);
            //     this.isRealAuth=data.isRealAuth;
            //     this.$store.state.userInfo.isRealAuth=data.isRealAuth;
            //     this.getRecommend();
            // 	})
            if(this.$store.state.hasLogin){
                // console.log(this.$store.state.userInfo)
                this.getUserInfo();
            }
            this.isLogin = this.$store.state.hasLogin

            // if(this.$store.state.hasLogin && this.$store.state.isRealAuth==1){
            //   this.isRealAuth=true;
            // }
            this.page = 1;
            this.getRecommend()
        },
        onLoad(options){
            // this.isRealAuth=this.$store.state.userInfo.isRealAuth;
            // console.log(this.isRealAuth)
            // if(this.$store.state.hasLogin){
            //   console.log(this.$store.state.userInfo)
            //   this.getUserInfo();
            // }
            // #ifdef H5
            // alert(this.$store.state.isAuthorization)
            const state  = uni.getStorageSync('state');
            const openId = uni.getStorageSync('openId');
            if(openId){
                this.$store.state.openId = openId;
            }
            if(state == 2 || this.$store.state.hasLogin){
                // console.log(options.code)
                // 未绑定手机号
                // console.log(this.$store.state.openId)
                // return false;
            }else{
                // uni.navigateTo({
                // 	url:'/pages/public/empty'
                // })
            }

            // #endif
            this.loadData();
            // 判断广告时间
            // const value = uni.getStorageSync('advTime');
            // // alert(value)
            // if(value){
            // 	const myDate = new Date();
            // 	   if (value>=myDate) {
            // 	       console.log(value-myDate);
            // 								this.isShowAdv=false;
            // 	   }else{
            // 					this.isShowAdv=true;
            // 				}
            // }
        },
        methods   :{
            ...mapMutations(['login', 'logout']),
            cancle(data){
                this.isShow = data;
            },

            navToAllHouse(mark){
                uni.setStorageSync('SWITCH_TAB_MARK', mark);
                uni.switchTab({
                    url:'/pages/cart/cart',
                })
            },
            navToFind(){
                if(!this.$store.state.hasLogin){
                    // uni.navigateTo({
                    // 	url:'../public/login'
                    // })
                    this.isShow = true;
                }else{
                    uni.navigateTo({
                        url:'/pages/findHouse/findHouse'
                    })
                }

            },
            getUserInfo(){
                this.$api.httpRequest(
                  'GET',
                  this.$constant.API_HOME + 'member/userInfo',
                  {storeId:this.$constant.STORE_ID},
                  {'token':this.$store.state.userInfo.token.token},
                ).then((data) => {
                    // console.log(data);
                    this.user       = data;
                    this.isRealAuth = data.isRealAuth;
                    // this.getRecommend();
                    // console.log(this.isRealAuth)
                })
            },
            // 发布楼盘
            navToRelease(){
                if(!this.$store.state.hasLogin){
                    this.isShow = true;
                    return;
                }

                if(!this.isRealAuth){
                    // this.$api.msg('未认证');
                    uni.showModal({
                        title      :' ',
                        content    :'您暂未认证，认证后可发布楼盘',
                        confirmText:'去认证',
                        success    :function(res){
                            if(res.confirm){
                                uni.navigateTo({
                                    url:'/pages/user/approve'
                                })
                            }else if(res.cancel){
                                console.log('用户点击取消');
                            }
                        }
                    });
                    return false;
                }
                uni.navigateTo({
                    url:'/pages/release/releaseAll'
                })

            },
            navToDetail(id){
                uni.navigateTo({
                    url:'/pages/housesDetails/housesDetail?id=' + id
                })
            },
            // 删除广告
            // del(){
            // 	this.isCancle=false;
            // },
            // 进入热点新闻详情
            navToNewsDetails(url){
                // this.webViewSrc=url;
                // this.showWebView=true;
                //  #ifdef MP-WEIXIN
                uni.navigateTo({
                    url:'/pages/public/navUrl?url=' + url
                })
                // #endif
                // #ifdef H5
                location.href = url
                // #endif
            },
            navToSearch(){
                uni.navigateTo({
                    url:'/pages/search/search'
                })
            },
            navToActive(id){
                uni.navigateTo({
                    url:'/pages/seckill/activity?id=' + id
                })
            },
            navToCart(){
                // console.log(this.$store.state.hasLogin)
                if(!this.$store.state.hasLogin){

                    // 如果未登录
                    this.isShow = true;
                    // this.loginCode();
                    return false;
                    // url = '/pages/public/login';
                }
                uni.navigateTo({
                    url:'/pages/cart/cart'
                })
            },
            getRecommend(){
                this.$api.httpRequest('GET', this.$constant.API_HOME + 'index/recommend',
                  {
                      page :this.page,
                      limit:'10',
                  },
                  {token:this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',}
                ).then((data) => {
                    this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
                    data.total == 0 ? this.loadingType = 'nomore' : '';
                    if(this.page == 1){
                        this.goodsList = [];
                        this.goodsList = data.list;
                    }else{
                        for(var i = 0; i < data.list.length; i++){
                            this.goodsList.push(data.list[i])
                        }
                    }
                    for(var a = 0; a < this.goodsList.length; a++){
                        this.labelArr[a] = [];
                        for(var b = 0; b < this.goodsList[a].labels.split(',').length; b++){
                            this.labelArr[a][b] = this.goodsList[a].labels.split(',')[b]
                        }
                    }
                });
            },
            //轮播图切换修改背景色
            swiperChange(e){
                const index        = e.detail.current;
                this.swiperCurrent = index;
                //this.titleNViewBackground = this.carouselList[index].background;
            },
            async loadData(){
                this.$api.httpRequest('GET', this.$constant.API_HOME + 'index/index').then((data) => {
                    console.log(data)
                    let carouselList  = data.wheelAdvertising;
                    // this.titleNViewBackground = carouselList[0].background;
                    this.swiperLength = carouselList.length;
                    this.carouselList = carouselList;
                    this.splitNavMenu(data.navigation);
                });
               // this.getRecommend();
            },
            navToURL(url){
                // console.log(url)

                if(url){
                    uni.navigateTo({
                        url:url
                    })
                }
                // uni.navigateTo({
                // 	url:'/pages/public/navUrl?url='+url
                // })
            },
            // 导航 去数据结构重组
            splitNavMenu(navigation){

                // 布局方式 1:2*4 2:3*4 3:2*5 4:3*5
                let layout    = [1, 5];
                this.cateItem = 'cate-item1';
                if(navigation.layoutType == 1){
                    layout        = [2, 4];
                    this.cateItem = 'cate-item'
                }
                if(navigation.layoutType == 2){
                    layout        = [3, 4];
                    this.cateItem = 'cate-item'
                }
                if(navigation.layoutType == 3){
                    layout        = [2, 5];
                    this.cateItem = 'cate-item1';
                }
                if(navigation.layoutType == 4){
                    layout        = [3, 5];
                    this.cateItem = 'cate-item1';
                }
                let i = 0;
                for(let j = 0; j < layout[0]; j++){
                    this.navMenus[j] = []
                    // let navMenu= [];
                    for(let h = 0; h < layout[1]; h++){
                        if(i >= navigation.navigationList.length){
                            return false;
                        }
                        let nav = navigation.navigationList[i++];
                        this.navMenus[j].push(nav);
                    }
                    // console.log(this.navMenus);
                }

            },

            keywords:function(keyword){
                if(!keyword){
                    return "　"
                }
                return keyword.replace(/,/g, " | ");
            },

            //详情页
            navToDetailPage(item){
                //测试数据没有写id，用title代替
                let id = item.id;
                uni.navigateTo({
                    url:`/pages/product/product?id=${id}&type=1`
                })
            },
        },
        watch     :{
            '$store.state.userInfo.isRealAuth':function(data){
                this.isRealAuth = data;
                // console.log(data)
            },

        }
    }
</script>

<style lang="scss">
  $page-section-margin: 24upx;

  .mp-search-box{
    margin: 10upx 20upx 20upx;
    height: 70upx;
    line-height: 70upx;
    background: #F8F8F8;
    text-align: center;
    font-size: 28upx;
    color: #999999;
    display: flex;
    justify-content: center;
    align-items: center;

    image{
      width: 28upx;
      height: 28upx;
    }
  }


  page{
    background: #FFFFFF;
  }

  .m-t{
    margin-top: 16upx;
  }

  /* 头部 轮播图 */
  .carousel-section{
    position: relative;
    // padding-top: 10px;

    .titleNview-placing{
      height: var(--status-bar-height);
      // padding-top: 44px;
      box-sizing: content-box;
    }

    .titleNview-background{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 426upx;
      transition: .4s;
    }
  }

  .carousel{
    width: 710upx;
    height: 290upx;
    margin: 0 auto;
    box-shadow: 0 0 16upx rgba(153, 153, 153, 0.8);
    border-radius: 8upx;

    .carousel-item{
      width: 100%;
      height: 100%;
      border-radius: 8upx;
      overflow: hidden;
    }

    image{
      width: 100%;
      height: 100%;
      border-radius: 8upx;
    }
  }

  .swiper-dots{
    display: flex;
    position: absolute;
    right: 60upx;
    bottom: 15upx;
    width: 72upx;
    height: 36upx;

    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABkCAYAAADDhn8LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTk4MzlBNjE0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTk4MzlBNjA0NjU1MTFFOUExNjRFQ0I3RTQ0NEExQjMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Q0E3RUNERkE0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Q0E3RUNERkI0NjExMTFFOTg5NzI4MTM2Rjg0OUQwOEUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4Gh5BPAAACTUlEQVR42uzcQW7jQAwFUdN306l1uWwNww5kqdsmm6/2MwtVCp8CosQtP9vg/2+/gY+DRAMBgqnjIp2PaCxCLLldpPARRIiFj1yBbMV+cHZh9PURRLQNhY8kgWyL/WDtwujjI8hoE8rKLqb5CDJaRMJHokC6yKgSCR9JAukmokIknCQJpLOIrJFwMsBJELFcKHwM9BFkLBMKFxNcBCHlQ+FhoocgpVwwnv0Xn30QBJGMC0QcaBVJiAMiec/dcwKuL4j1QMsVCXFAJE4s4NQA3K/8Y6DzO4g40P7UcmIBJxbEesCKWBDg8wWxHrAiFgT4fEGsB/CwIhYE+AeBAAdPLOcV8HRmWRDAiQVcO7GcV8CLM8uCAE4sQCDAlHcQ7x+ABQEEAggEEAggEEAggEAAgQACASAQQCCAQACBAAIBBAIIBBAIIBBAIABe4e9iAe/xd7EAJxYgEGDeO4j3EODp/cOCAE4sYMyJ5cwCHs4rCwI4sYBxJ5YzC84rCwKcXxArAuthQYDzC2JF0H49LAhwYUGsCFqvx5EF2T07dMaJBetx4cRyaqFtHJ8EIhK0i8OJBQxcECuCVutxJhCRoE0cZwMRyRcFefa/ffZBVPogePihhyCnbBhcfMFFEFM+DD4m+ghSlgmDkwlOgpAl4+BkkJMgZdk4+EgaSCcpVX7bmY9kgXQQU+1TgE0c+QJZUUz1b2T4SBbIKmJW+3iMj2SBVBWz+leVfCQLpIqYbp8b85EskIxyfIOfK5Sf+wiCRJEsllQ+oqEkQfBxmD8BBgA5hVjXyrBNUQAAAABJRU5ErkJggg==);
    background-size: 100% 100%;

    .num{
      width: 36upx;
      height: 36upx;
      border-radius: 50px;
      font-size: 24upx;
      color: #fff;
      text-align: center;
      line-height: 36upx;
    }

    .sign{
      position: absolute;
      top: 0;
      left: 50%;
      line-height: 36upx;
      font-size: 12upx;
      color: #fff;
      transform: translateX(-50%);
    }
  }


  .findHouse{
    font-size: 14px;
    padding: 0 30upx;
    // margin: 20upx 0;
    .findTitle{
      font-weight: 550;
      font-size: 16px;
      padding: 20upx 0;
      border-bottom: 1upx solid #D6D6D6;
    }

    .findContent{
      display: flex;
      justify-content: space-between;
      align-items: center;
      // padding: 20upx 0;
      .leftBtn{
        font-weight: 550;
      }

      .findRight{
        width: 184upx;
        height: 142upx;

        image{
          width: 184upx;
          height: 142upx;
        }
      }
    }

  }

  /* 分类 */
  .cate-section{
    display: flex;
    // justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    // padding: 30upx 22upx;
    background: #fff;

    .cate-item{

      width: 25%;
      padding: 20upx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $font-sm + 2upx;
      color: $font-color-dark;
    }

    .cate-item1{
      width: 20%;
      // padding: 10upx 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $font-sm + 2upx;
      color: $font-color-dark;
    }

    /* 原图标颜色太深,不想改图了,所以加了透明度 */
    image{
      width: 108upx;
      height: 108upx;
      // margin-bottom: 14upx;
      // border-radius: 50%;
      // opacity: .7;
      // box-shadow: 0 0 10upx rgba(0, 0, 0, 0.2);
    }
  }

  .ad-1{
    margin: 20upx $page-section-margin;
    height: 160upx;
    overflow: hidden;

    // background: #fff;
    image{
      // border-radius:120upx;
      width: 100%;
      height: 100%;
    }
  }

  /* 为你推荐*/
  #recommend_section{
    .guess-section{
      .goods-item{
        display: flex;

        .imageBox{
          width: 160upx;
          height: 140upx;
          margin: 30upx;

          image{
            width: 160upx;
            height: 140upx;
          }
        }

        .goodListRight{
          margin: 30upx 30upx 30upx 20upx;
          width: 440upx;

          .title1{
            font-size: 28upx;
            color: #333333;
            height: 80upx;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
          }

          .price{
            color: #F23D3D;
            font-size: 36upx;
            margin-right: 22upx;
          }

          .oldPrice{
            color: #999999;
            font-size: 24upx;
            text-decoration: line-through;
          }

          .goodsListBottom{
            display: flex;
            justify-content: space-between;
            align-items: center;

            image{
              width: 72upx;
              height: 72upx;
            }

            text{
              color: #999999;
              font-size: 24upx;
            }
          }
        }
      }
    }
  }

  .goods-list1{
    .goods-item{
      // margin: 10upx 0;
      width: 100%;
      background-color: white;
      padding: 20upx;
      overflow: hidden;
      display: flex;
      align-items: center;
      border-bottom: 1upx solid #E8E8E8;
      // justify-content: space-between;
    }

    .goods-item:last-child{
      border: 0;
    }

    .image-wrapper{
      width: 250upx;
      height: 180upx;
      // border: 1upx solid #303133;
      margin-right: 20upx;
      position: relative;

      image{
        width: 100%;
        height: 100%;
        opacity: 1;
      }

    }

    .topLabel{
      position: absolute;
      background: #3171F2;
      padding: 5upx 10upx;
      color: #fff;
      z-index: 100;
      font-size: 24upx;
      border-radius: 5upx;
    }

    .listRight{
      // border: 1upx solid #4399FC;
      width: 470upx;

      .nameBox{
        // margin: 10upx auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30upx;
        font-weight: 550;
      }

      .houseAddress{
        color: dimgrey;
        font-size: 28upx;
        margin: 10upx auto;

        .area{
          margin-left: 20upx;
        }
      }

      .tagBox{
        // border: none;
        // padding: 0;
        // display: flex;
        margin: 10upx auto;

        .tagList{
          display: inline-block;
          border: 1upx solid #999;
          color: dimgrey;
          font-size: 24upx;
          padding: 5upx 10upx;
          margin-right: 10upx;
          border-radius: 5upx;
        }
      }

      .price{
        color: #E02020;
        font-size: 30upx;
        display: flex;

        .priceLeft{
          margin-right: 30upx;
        }
      }
    }


  }

  // <view class="shoppingCart">
  // 		<image src="../../static/img/iconfontcart.png" mode=""></image>
  // 		<text>购物车</text>
  // 	</view>
  .shoppingCart{
    position: fixed;
    right: 60upx;
    bottom: 120upx;
    width: 100upx;
    height: 100upx;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20upx;
    color: #fff;
    background: #F23D3D;
    border-radius: 50%;
    box-shadow: 0 6upx 10upx #DF3636;

    image{
      width: 32upx;
      height: 32upx;
    }
  }

  .mask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
</style>
