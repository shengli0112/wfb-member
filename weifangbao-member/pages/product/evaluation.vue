<template>
  <view class="container">
    <view class="eva-classify">
      <view class="classify" :class="{isSelect:selectIndex==0}" @click="selectIndex=0,type='all',getEvaList()">全部评价({{evaNum.allCount}})</view>
      <view class="classify" :class="{isSelect:selectIndex==1}" @click="selectIndex=1,type='good',getEvaList()">好评({{evaNum.goodCount}})</view>
      <view class="classify" :class="{isSelect:selectIndex==2}" @click="selectIndex=2,type='mid',getEvaList()">中评({{evaNum.midCount}})</view>
      <view class="classify" :class="{isSelect:selectIndex==3}" @click="selectIndex=3,type='bad',getEvaList()">差评({{evaNum.badCount}})</view>
    </view>
    <view class="eva-con">
      <view class="eva-box" v-for="(val,index) in evaList" :key='index' @click="evaDetails(val)">
        <view class="eva-first">
          <image class="portrait" :src="val.avatar" mode="aspectFill"></image>
          <view class="eva-star">
          	<view class="eva-title">
          		<text class="name">{{val.nickname}}</text>
          	</view>
          	<view class="starImg" >
          		<image :src="index1<val.star?img1:img2" mode="" v-for="(val1,index1) in starImg" :key='index1'></image>
          	</view>
          </view>

        </view>

        <view class="evaluation">
          <text class="con">{{val.content}}</text>
          <view class="right-img">
            <image :src="val.picture1" mode="" v-if="val.picture1"></image>
            <image :src="val.picture2" mode="" v-if="val.picture2"></image>
            <image :src="val.picture3" mode="" v-if="val.picture3"></image>
            <image :src="val.picture4" mode="" v-if="val.picture4"></image>
          </view>
          <view class="bot">
            <text class="attr"></text>
            <text class="time">{{val.createDate}}</text>
          </view>
        </view>
        <view class="replyEva" v-if="val.listComments.length!=0">
          <text class="replyName">{{val.listComments[0].fromNickname}}</text>
          <text>{{val.listComments[0].content}}</text>
          <view class="replyTime">{{val.listComments[0].createDate}}</view>
        </view>
      </view>

    </view>
    <uni-load-more :status="loadingType"></uni-load-more>
  </view>
</template>

<script>
  import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
  export default {
    components: {
      uniLoadMore,
    },
    data() {
      return {
        evaList:[],
        evaPage:1,
        id:'',
        evaNum:{},
        selectIndex:0,
        type:'all',
        loadingType: 'more', //加载更多状态
				img1:'../../static/image/star2.png',
				img2:'../../static/image/Shape.png',
				starImg:[0,0,0,0,0],
      };
    },
    async onLoad(options) {
      this.id=options.id;
      this.getEvaList();
      this.getEvaNum();
    },
    //加载更多
    onReachBottom(){
      if(this.loadingType === 'nomore'){
        return;
      }
      this.evaPage++;
      this.getEvaList();
    },
    methods: {
      getEvaList(){
        this.evaList=[];
        let data;
        if(this.type=='all'){
          data={module:'商品评价',obj_id:this.id,page:this.evaPage,limit:10}
        }else{
          data={module:'商品评价',obj_id:this.id,page:this.evaPage,limit:10,starStage:this.type}
        }
        this.$api.httpRequest(
            'GET',
            this.$constant.API_XOPEN_HOME + '/comment/topic/page',
            data,
            {key:'ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ'}
        ).then((data) => {
          console.log(data);
          this.evaPage==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
					data.total==0?this.loadingType='nomore':'';
          if(data){
						if(this.evaPage==1){
							this.evaList=data.list;
						}else{
							for(var i=0;i<data.list.length;i++){
								this.evaList.push(data.list[i])
							}
						}
            
          }
        })
      },
      getEvaNum(){
        let data;
        this.$api.httpRequest(
            'GET',
            this.$constant.API_XOPEN_HOME + '/comment/topic/topicCount',
            {module:'商品评价',objId:this.id},
            {key:'ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ'}
        ).then((data) => {
          console.log(data);
          this.evaNum=data;
        })
      },
			// 评价详情
			evaDetails(val){
				console.log(val)
				uni.navigateTo({
					url:'/pages/product/evaDetails?evaList='+JSON.stringify(val)
				})
			}
    },

  }
</script>

<style lang='scss'>
  page,
  .container{
    background: $page-color-base;
    height: 100%;
		width: 100%;
		overflow-x: hidden;
  }
  .eva-classify {
    background-color: white;
    padding: 30upx;
    padding-bottom: 0;
    display: flex;
    flex-wrap:wrap;
    .classify {
      padding: 0 30upx;
      height: 64upx;
      line-height: 64upx;
      border-radius: 32upx;
      background-color: #F0F1F5;
      color: #333333;
      font-size: 24upx;
      margin-right: 20upx;
      margin-bottom: 20upx;
    }
    .isSelect{
      background-color: #F05161;
      color: #fff;
    }
  }

  .eva-box {
    background-color: white;
    padding: 10upx 30upx;
    margin-bottom:10upx;
    .eva-first {
      display: flex;
      align-items: center;
      padding-top: 10upx;
			.eva-star{
				display: flex;
				flex-direction: column;
				/* align-items: center; */
				.starImg{
					margin-left: 20upx;
					image{
						width: 32upx;
						height: 32upx;
					}
				}
				.eva-title{
					display: flex;
					justify-content: space-between;
					width: 620upx;
				}
				.time{
					color: #999999;
					/* float: right; */
					/* margin-top: 10upx; */
				}
			}
      image {
        width: 60upx;
        height: 60upx;
        border-radius: 50%;
      }

      text {
        font-size: 28upx;
        margin-left: 20upx;
      }
    }
    .line{
      width: 100%;
      background-color: gainsboro;
      height: 1upx;
      margin-bottom: 10upx;
    }
    .portrait {
      flex-shrink: 0;
      width: 80upx;
      height: 80upx;
      border-radius: 100px;
    }

  }

  .bot {
    display: flex;
    justify-content: space-between;
    font-size: $font-sm;
    color: #999999;
    margin-top: 20upx;
  }
  .eva-con{
    margin-top: 20upx;
  }
  .evaluation {
    font-size: 28upx;
    .con{
      display: block;
      margin-top: 20upx;
    }
    .right-img {
      width: 756upx;
      margin: 20upx 0;
      image {
        width: 160upx;
        height: 160upx;
        margin-right: 16upx;
      }

    }
  }
  .replyEva{
    border-top: 1upx solid #F0F1F5;
    margin-top: 20upx;
    padding-top: 20upx;
    font-size: 24upx;
    .replyName{
      color: #F05161;
    }
    .replyTime{
      text-align: right;
      color: #999999;
    }
  }
</style>
