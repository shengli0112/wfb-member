<template>
  <view class="content">
    <view class="mark"><image :src="storeDetails.storeBanner" mode=""></image></view>
    <!-- <view class="title-box" :style="'backgroundImage:url('+storeDetails.storeBanner+')'"> -->
    <view class="title-box">
      <view class="store-details">
        <view class="store-left">
          <image :src="storeDetails.storeAvatar" mode=""></image>
        </view>
        <view class="store-center">
          <view class="center-top" @click="goStoreDetails()">
            {{storeDetails.storeName}}<text class="yticon icon-you iconRight"></text>
          </view>
          <view class="center-bottom">自营</view>
        </view>
        <view class="store-right">
          <view class="right-top" @click="isCollection()" v-if="isShow==true">已收藏</view>
          <view class="right-top right-top2" @click="isCollection()" v-if="!isShow==true">+收藏</view>
          <view class="right-bottom">{{storeDetails.collectNum}}人关注</view>
        </view>
      </view>
      <view class="title-tab">
        <view class="tab-input" @click="goSearch()">
          <image src="../../static/image/search.png" mode=""></image>
          <text>搜索</text>
        </view>
        <view class="tab-box">
          <view class="tab-classify" @click="tabIndex=0" :class="{tabClassifyBorder:tabIndex==0}">首页</view>
          <view class="tab-classify" @click="tabIndex=1,getData(0)" :class="{tabClassifyBorder:tabIndex==1}">商品</view>
          <view class="tab-classify" @click="tabIndex=2" :class="{tabClassifyBorder:tabIndex==2}">分类</view>
        </view>
      </view>
    </view>
    <!-- <swiper class="banner" :circular="true" :autoplay="true" :indicator-dots="true" :interval="3000" v-if="tabIndex==0">
       <swiper-item class="banner-img" >
        <image :src="storeDetails.storeBanner" mode=""></image>
             </swiper-item>
    </swiper> -->
    <!-- 点击商品 -->
    <view class="goods-tab-classify" v-if="tabIndex==1">
      <view class="tab-classify-content" :class="{current: filterIndex === 0}" @click="changeList(0)"><text>好评</text></view>
      <view class="tab-classify-content" :class="{current: filterIndex === 1}" @click="changeList(1)"><text>销量</text></view>
      <view class="tab-classify-content" :class="{current: filterIndex === 2}" @click="changeList(2)"><text>新品</text></view>
      <view class="tab-classify-content" :class="{current: filterIndex === 3}" @click="changeList(3)">
        <text>价格</text>
        <view class="p-box" >
          <text :class="{active: priceOrder === 1 && filterIndex === 3}" class="yticon icon-shang" ></text>
          <text :class="{active: priceOrder === 2 && filterIndex === 3}" class="yticon icon-shang xia"></text>
        </view>
      </view>
    </view>
    <!-- 点击分类 -->
    <view class="classify-list-box" v-if="tabIndex==2">
      <!-- <view class="classify-both">
        全部商品
        <text class="yticon icon-you iconRight"></text>
      </view> -->
      <view class="classify-more">
        <view class="classify-list-details" v-for="(val,index) in storeDetails.storeClassList" :key='index' @click="navToGoodsList(val.storeId,val.id)" v-if="index!=0">
          <text>{{val.className}}</text>
          <text class="yticon icon-you iconRight"></text>
        </view>
      </view>
    </view>
    <view  class="goods-list" v-if="tabIndex!=2">
      <view
          class="goods-item"
          @click="navToDetailPage(val.id)"
          v-for="(val,index) in goodsList"
          :key='index'
      >
        <view  >
          <view class="image-wrapper">
            <image :src="val.mainPicture" mode=""></image>
          </view>
          <view class="list-right">
            <view class="title1">{{val.name}}</view>
            <!-- 商品描述 -->
            <view class="describe">
              {{val.keyword}}
            </view>
            <view class="price-box">
              <text class="price">{{val.sellingPrice}}</text>
              <text class="oldPrice">{{val.marketPrice}}</text>
            </view>
            <view class="goodsClassify">
              <text class="classifyList1" v-if="val.ownStoreTag=='自营'">{{val.ownStoreTag}}</text>
              <!-- <text class="classifyList2">特价</text> -->
              <text class="evaluation">{{val.favorableRate}}%好评</text>
            </view>
          </view>
        </view>
      </view>

    </view>
    <!-- <uni-load-more :status="loadingType"></uni-load-more> -->
  </view>
