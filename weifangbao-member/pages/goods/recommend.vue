<template>
  <view class="container">
    <!-- 为你推荐 -->
    <view class="recommended">
      <view class="rec-title">
        <image src="../../static/image/recommend.png" mode=""></image>
      </view>
      <view class="rec-goods-list">
        <view class="goods-item" @click="navToDetailPage(val)" v-for="(val,index) in recommendedList" :key='index'>
          <view style="padding-bottom: 10upx;">
            <view class="image-wrapper">
              <image :src="val.mainPicture" mode="aspectFill"></image>
            </view>
            <view class="title1">{{val.name}}</view>
            <!-- 商品描述 -->
            <view class="describe">
              {{val.keyword}}
            </view>
            <view class="price-box">
              <text class="price">{{val.sellingPrice}}</text>
              <text class="oldPrice">￥{{val.marketPrice}}</text>
            </view>
            <view class="goodsClassify">
              <text class="classifyList1" v-if="val.isOwnShopName=='自营'">{{val.isOwnShopName}}</text>
              <!-- <text class="classifyList2">特价</text> -->
              <text class="evaluation">{{val.favorableRate}}好评</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import {mapState} from 'vuex';
  import uniNumberBox from '@/components/uni-number-box.vue'

  export default {
    components: {
      uniNumberBox
    },
    data() {
      return {
        recommendedList:[],//推荐列表
        // selectStoreId:[],//选中商品对应店铺id
      };
    },
    // onLoad(){
    // 	this.loadData();
    // },
    onShow() {
     this.recommended();
    },
    watch:{

    },
    computed:{
      ...mapState(['hasLogin'])
    },
    methods: {

      // 进入商品详情
      navToDetailPage(item){
        //测试数据没有写id，用title代替
        let id = item.id;
        uni.navigateTo({
          url: `/pages/product/product?id=${id}&type=1`,
        })
      },

      //为你推荐
      recommended(){
        this.$api.httpRequest(
            'GET',
            this.$constant.API_HOME+'index/recommend',
            {page:'1',limit:'10'}
        ).then((data) => {
          console.log(data);
          this.recommendedList=data.list;
        });
      },
    }
  }
</script>