</template>

<script>
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  export default {
    components: {
      uniLoadMore
    },
    data() {
      return {
        url:this.$constant.API_HOME,
        headerPosition:"fixed",
        headerTop:"0px",
        loadingType: 'more', //加载更多状态
        filterIndex: 0,
        priceOrder: 0, //1 价格从低到高 2价格从高到低
        tabIndex:0,//首页 商品 分类
        isShow:true,//是否收藏
        cateId:'',//店铺Id
        storeDetails:{},//店铺信息
        goodsList:[],//商品列表
        page:[1,1,1,1],//下拉加载页数
        token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:'',
        type:1,
      };
    },

    onLoad(options){
      if(options.type==2){
        this.token=options.token;
        this.type=2;
      }
      // #ifdef H5
      this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
      // #endif
      this.cateId = this.$constant.STORE_ID;
      // this.cateId = '';
      this.$api.httpRequest(
        'GET',
        this.url+'/store/store/'+this.cateId,
        {token:this.token?this.token:''},
      ).then((data) => {
        // console.log(data);
        this.storeDetails=data;
        if(data.isCollect==0){
          this.isShow=false;
        }else{
          this.isShow=true;
        }
        console.log(this.storeDetails);
      });
      this.getGoodsList();
    },
    onPageScroll(e){
      //兼容iOS端下拉时顶部漂移
      if(e.scrollTop>=0){
        this.headerPosition = "fixed";
      }else{
        this.headerPosition = "absolute";
      }
    },
    //下拉刷新
    onPullDownRefresh(){
      this.page=[1,1,1,1];
      this.getData(this.filterIndex,'refresh');
    },
    //加载更多
    onReachBottom(){
      // this.loadData();
      if(this.loadingType === 'nomore'){
        return;
      }
      this.page[this.filterIndex]++;
      this.getData(this.filterIndex,'isadd');
    },
    methods: {
      // 获取店铺首页商品列表
      getGoodsList(){
        this.$api.httpRequest(
          'GET',
          this.url+'goods/goodsspu/page_by_condition',
          {storeId:this.cateId},
        ).then((data) => {
          this.goodsList=data.list;
          console.log(this.goodsList);
        })
      },
      // 获取商品列表
      getData(index,type='click'){
        let data;
        if(index==0){
          this.orderField='favorable_rate';
          data={"page":this.page[0],"limit":10,orderField:this.orderField,storeId:this.cateId}
        }else if(index==1){
          this.orderField='sales_val';
          data={"page":this.page[1],"limit":10,orderField:this.orderField,storeId:this.cateId}
        }else if(index==2){
          this.orderField='is_new';
          data={"page":this.page[2],"limit":10,orderField:this.orderField,storeId:this.cateId}
        }else if(index==3){
          this.orderField='selling_price';
          data={"page":this.page[3],"limit":10,orderField:this.orderField,order:this.order,storeId:this.cateId};
        }
        this.$api.httpRequest(
          'GET',
          this.url+'goods/goodsspu/page_by_condition',
          data,
        ).then((data) => {
          // uni.startPullDownRefresh();
          if(type=='click'){
            this.goodsList=data.list;
          }else if(type=='isadd'){
            this.goodsList.concat(data.list);
            console.log(data.list);
          }else if(type=='refresh'){
            this.goodsList=data.list;
            uni.stopPullDownRefresh();
          }

          data.list.length < 10 ? this.loadingType  ='nomore' : this.loadingType = 'more';

        })

      },
      // 切换商品列表
      changeList(index){
        if(this.filterIndex === index && index !== 3){
          return;
        }
        this.filterIndex = index;
        if(index === 3){
          this.order = this.order === 'asc' ? 'desc': 'asc';
          this.priceOrder=this.priceOrder===1?2:1;
        }
        this.getData(index,'click');
        uni.pageScrollTo({
          duration: 300,
          scrollTop: 0
        })


      },
      // 点击分类 跳转列表
      navToGoodsList(storeId,storeCateId){
        uni.navigateTo({
          url:'/pages/product/list?type='+this.type+'&storeId='+storeId+'&storeCateId='+storeCateId
        })
      },
      goStoreDetails(){
        uni.navigateTo({
          url:'../store/storeDetails?storeId='+this.cateId
        })
      },
      goSearch(){
        uni.navigateTo({
          url:'../store/storeSearch?storeId='+this.cateId
        })
      },
      //详情
      navToDetailPage(goodsId){
        //测试数据没有写id，用title代替
        let id = goodsId;
        uni.navigateTo({
          url: `/pages/product/product?id=${id}`
        })
        if(this.type==1){
          uni.navigateTo({
            url: '/pages/product/product?id='+id+'&type='+this.type
          })
        }else{
          uni.navigateTo({
            url: '/pages/product/product?id='+id+'&type=2&token='+this.token,
          })
        }
      },
      stopPrevent(){},
      isCollection(){
        // console.log("1")
        // 是否收藏
        if(this.token==''){
          this.$api.msg('未登录');
          return false;
        }
        this.isShow=!this.isShow;
        this.$api.httpRequest(
          'POST',
          this.$constant.API_HOME+'store/storecollect',
          {storeId:this.cateId},
          {token:this.token}
        ).then((data) => {

        })
      },
    },
  }
</script>

<style lang="scss">
  page, .content{
    background: $page-color-base;
  }
  .mark{
    position: absolute;
    top: 0;
    left: 0;
    // background: linear-gradient(top,#000000,#D8D8D8);
    z-index:1;
    width: 100%;
    height: 240upx;
    image{
      width: 100%;
      height: 240upx;
    }
  }
  // 顶部
  .title-box{
    position: relative;
    z-index: 12;
    height: 240upx;
    background: linear-gradient(top,rgba(0,0,0,0.8),rgba(0,0,0,0.2));
    padding: 34upx 30upx;
    .store-details{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .store-left{
      width: 88upx;
      height: 88upx;
      image{
        width: 100%;
        height: 100%;
      }
    }
    .store-center{
      width: 440upx;
      color:#FFFFFF;
      font-size: 32upx;
      .center-top{
        overflow: hidden;
        white-space: nowrap;
        text-overflow:ellipsis;
        .iconRight{
          margin-left: 5upx;
          font-size: 28upx;
        }
      }
      .center-bottom{
        background: #F05161;
        width: 90upx;
        height: 32upx;
        text-align: center;
        line-height: 32upx;
        font-size: 20upx;
        color: #FFFFFF;
        border-radius: 5upx;
        margin-top: 10upx;
      }
    }
    .store-right{
      font-size: 20upx;
      text-align: center;
      .right-top{
        width: 120upx;
        height: 48upx;
        line-height: 48upx;
        border-radius: 24upx;
        background: #EEEEEE;
        color: #333333;
      }
      .right-top2{
        background: #F05161;
        color: #FFFFFF;
      }
      .right-bottom{
        color: #FFFFFF;
        margin-top: 10upx;
      }
    }
    .title-tab{
      display: flex;
      align-items: center;
      margin-top: 26upx;
      .tab-input{
        width: 144upx;
        height: 60upx;
        border-radius: 30upx;
        background: #FFFFFF;
        text-align: center;
        display: flex;
        align-items: center;
        color: #8E8E93;
        font-size: 24upx;
        image{
          width: 28upx;
          height: 28upx;
          margin:0 12upx 0 22upx;
        }
      }
      .tab-box{
        display: flex;
        color: #FFFFFF;
        font-size: 32upx;
        .tab-classify{
          margin-left: 66upx;
          padding-bottom: 8upx;
        }
        .tabClassifyBorder{
          border-bottom: 4upx solid #FFFFFF;
        }
      }
    }
  }
  // 轮播图
  .banner{
    height:322upx;
    .banner-img{
      width: 750upx;
      height: 100%;
      image{
        width: 100%;
        height: 100%;
      }
    }
  }
  // 商品分类tab
  .goods-tab-classify{
    display: flex;
    justify-content: space-around;
    font-size: 28upx;
    color: #333333;
    background: #FFFFFF;
    .current{
      color: #F05161;
    }
    .tab-classify-content{
      display: flex;
      align-items: center;
      margin: 24upx 0;
      .p-box{
        display: flex;
        flex-direction: column;
        .yticon{
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30upx;
          height: 14upx;
          line-height: 1;
          margin-left: 4upx;
          font-size: 26upx;
          color: #888;
          &.active{
            color: #F05161;
          }
        }
        .xia{
          transform: scaleY(-1);
        }
      }
    }
  }
  /* 商品列表 */
  .goods-list{
    display:flex;
    flex-wrap:wrap;
    padding: 0 20upx;
    .goods-item{
      margin: 10upx 0;
      background: #fff;
      display:flex;
      flex-direction: column;
      width: 348upx;
      border-radius: 15upx;
      &:nth-child(2n+1){
        margin-right: 14upx;
      }
    }
    .image-wrapper{
      width: 100%;
      height: 348upx;
      border-radius: 3px;
      overflow: hidden;
      image{
        width: 100%;
        height: 100%;
        opacity: 1;
      }
    }
    .title1{
      font-size: 28upx;
      color: #333333;
      padding:0 10upx;
      margin: 10upx 0;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    .price-box{
      padding-right: 10upx;
      font-size: 24upx;
      color: $font-color-light;
      padding:0 10upx;
      margin: 10upx 0;
    }
    .price{
      font-size: $font-lg;
      color: $uni-color-primary;
      line-height: 1;
      &:before{
        content: '￥';
        font-size: 26upx;
      }
    }
    .describe{
      color: #999999;
      font-size: 24upx;
      margin-bottom: 10upx;
      padding:0 10upx;
      height: 24upx;
    }
    .goodsClassify{
      font-size: 20upx;
      margin: 13upx 0 20upx 0;
      padding:0 10upx;
      .classifyList1{
        color: #F05161;
        border: 1px solid #F05161;
        display: inline-block;
        width: 80upx;
        margin-right: 10upx;
        text-align: center;
      }
      .classifyList2{
        color: white;
        background-color: #F05161;
        border: 1px solid #F05161;
        display: inline-block;
        width: 80upx;
        text-align: center;
        margin-right: 10upx;
      }
      .evaluation{
        color: #999999;
      }
    }
  }


  .oldPrice{
    color: #999999;
    font-size: 24upx;
    padding-left: 20upx;
    text-decoration: line-through;
    &:before{
      content: '￥';
      font-size: 24upx;
    }
  }
  .screen-box{
    position: relative;
    background-color: white;
    font-size: 28upx;
    margin-bottom: 20upx;
    .screen{
      display: inline-block;
      width: 156upx;
      height: 64upx;
      line-height: 64upx;
      text-align: center;
      background-color: #F8F8F8;
      margin: 10upx 0 10upx 30upx;
      image{
        width: 10upx;
        height: 10upx;
        margin-left: 5upx;
        margin-bottom: 2upx;
      }
    }
    .screenRed{
      color: #F05161;
    }
  }
  .classify-list-box{
    padding: 20upx;
    .classify-both,.classify-list-details{
      background: #FFFFFF;
      height: 100upx;
      width: 100%;
      line-height: 100upx;
      padding: 0 28upx;
      font-size: 28upx;
      color: #333333;
      border-radius: 10upx;
      .iconRight{
        float: right;
      }
    }
    .classify-more{
      margin-top: 20upx;
      .classify-list-details:last-child{
        border-bottom: 0upx;
      }
      .classify-list-details{
        border-bottom: 1upx solid #E8E8E8;
      }
    }
  }
</style>