<style lang='scss'>
  .container{
    padding-top: 0upx;
    padding-bottom: 135upx;
    background: #F0F1F5;
    /* 空白页 */
    .empty{
      width: 100%;
      padding-bottom:20upx;
      display:flex;
      justify-content: center;
      flex-direction: column;
      align-items:center;
      /* background: #fff; */
      image{
        width: 240upx;
        height: 160upx;
        margin-bottom:30upx;
      }
      .empty-tips{
        text-align: center;
        font-size: $font-sm+2upx;
        color: $font-color-disabled;
        .navigator{
          color: $uni-color-primary;
          margin-left: 16upx;
          width: 244upx;
          height: 72upx;
          line-height: 72upx;
          border: 1upx solid #F05161;
          color: #F05161;
          border-radius: 36upx;
          margin-top: 40upx;

        }
        .btnBox{
          display: flex;


          .navigator1{
            border: 1upx solid #999999;
            color: #999999;
          }
        }

      }
    }
  }
  /* 购物车列表项 */
  .edit{
    display: fixed;
    top: 0;
    width: 100%;
    height: 216upx;
    background: #F05161;
    font-size: 28upx;
    color: #FFFFFF;
    text-align: right;
    box-sizing: border-box;
    padding:25upx 20upx;
  }
  .storeList{
    margin:-128upx 20upx 140upx 20upx;
    background: #fff;
    border-radius: 10upx;
  }
  .storeList:last-child{
    margin-bottom: 0;
  }
  .storeDetails{

    padding:  20upx;
    border-bottom: 1upx solid #E8E8E8;
    display: flex;
    align-items: center;
    .storeBtn{
      margin-right: 10upx;
      image{
        width: 32upx;
        height: 32upx;
        border-radius: 50%;
      }
    }
    .storeImg{
      image{
        width: 32upx;
        height: 32upx;
      }
      margin-right: 10upx;
    }
    .storeName{
      color: #333333;
      font-size: 28upx;
    }
  }
  .cart-item:last-child{
    border-bottom:0upx;
  }
  .cart-item{
    display:flex;
    align-items: center;
    position:relative;
    padding:30upx 20upx;
    border-bottom: 2upx solid #E8E8E8;

    .item-img{
      width: 32upx;
      height: 32upx;
      margin-right:10upx;
      image{
        width: 100%;
        height: 100%
      }
    }
    .image-box{
      width: 180upx;
      height: 180upx;
      flex-shrink: 0;
      position:relative;
      image{
        border-radius:8upx;
        width: 100%;
        height: 100%;
      }
    }
    .checkbox{
      position:absolute;
      left:-16upx;
      top: -16upx;
      z-index: 8;
      font-size: 44upx;
      line-height: 1;
      padding: 4upx;
      color: $font-color-disabled;
      background:#fff;
      border-radius: 50px;
    }
    .item-right{
      display:flex;
      flex-direction: column;
      flex: 1;
			justify-content: space-between;
      overflow: hidden;
      position:relative;
      padding-left: 20upx;
      width: 400upx;
      .item-name{
        overflow: hidden;
				text-overflow:ellipsis;
				white-space: nowrap;
        font-size: 28upx;
      }
      .attr{
        font-size: 20upx;
        color: #999999;
        height: 80upx;
        line-height: 80upx;
      }
      .item-bottom{
        display: flex;
        justify-content: space-between;
        .price{
          color: #E64241;
          font-size: 32upx;
        }
      }
      .addBox{
        display: flex;
        align-items: center;
        input{
          width: 80upx;
          display: inline-block;
          text-align: center;
          font-size: 24upx;
        }
        .numBtn{
          width: 48upx;
          height: 48upx;
          line-height:44upx;
          text-align: center;
          font-size: 44upx;
          border-radius: 0;
          display: inline-block;
          background: #fff;
          border: 2upx solid #E8E8E8;
          color: #333;
        }
      }
    }
    .del-btn{
      padding:4upx 10upx;
      font-size:34upx;
      height: 50upx;
      color: $font-color-light;
    }
  }
  /* 为你推荐 */
  .recommended{
    .rec-title{
      image{
        width: 100%;
        height: 100upx;
      }
    }
    .rec-goods-list{
      display:flex;
      flex-wrap:wrap;
      padding: 0 30upx;
      .goods-item{
        margin: 10upx 0;
        background: #fff;
        display:flex;
        flex-direction: column;
        width: 48%;
        border-radius: 15upx;
        &:nth-child(2n+1){
          margin-right: 4%;
        }
      }
      .image-wrapper{
        width: 100%;
        height: 330upx;
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
        // line-height: 60upx;
        padding:0 10upx;
        margin: 10upx 0;
        overflow: hidden;
        // height: 80upx;
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
        margin-right: 10upx;
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

  }
  /* 底部栏 */
  .action-section{
    /* #ifdef H5 */
    margin-bottom:100upx;
    /* #endif */
    position:fixed;
    left: 30upx;
    bottom:30upx;
    z-index: 95;
    display: flex;
    align-items: center;
    width: 690upx;
    height: 100upx;
    padding: 0 30upx;
    background: rgba(255,255,255,.9);
    box-shadow: 0 0 20upx 0 rgba(0,0,0,.5);
    border-radius: 16upx;
    .checkbox{
      height:36upx;
      display: flex;
      align-items: center;
      image{
        width: 36upx;
        height: 100%;
        z-index: 5;
      }
    }
    .clear-btn{
      height: 52upx;
      line-height: 52upx;
      padding-left: 20upx;
      font-size: $font-base;
      color: #333;
    }
    .total-box{
      display:flex;
      align-items: center;
      text-align:right;
      margin-left: 30upx;
      font-size: 28upx;
      /* padding-right: 40upx; */
      width: 300upx;
      .price{
        font-size: 32upx;
        color: $font-color-dark;
      }
      .coupon{
        font-size: $font-sm;
        color: $font-color-light;
        text{
          color: $font-color-dark;
        }
      }
    }
    .confirm-btn{
      padding: 0 38upx;
      margin-left: 20upx;
      border-radius: 100px;
      height: 76upx;
      line-height: 76upx;
      font-size: $font-base + 2upx;
      background: $uni-color-primary;
      box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
    }
  }
  /* 复选框选中状态 */
  .action-section .checkbox.checked,
  .cart-item .checkbox.checked{
    color: $uni-color-primary;
  }
</style>
