<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots circular=true duration="400">
        <swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
          <view class="image-wrapper">
            <image
                :src="item"
                class="loaded"
                mode="aspectFill"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <view class="skill" v-if="skusDetails.promType==1">
      <view class="skillPrice">￥{{skusDetails.sellingPrice}}
        <text class="oldPrice">￥{{skusDetails.marketPrice}}</text>
      </view>
      <view class="skillTime">
        <view class="time">
          距离结束
          <text>{{hour}}</text>
          <text>{{minutes}}</text>
          <text>{{seconds}}</text>
        </view>
        <view class="goodsNum">仅剩{{skusDetails.stock}}件</view>
      </view>
    </view>
    <view class="group" v-if="skusDetails.promType==2">
      <view class="groupPrice">
        <text>￥{{skusDetails.sellingPrice}}</text>
        <text class="ownGroup">单买价：￥{{skusDetails.marketPrice}}</text>
      </view>
      <view class="groupNum">
        <view class="numImg">
          <image src="../../static/image/user2x.png" mode=""></image>
        </view>
        {{skusDetails.groupBuying.groupPersonNum}}人团
      </view>
    </view>
    <view class="introduce-section">

      <view class="titleBox">
        <view class="titleBoxLeft">
          {{goodsDetail.name}}
        </view>
        <!-- 	<view class="titleBoxRight"  @click="share">
            <image src="../../static/image/购物车@2x.png" mode=""></image>
            <text>分享</text>
          </view> -->
      </view>

      <view class="goodsKeywrod">{{goodsDetail.keyword}}</view>
      <view class="price-box" v-if="skusDetails.promType==0">
        <text class="price" v-if="goodsDetail.goodsType==1">¥{{skusDetails.sellingPrice}}</text>
        <text class="price" v-if="goodsDetail.goodsType==2">{{skusDetails.sellingPrice}}积分</text>
      </view>
      <!-- <view class="type-lable" v-if="goodsDetail.ownStoreTag=='自营'">
        <text class="typeOne">{{goodsDetail.ownStoreTag}}</text>
      </view> -->
      <view class="bot-row">
        <text>月销：{{goodsDetail.monthlySales}}</text>
      </view>
    </view>
    <view class="c-list">
      <view class="c-row b-b" @click="toggleSpec(),alertIndex=0">
        <text class="tit">产品参数</text>
        <!-- <text class="yticon icon-you iconRight"></text> -->
        <image src="../../static/image/jiantou.png" mode=""></image>
      </view>
      <view class="c-row b-b" @click="toggleSpec(),alertIndex=1,isTabBtn=false,ownBuy=false,Offered=''">
        <text class="tit">已选</text>
        <view class="con">
          <text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
            {{sItem.goodsSpecValue}}
          </text>
          <text v-if="specSelected.length!=0">×{{num}}</text>
        </view>
      </view>
    </view>
    <!-- 累计参团 -->
    <view class="groupBox" v-if="skusDetails.promType==2">
      <view class="groupBoxTitle">
        <view>累计参团（1234）</view>
        <view class="groupPlay">拼团玩法
          <image src="../../static/image/jiantou.png" mode=""></image>
        </view>
      </view>
      <scroll-view class="groupScoll" style="max-height: 200upx;" scroll-y>
        <view class="groupBoxContent" v-for="(item,index) in skusDetails.groupBuying.groupOrderList" :key='index'>
          <view class="imgBox">
            <view class="userImg" v-for="(item1,index1) in item.memberList" :key='index1' v-if="index1<5">
              <image :src="item1.userAvatar" mode=""></image>
            </view>
            <view class="userImg" v-for="(item2,index2) in groupNum" :key='index2'
                  v-if="index2<skusDetails.groupBuying.groupPersonNum && index2+1>item.memberList.length">
              ?
            </view>
          </view>
          <view class="userNum">
            <text>还差{{item.leftPersonNum}}人成团</text>
            <text class="groupTime">剩余{{countDonwnArr[index]}}</text>
          </view>
          <!-- <view class="groupBtn" @click="navToGroup(item.id)">去参团</view> -->
          <!--  @click="toggleSpec(),alertIndex=1,isTabBtn=false,ownBuy=false" -->
          <view class="groupBtn" @click="toggleSpec(),alertIndex=1,isTabBtn=false,ownBuy=false,Offered=item.id,isTabBtnType=5">去参团</view>
        </view>
      </scroll-view>


    </view>
    <view class="detail-desc">
      <view class="d-header">
        <text>图文详情</text>
      </view>
      <!-- <rich-text :nodes="desc"></rich-text> -->
      <view class="richBox">
        <view v-for="(val,index) in richDetail" :key="index">
          <image v-if="val.type=='img'" class="richImg" :src="val.url" mode="widthFix"></image>
          <view v-if="val.type=='text'" class="richText">{{val.text}}</view>
        </view>

      </view>
    </view>

    <!-- 底部操作菜单 -->
    <view class="page-bottom" v-if="goodsDetail.goodsType==1">
      <view class="p-b-btn" >
        <image src="../../static/img/kefu.png" mode="" class="tabImg"></image>
        <text>联系客服</text>
      </view>
      <view class="p-b-btn" @click="goCart()">
        <image src="../../static/image/gwc.png" mode="" class="tabImg"></image>
        <text>购物车</text>
      </view>
      <view class="action-btn-group" v-if="skusDetails.promType!=2">
        <button type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(),isTabBtn=true,alertIndex=1,isTabBtnType=2">立即购买</button>
        <button type="primary" class=" action-btn no-border add-cart-btn" @click="toggleSpec(),isTabBtn=true,alertIndex=1,isTabBtnType=1">加入购物车</button>
      </view>
      <view class="action-btn-group" v-if="skusDetails.promType==2">
        <view type="primary" class=" action-btn no-border buy-now-btn groupBtn1" @click="toggleSpec(),isTabBtn=true,alertIndex=1,isTabBtnType=3,ownBuy=true">
          <text>￥{{skusDetails.marketPrice}}</text>
          <text>单独购买</text>
        </view>
        <view type="primary" class=" action-btn no-border add-cart-btn groupBtn1" @click="toggleSpec(),isTabBtn=true,alertIndex=1,isTabBtnType=4,ownBuy=false">
          <text>￥{{skusDetails.sellingPrice}}</text>
          <text>我要开团</text>
        </view>
      </view>
    </view>
				<view class="page-bottom" v-if="goodsDetail.goodsType==2">
				  <view class="p-b-btn1" >
				    <image src="../../static/img/kefu.png" mode="" class="tabImg"></image>
				    <text>联系客服</text>
				  </view>
				  <view class="action-btn-group1" v-if="skusDetails.promType!=2">
				    <button type="primary" class=" action-btn no-border buy-now-btn" @click="toggleSpec(),isTabBtn=true,alertIndex=1,isTabBtnType=2">立即购买</button>
				  </view>
				</view>

    <!-- 规格-模态层弹窗 -->
    <view
        class="popup spec"
        :class="specClass"
        @touchmove.stop.prevent="stopPrevent"
        @click="toggleSpec"
    >
      <!-- 遮罩层 -->
      <view class="mask"></view>
      <view class="layer attr-content" @click.stop="stopPrevent" v-if="alertIndex==0">
        <view class="attr-title">产品参数</view>
        <view style="min-height: 350upx; max-height: 500upx; overflow-y: scroll;" class="scoll">
          <view class="parameter" v-for="(val,index) in goodsDetail.attrs" :key='index'>
            <view class="par-left">{{val.attrName}}</view>
            <view class="par-right">{{val.attrValue}}</view>
          </view>
        </view>

        <view class="par-btn" @click="toggleSpec()">完成</view>
      </view>
      <!-- <scroll-view  scroll-y="true"> -->
      <scroll-view scroll-y="true" class="layer attr-content" @click.stop="stopPrevent" v-if="alertIndex==1">
        <view class="a-t">
          <!-- 此处图片为选中产品型号所对应的图片 -->
          <image :src="imgList[0]"></image>
          <view class="right">
            <text class="price">
              <text v-if="skusDetails.promType==2">拼团价</text>
              ¥{{skusDetails.sellingPrice}}
            </text>
            <text class="price1" v-if="skusDetails.promType==2">单独购买¥{{skusDetails.marketPrice}}</text>
            <text class="stock">库存：{{skusDetails.stock}}件</text>
            <view class="selected" v-if="goodsDetail.spuSpecType!=1 && goodsDetail.spuSpecType!=null">
              已选：
              <text class="selected-text" v-for="(sItem, sIndex) in specSelected" :key="sIndex">
                {{sItem.goodsSpecValue}}
              </text>

            </view>
          </view>
        </view>

        <view style="min-height: 150upx;">
          <view v-for="(item,index) in goodsDetail.specs" :key="index" class="attr-list">
            <text>{{item.specName}}</text>
            <view class="item-list">
              <text
                  v-for="(childItem, childIndex) in item.specValueList"
                  :key="childIndex" class="tit"
                  :class="{selected: isSelectArr[index][childIndex]}"
                  @click="selectSpec(childItem,index,childIndex)"
              >
                {{childItem.goodsSpecValue}}
              </text>
            </view>
          </view>
        </view>


        <view class="addNum">
          <text>数量</text>
          <view class="addBox">
            <view class="numBtn" @click="changeNum('reduce')">-</view>
            <!-- <input type="number" :value="num" v-model="num" @blur='inputChange'/> -->
            <view class="numText">{{num}}</view>
            <view class="numBtn" @click="changeNum('add')">+</view>
          </view>
        </view>
        <!-- 加入购物车 -->
        <button class="btn" @click="toggleSpec(),joinCar()" v-if="isTabBtn==true && isTabBtnType==1">确认</button>
        <!-- 立即购买 -->
        <button class="btn" @click="toggleSpec(),buyNow()" v-if="isTabBtn==true && isTabBtnType==2">确认</button>
        <!-- 单独购买 -->
        <button class="btn" @click="toggleSpec(),buyNow()" v-if="isTabBtn==true && isTabBtnType==3 && ownBuy==true">确认</button>
        <!-- 开团 -->
        <button class="btn" @click="toggleSpec(),buyNow(true)" v-if="isTabBtn==true && isTabBtnType==4">确认开团</button>
        <view class="addBtnBox" v-if="isTabBtn==false && skusDetails.promType!=2">
          <view class="btnAdd" @click="joinCar(),toggleSpec()" v-if="goodsDetail.goodsType==1">加入购物车</view>
          <view class="btnBuy" @click="toggleSpec(),buyNow()" v-if="goodsDetail.goodsType==1">立即购买</view>
										<view class="btnBuy1" @click="toggleSpec(),buyNow()" v-if="goodsDetail.goodsType==2">立即购买</view>
        </view>
        <view class="addBtnBox" v-if="isTabBtn==false && skusDetails.promType==2  && Offered==''">
          <view class="btnAdd" @click="toggleSpec(),buyNow()">单独购买</view>
          <view class="btnBuy" @click="toggleSpec(),buyNow(true)">开团</view>
        </view>
        <!-- 去参团 -->
        <!-- Offered -->
        <button class="btn" @click="toggleSpec(),navToGroup(Offered)" v-if="isTabBtn==false && skusDetails.promType==2 && Offered!='' ">确认参团</button>
      </scroll-view>
    </view>
    <!-- 分享 -->
   <!-- <share
        ref="share"
        :contentHeight="580"
        :shareList="shareList"
    ></share> -->
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

    data(){
      return {
							 isShow: false,
        ownBuy: false,
        seckillTime: 0,
        hour: 0,
        minutes: 0,
        seconds: 0,
        promId: 0,//促销类型 0：无促销 1：秒杀
        img1: '../../static/image/star2.png',
        img2: '../../static/image/Shape.png',
        starImg: [0, 0, 0, 0, 0],
        type: 1,//判断跳转页面 1h5 2安卓
        url: this.$constant.API_HOME,
        specClass: 'none',
        specSelected: [],
        favorite: false,
        shareList: [],
        imgList: [],
        goodsDetail: '',
        goodsId: '',
        // goodsPrice:'',//商品价格
        evaList: '',//商品评价
        richDetail: [],//图文详情
        guarantees: [],//商品服务保障
        alertIndex: -1,
        isSelectIndex: 0,
        islayerIndex: 0,
        selectImg: '',//商品规格图片
        skusDetails: {},//规格对应参数
        isSelectArr: [],//二维数组 是否选中
        goodsSpecValueIds: '',
        num: 1,//添加数量
        isTabBtn: '',//判断点击是'已选'还是'加入购物车'
        isTabBtnType: '',//判断是点击的1加入购物车 2立即购买 3单独购买 4我要开团
        token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
        sku: '',//skuid
        killData: '',//秒杀价格等信息
        groupDetail: {},//团购信息
        groupList: [],//拼团列表
        groupPromId: [],//拼团sku列表 用来记录不同规格的团购商品是否已绑定定时器
        groupNum: [0, 0, 0, 0, 0],//参团人数
        Offered: '',//去参团id
        isTimer: 0,
        desc: `
					<div style="width:100%">
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i4/479184430/O1CN01nCpuLc1iaz4bcSN17_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd2.alicdn.com/imgextra/i2/479184430/O1CN01gwbN931iaz4TzqzmG_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd3.alicdn.com/imgextra/i3/479184430/O1CN018wVjQh1iaz4aupv1A_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd4.alicdn.com/imgextra/i4/479184430/O1CN01tWg4Us1iaz4auqelt_!!479184430.jpg_400x400.jpg" />
						<img style="width:100%;display:block;" src="https://gd1.alicdn.com/imgextra/i1/479184430/O1CN01Tnm1rU1iaz4aVKcwP_!!479184430.jpg_400x400.jpg" />
					</div>
				`,
        specList: [],
        // specChildList: []
        countDonwnArr: [] //拼团倒计时数组
      };
    },
   
    async onLoad(options){
					// if(!this.$store.state.hasLogin){
					// 	this.isShow=true;
					// }
      // console.log(options.type);
      this.type = options.type;
      if(options.token){
        this.token = options.token;
        // console.log(this.token)
      }
      if(options.sku){
        this.sku = options.sku
      }
      let id       = options.id;
      this.goodsId = options.id;
      this.getEva(id);
      this.getGoodsDetails(id);

    },
    methods: {
					cancle(data) {
						this.isShow = data;
					},
      // 获取商品详情
      getGoodsDetails(id){
        this.$api.httpRequest(
          'GET',
          this.$constant.API_HOME + '/goods/goodsspu/' + id,
         
        ).then((data) => {
          if(data.isCollect == 0){
            this.favorite = false;
          }else{
            this.favorite = true;
          }
          this.imgList = data.picturesArray;
          this.imgList.unshift(data.mainPicture);
          // console.log(this.imgList)
          this.richDetail  = JSON.parse(data.details);
          this.guarantees  = data.goodsServicesArray;
          this.goodsDetail = data;
          for(var a = 0; a < data.skus.length; a++){
            if(data.skus[a].promType == 1){
              this.seckillTime = data.skus[a].countDown;
              this.timer();
              break;
            }
          }
          // 若商品为秒杀商品

          if(this.sku){
            // 是否选中的二维数组
            let dataArr = [];
            for(var i = 0; i < data.specs.length; i++){
              dataArr[i] = [];
              for(var j = 0; j < data.specs[i].specValueList.length; j++){
                dataArr[i][j] = false;
              }
            }
            this.isSelectArr = dataArr;

            // 通过传入skuId判断对应规格值
            for(var i = 0; i < data.skus.length; i++){
              console.log(this.sku)
              console.log(data.skus[i].promId)

              if(this.sku == data.skus[i].promId){
                // this.promId=data.skus[i].promType;
                this.skusDetails = data.skus[i];
                // 将对应拼团列表倒计时放入数组countDownArr中
                if(this.skusDetails.promType == 2){
                  this.groupPromId.push(this.skusDetails.promId)
                  console.log(this.groupPromId)
                  for(var a = 0; a < this.skusDetails.groupBuying.groupOrderList.length; a++){
                    this.countDonwnArr[a] = this.skusDetails.groupBuying.groupOrderList[a].countDown;
                    console.log(this.skusDetails.groupBuying.groupOrderList.length)
                    this.returnCountTimer(this.countDonwnArr[a], a);
                  }
                  console.log(data.skus[i])
                }

                // 通过sku选中相对应规格
                if(data.spuSpecType != 1){
                  let skuIdsArr = data.skus[i].goodsSpecValueIds.split(",");
                  console.log(skuIdsArr)
                  this.goodsSpecValueIds = data.skus[i].goodsSpecValueIds;
                  for(var j = 0; j < skuIdsArr.length; j++){
                    for(var k = 0; k < data.specs.length; k++){
                      // 若skuId与该规格id相同 则选中该规格对应值
                      for(var z = 0; z < data.specs[k].specValueList.length; z++){
                        if(skuIdsArr[j] == data.specs[k].specValueList[z].id){
                          // 将匹配到的规格值存入已选数组中
                          this.specSelected[k] = data.specs[k].specValueList[z];
                          // 将该规格对应规格值选中
                          this.$set(this.isSelectArr[k], z, true)
                        }
                      }

                    }
                  }
                }

                break;
              }
            }

          }else{
            // 若商品为普通商品
            this.skusDetails = data.skus[0];
            // 将每个规格的第一个id存入sku 多规格
            if(data.spuSpecType != 1){
              for(var i = 0; i < data.specs.length; i++){
                if(i == 0){
                  this.goodsSpecValueIds = data.specs[i].specValueList[0].id;
                }else{
                  this.goodsSpecValueIds += ',' + data.specs[i].specValueList[0].id;
                }

              }
              // 存入后比对skus内id对应库存 价格
              for(var i = 0; i < this.goodsDetail.skus.length; i++){
                if(this.goodsDetail.skus[i].goodsSpecValueIds.split(",").sort().join(',') == this.goodsSpecValueIds){
                  this.skusDetails = this.goodsDetail.skus[i];
                  break;
                }
              }
              console.log(this.goodsSpecValueIds);
              // 是否选中的二维数组
              let dataArr = [];
              for(var i = 0; i < data.specs.length; i++){
                dataArr[i]           = [];
                this.specSelected[i] = data.specs[i].specValueList[0];
                for(var j = 0; j < data.specs[i].specValueList.length; j++){
                  if(j == 0){
                    dataArr[i][j] = true;

                  }else{
                    dataArr[i][j] = false;
                  }

                }
              }
              this.isSelectArr = dataArr;
            }
          }

          // this.selectImg=data.specs[0].specValueList[0].icon;
        });
      },
      // 秒杀倒计时
      timer(){
        if(this.isTimer == 1){
          return false;
        }else{
          this.isTimer = 1;
          var _this    = this;
          var seckill  = setInterval(function(){
            _this.seckillTime -= 1000;
            _this.hour    = parseInt(_this.seckillTime / 3600000);
            _this.minutes = parseInt((_this.seckillTime % 3600000) / 60000);
            _this.seconds = parseInt((_this.seckillTime % 60000) / 1000);
          }, 1000)
          if(_this.seckillTime < 0){
            clearInterval(seckill)
          }
        }

      },
      // 团购拼团倒计时
      returnCountTimer(countTime, countTimeArrIndex){
        let hour, minutes, seconds, returnCount;
        var that    = this;
        var seckill = setInterval(function(){
          countTime -= 1000;
          hour        = parseInt(countTime / 3600000);
          minutes     = parseInt((countTime % 3600000) / 60000);
          seconds     = parseInt((countTime % 60000) / 1000);
          returnCount = hour + ':' + minutes + ':' + seconds;
          that.$set(that.countDonwnArr, countTimeArrIndex, returnCount)
          // console.log('that.countDonwnArr'+that.countDonwnArr);
        }, 1000)
        if(countTime <= 0){
          clearInterval(seckill)
        }
      },
      getEva(obj_id){
        this.$api.httpRequest(
          'GET',
          this.$constant.API_XOPEN_HOME + 'comment/topic/page',
          {module: '商品评价', obj_id: obj_id, page: 1, limit: 1},
          {key: 'ubxihoOtdXqrCEIgSQsa29mTByVp3nMJ'}
        ).then((data) => {
          if(data){
            this.evaList = data.list[0];
          }
        })
      },
      goCart(){
        if(this.type == 2){
          window.android.cart('goodsDetail');
        }else{
          uni.switchTab({
            url: "/pages/cart/cart"
          })
        }

      },
      //规格弹窗开关
      toggleSpec(){
        if(this.specClass === 'show'){
          this.specClass = 'hide';
          setTimeout(() => {
            this.specClass = 'none';
          }, 250);
        }else if(this.specClass === 'none'){
          this.specClass = 'show';
        }
      },
      // 修改数量
      changeNum(type){
        if(type == 'reduce' && this.num != 1){
          this.num--;
        }else if(type == 'add' && this.num != this.skusDetails.stock){
          this.num++;
        }
      },
      inputChange(e){
        // console.log(e.detail.value.length);
        if(e.detail.value.length == 0){
          this.num = 1;
          return this.num;
        }
        if(e.detail.value < 1){
          this.num = 1;
          return this.num;
        }
        this.num = e.detail.value;

      },
      // 加入购物车
      joinCar(){
        if(this.$store.state.hasLogin){
          this.$api.httpRequest(
            'GET',
            this.$constant.API_HOME + 'cart/cart/add_cart',
            {skuId: this.skusDetails.id, goodsNum: this.num},
            {token: this.token}
          ).then((data) => {
            // console.log(data);
            this.$api.msg('已加入购物车')
          })
        }else{
									// console.log(1)
									const state =uni.getStorageSync('state');
									if(state==2){
										this.isShow = true;
									}
									// this.isShow=true;
          // this.$api.msg('未登录');
										// 小程序
									 // // #ifdef MP-WEIXIN
										// this.isShow=true;
										// // #endif
										// // 微信公众号
										//  // #ifdef H5 
										// 	// this.$api.msg('未登录');
										// 	// uni.navigateTo({
										// 	// 	url:'../public/login'
										// 	// })
										// 	this.isShow=true;
										// 	// #endif
        }

      },
      //选择规格 index选择规格类型 childIndex 选择规格类型下的值
      selectSpec(item, index, childIndex){
        this.isSelectIndex = childIndex
        this.islayerIndex  = index
        // 修改已选数组
        this.$set(this.specSelected, index, item)
        this.goodsSpecValueIds = [];
        for(var i = 0; i < this.specSelected.length; i++){
          this.goodsSpecValueIds.push(this.specSelected[i].id);
        }
        let skusId             = this.goodsSpecValueIds.sort().join(',');
        this.goodsSpecValueIds = skusId;
        for(var i = 0; i < this.goodsDetail.skus.length; i++){
          if(this.goodsDetail.skus[i].goodsSpecValueIds.split(",").sort().join(',') == this.goodsSpecValueIds){
            this.skusDetails = this.goodsDetail.skus[i];
            // 如果该规格为团购商品 且未选中过
            // console.log(this.skusDetails)
            if(this.skusDetails.promType == 2 && this.groupPromId.indexOf(this.skusDetails.promId) == -1){
              this.groupPromId.push(this.skusDetails.promId)
              this.countDonwnArr = [];

              for(var a = 0; a < this.skusDetails.groupBuying.groupOrderList.length; a++){
                this.countDonwnArr[a] = this.skusDetails.groupBuying.groupOrderList[a].countDown;
                this.returnCountTimer(this.countDonwnArr[a], a);

              }
              // console.log(this.groupPromId)
            }
            // 判断是点击的1加入购物车 2立即购买 3单独购买 4我要开团
            if(this.skusDetails.promType == 2){
              this.isTabBtnType = 4
            }else if(this.skusDetails.promType == 2 && this.ownBuy){
              this.isTabBtnType = 3
            }else if(this.skusDetails.promType == 0 && this.ownBuy){
              this.isTabBtnType = 2
            }else{
              this.isTabBtnType = 1
            }
            break;
          }
        }
        for(var i = 0; i < this.goodsDetail.specs.length; i++){
          for(var j = 0; j < this.goodsDetail.specs[i].specValueList.length; j++){
            if(i == index && j == childIndex){
              this.$set(this.isSelectArr[index], childIndex, true)
            }else if(i == index){
              this.$set(this.isSelectArr[i], j, false)
            }
          }
        }
        // console.log(this.isSelectArr)
      },
      //分享
      share(){
        this.$refs.share.toggleMask();
      },
      //收藏
      toFavorite(){
        if(this.token == ''){
          // this.$api.msg('未登录');
										this.isShow=true;
          return false;
        }
        this.favorite = !this.favorite;

        this.$api.httpRequest(
          'POST',
          this.$constant.API_HOME + 'goods/goodscollect',
          {goodsSpuId: this.goodsId},
          {token: this.token}
        ).then((data) => {
        })

      },
      buyNow(groupOrder){

        if(this.type == 1){
          if(!this.$store.state.hasLogin){
            // this.$api.msg('未登录');
												const state =uni.getStorageSync('state');
												if(state==2){
													this.isShow = true;
												}
												// this.isShow=true;
												// // #ifdef MP-WEIXIN
												// this.isShow=true;
												// // #endif
												// // 微信公众号
												//  // #ifdef H5 
												// 	uni.navigateTo({
												// 		url:'../public/login'
												// 	})
												// 	this.$api.msg('未登录');
												// 	// #endif
          }else{
            // uni.navigateTo({
            // url: `/pages/order/createOrder`,
            if(groupOrder){
              uni.navigateTo({
                url: '/pages/order/createOrder?submitNow=true&groupBuyingId=' + this.skusDetails.promId + '&goodsNum=' + this.num + '&isGroup=' + 1,
              })
            }else{
              uni.navigateTo({
                url: '/pages/order/createOrder?submitNow=true&skuId=' + this.skusDetails.id + '&num=' + this.num,
              })
            }

          }
        }else if(this.type == 2){
          window.android.buy(this.skusDetails.id, this.num);
        }

      },
      // 去参团
      navToGroup(id){
        uni.navigateTo({
          url: '/pages/group/groupDetail?id=' + id + '&num=' + this.num
        })
      },
      // 评价
      goEvaluation(){
        uni.navigateTo({
          url: '/pages/product/evaluation?id=' + this.goodsId
        })
      },
      stopPrevent(){},
      //
      goStore(id){
        console.log('id', id);
        uni.navigateTo({
          url: "../store/store?id=" + id + "&token=" + this.token + "&type=" + this.type
        })
      }
    },
    /* 毫秒转 时间字符串 */
    msToStr: function(ms){
      //	todo
      return '00:20:10'
    },
				watch: {
					'$store.state.isAuthorization': function() {
						const state =uni.getStorageSync('state');
						if(state==2){
							this.isShow = true;
						}
						// this.isShow = true;
					}
				}

  }
</script>

<style lang='scss'>
  page {
    background: #F0F1F5;
    padding-bottom: 160upx;
    overflow-x: hidden;
  }

  .groupBtn1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24upx;
  }

  .store {
    margin: 20upx 0;
    background-color: white;
    padding: 20upx 30upx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .store-img {
      width: 88upx;
      height: 88upx;

      image {
        width: 100%;
        height: 100%;
      }
    }

    .storeInfo {
      width: 400upx;
      text-align: left;
      font-size: 24upx;

      .storeFans {
        color: #999999;
      }
    }

    .inStore {
      width: 168upx;
      height: 56upx;
      text-align: center;
      line-height: 56upx;
      border-radius: 28upx;
      background-color: #F05161;
      color: white;
      font-size: 24upx;
    }
  }

  .icon-you {
    font-size: $font-base + 2upx;
    color: #888;
  }

  .carousel {
    height: 722upx;
    position: relative;

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

  /* 秒杀活动 */
  .skill, .group {
    display: flex;
    justify-content: space-between;
    background: linear-gradient(left, #F07D51, #F05161);
    align-items: center;
    color: #fff;
    padding: 20upx;

    .skillPrice {
      font-size: 46upx;

      .oldPrice {
        font-size: 24upx;
        margin-left: 20upx;
        text-decoration: line-through;
      }
    }

    .skillTime {
      font-size: 24upx;

      .time {
        text {
          display: inline-block;
          width: 36upx;
          height: 36upx;
          background: #fff;
          color: #F05161;
          margin-left: 10upx;
          text-align: center;
          line-height: 36upx;
          border-radius: 5upx;
        }
      }

      .goodsNum {
        text-align: right;
      }
    }
  }

  /* 团购活动 */
  .group {
    padding: 10upx 20upx;

    .groupPrice {
      display: flex;
      flex-direction: column;
      font-size: 46upx;

      .ownGroup {
        font-size: 24upx;
      }
    }

    .groupNum {
      /* height: 36upx; */
      min-width: 120upx;
      padding-right: 10upx;
      border: 1upx solid #fff;
      font-size: 24upx;
      display: flex;
      align-items: center;

      .numImg {
        background: #fff;
        width: 36upx;
        height: 36upx;
        margin-right: 10upx;

        image {
          width: 32upx;
          height: 32upx;
          margin-top: 2upx;
        }
      }

    }
  }

  /* 标题简介 */
  .introduce-section {
    background: #fff;
    padding: 20upx 30upx;

    .goodsKeywrod {
      color: #999999;
      font-size: 24upx;
    }

    .titleBox {
      .titleBoxLeft {
        display: inline-block;
        width: 546upx;
        font-size: 32upx;
        padding: 10upx 0;
      }

      .titleBoxRight {
        display: flex;
        align-items: center;
        padding: 10upx 0;
        float: right;
        color: #999999;
        font-size: 20upx;

        image {
          width: 48upx;
          height: 48upx;
        }
      }
    }

    .title {
      font-size: 32upx;
      color: $font-color-dark;
      height: 50upx;
      line-height: 50upx;
    }

    .typeOne, .typeTwo {
      width: 80upx;
      height: 32upx;
      display: inline-block;
      margin-right: 16upx;
      font-size: 20upx;
      text-align: center;
      line-height: 32upx;
    }

    .typeOne {
      border: 1upx solid #F05161;
      color: #F05161;
    }

    .typeTwo {
      border: 1upx solid #F05161;
      color: white;
      background-color: #F05161;

    }

    .price-box {
      display: flex;
      align-items: baseline;
      height: 64upx;
      padding: 10upx 0;
      font-size: 26upx;
      color: $uni-color-primary;
    }

    .price {
      font-size: 36upx;
    }

    .m-price {
      margin: 0 12upx;
      color: $font-color-light;
      text-decoration: line-through;
    }

    .coupon-tip {
      align-items: center;
      padding: 4upx 10upx;
      background: $uni-color-primary;
      font-size: $font-sm;
      color: #fff;
      border-radius: 6upx;
      line-height: 1;
      transform: translateY(-4upx);
    }

    .bot-row {
      display: flex;
      align-items: center;
      height: 50upx;
      font-size: $font-sm;
      color: $font-color-light;
      margin-top: 12upx;

      text {
        margin-right: 54upx;
      }
    }
  }

  /* 活动 */
  .activity {
    margin: 20upx 0;
    background-color: white;
    font-size: 28upx;
    padding: 0 30upx;
    color: #666666;

    .sale-activity {
      font-size: 20upx;
      color: #F05161;
      padding: 5upx 10upx;
      border: 1upx solid #F05161;
      margin-left: 20upx;
    }

    .yticon {
      float: right;
      margin-top: 5upx;
    }

    .ensure {
      margin-top: 20upx;
      display: flex;
      align-items: center;
      font-size: 28upx;
      color: black;
      padding: 25upx 0;

      .ensure-content {
        display: flex;
        align-items: center;
        margin-right: 40upx;

        .ensure-icon {
          width: 28upx;
          height: 28upx;
          margin-right: 8upx;
          margin-bottom: 5upx;

          image {
            width: 100%;
            height: 100%;
          }
        }
      }

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

  .c-list {
    margin: 20upx 0;
    font-size: $font-sm + 2upx;
    color: $font-color-base;
    background: #fff;

    .c-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20upx 30upx;
      position: relative;

      .iconRight {
        margin-left: 550upx;
      }

      image {
        width: 24upx;
        height: 24upx;
      }
    }

    .tit {
      width: 140upx;
    }

    .con {
      flex: 1;
      color: $font-color-dark;

      .selected-text {
        margin-right: 10upx;
      }
    }

    .bz-list {
      height: 40upx;
      font-size: $font-sm+2upx;
      color: $font-color-dark;

      text {
        display: inline-block;
        margin-right: 30upx;
      }
    }

    .con-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      color: $font-color-dark;
      line-height: 40upx;
    }

    .red {
      color: $uni-color-primary;
    }
  }

  /* 评价 */
  .eva-section {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 20upx 30upx;
    background: #fff;
    margin-top: 16upx;

    .e-header {
      display: flex;
      align-items: center;
      height: 70upx;
      font-size: $font-sm + 2upx;
      color: $font-color-light;

      .tit {
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        margin-right: 4upx;
      }

      .tip {
        flex: 1;
        text-align: right;
      }

      .icon-you {
        margin-left: 10upx;
      }
    }

    .evaluation {
      font-size: 28upx;

      .con {
        /* display: block; */
        margin-top: 20upx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        height: 80upx;
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

    .eva-box {
      padding: 20upx 0;

      .eva-first {
        display: flex;
        align-items: center;

        .eva-star {
          display: flex;
          flex-direction: column;
          /* align-items: center; */
          .starImg {
            margin-left: 20upx;

            image {
              width: 32upx;
              height: 32upx;
            }
          }

          .eva-title {
            display: flex;
            justify-content: space-between;
            width: 620upx;
          }

          .time {
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
    }

  }

  /*  详情 */
  .detail-desc {
    background: #fff;
    margin-top: 16upx;

    .d-header {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 80upx;
      font-size: $font-base + 2upx;
      color: $font-color-dark;
      position: relative;

      text {
        padding: 0 20upx;
        background: #fff;
        position: relative;
        z-index: 1;
      }

      &:after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%);
        width: 300upx;
        height: 0;
        content: '';
        border-bottom: 1px solid #ccc;
      }
    }

    .richBox {
      /* margin-bottom: 110upx; */
      overflow: scroll;
    }

    .richImg {
      width: 100%;
      float: left;
    }

    .richText {
      color: #333;
      padding: 10upx;
      font-size: 32upx;
    }
  }

  /* 规格选择弹窗 */
  .attr-content {
    padding: 10upx 30upx 30upx 30upx;
    max-height: 1100upx;
    overflow-y: scroll;

    .price1 {
      color: #999999;
      font-size: 24upx;
    }

    .parameter {
      display: flex;
      align-content: flex-start;
      margin: 30upx 0;

      .par-left {
        font-size: 30upx;
        width: 160upx;
        color: #666666;
      }

      .par-right {
        font-size: 28upx;
        padding-left: 20upx;

        width: 500upx;
      }
    }

    .par-btn {
      width: 100%;
      margin: 10upx auto;
      height: 70upx;
      text-align: center;
      line-height: 70upx;
      font-size: 32upx;
      color: #fff;
      background: linear-gradient(to right, #F56C6C, #F05161);
      border-radius: 35upx;
    }

    .attr-title {
      font-size: 32upx;
      text-align: center;
      margin: 20upx;
    }

    .addBtnBox {
      display: flex;
      text-align: center;
      font-size: 30upx;
      margin-top: 20upx;
      color: #fff;

      .btnAdd, .btnBuy {
        width: 50%;
        background: #F99305;
        height: 80upx;
        line-height: 80upx;
      }

      .btnBuy {
        background: #F23D3D;
      }
						.btnBuy1{
							width: 100%;
							height: 70upx;
							line-height: 70upx;
							border-radius: 35upx;
							background: #F23D3D;
						}
    }

    .addNum {
      font-size: 32upx;
      color: #333;
      padding: 10upx;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .addBox {
        display: flex;
        align-items: center;

        input {
          width: 100upx !important;
          display: inline-block;
          text-align: center;
        }

        .numText {
          width: 100upx;
          text-align: center;
        }

        .numBtn {
          width: 60upx;
          height: 60upx;
          line-height: 50upx;
          text-align: center;
          font-size: 50upx;
          border-radius: 0;
          display: inline-block;
          background: #fff;
          border: 2upx solid #F05161;
          color: #333;
        }
      }
    }

    .a-t {
      display: flex;

      image {
        width: 170upx;
        height: 170upx;
        flex-shrink: 0;
        border-radius: 8upx;
      }

      .right {
        display: flex;
        flex-direction: column;
        padding-left: 24upx;
        font-size: $font-sm + 2upx;
        color: $font-color-base;
        line-height: 42upx;

        .price {
          font-size: $font-lg;
          color: $uni-color-primary;
          margin-bottom: 10upx;
        }

        .selected-text {
          margin-right: 10upx;
        }
      }
    }

    .attr-list {
      display: flex;
      flex-direction: column;
      font-size: $font-base + 2upx;
      color: $font-color-base;
      padding-top: 30upx;
      padding-left: 10upx;
      /* min-height: 200upx; */
    }

    .item-list {
      padding: 20upx 0 0;
      display: flex;
      flex-wrap: wrap;

      text {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #eee;
        margin-right: 20upx;
        margin-bottom: 20upx;
        border-radius: 100upx;
        min-width: 60upx;
        height: 60upx;
        padding: 0 20upx;
        font-size: $font-base;
        color: $font-color-dark;
      }

      .selected {
        background: #fbebee;
        color: $uni-color-primary;
      }
    }
  }

  /*  弹出层 */
  .popup {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 99;

    &.show {
      display: block;

      .mask {
        animation: showPopup 0.2s linear both;
      }

      .layer {
        animation: showLayer 0.2s linear both;
      }
    }

    &.hide {
      .mask {
        animation: hidePopup 0.2s linear both;
      }

      .layer {
        animation: hideLayer 0.2s linear both;
      }
    }

    &.none {
      display: none;
    }

    .mask {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.4);
    }

    .layer {
      position: fixed;
      z-index: 99;
      bottom: 0;
      width: 100%;
      min-height: 40vh;
      border-radius: 10upx 10upx 0 0;
      background-color: #fff;

      .btn {
        height: 66upx;
        line-height: 66upx;
        border-radius: 100upx;
        background: #F23D3D;
        font-size: $font-base + 2upx;
        color: #fff;
        margin: 30upx auto 20upx;
      }
    }

    @keyframes showPopup {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes hidePopup {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
    @keyframes showLayer {
      0% {
        transform: translateY(120%);
      }
      100% {
        transform: translateY(0%);
      }
    }
    @keyframes hideLayer {
      0% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(120%);
      }
    }
  }

  /* 底部操作菜单 */
  .page-bottom {
    position: fixed;
    left: 30upx;
    bottom: 30upx;
    z-index: 95;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 690upx;
    height: 100upx;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
    border-radius: 16upx;

    .tabImg {
      width: 48upx;
      height: 48upx;
    }
				
    .p-b-btn ,.p-b-btn1{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: $font-sm;
      color: $font-color-base;
      width: 126upx;
      height: 80upx;

      .yticon {
        font-size: 40upx;
        line-height: 48upx;
        color: $font-color-light;
      }

      &.active, &.active .yticon {
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
	.p-b-btn1{
		width: 40%;
	}
    .action-btn-group ,.action-btn-group1{
      display: flex;
      height: 76upx;
      border-radius: 100px;
      overflow: hidden;
      box-shadow: 0 20upx 40upx -16upx #fa436a;
      box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
      background: linear-gradient(to right, #ffac30, #fa436a, #F56C6C);
      margin-left: 20upx;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        right: 50%;
        transform: translateY(-50%);
        height: 28upx;
        width: 0;
        border-right: 1px solid rgba(255, 255, 255, .5);
      }

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 190upx;
        height: 100%;
        font-size: $font-base;
        padding: 0;
        border-radius: 0;
        background: transparent;
      }
    }
				.action-btn-group1{
					width: 50%;
				}
  }
  /* 累计参团 */
  .groupBox {
    /* padding: 0 30upx; */
    margin: 20upx 0;
    background: #fff;

    .groupBoxTitle {
      padding: 20upx 30upx;
      display: flex;
      justify-content: space-between;
      font-size: 28upx;
      border-bottom: 1upx solid #E8E8E8;

      .groupPlay {
        color: #999999;
      }

      view {
        display: flex;
        align-items: center;

        image {
          width: 24upx;
          height: 24upx;
        }
      }

    }

    .groupBoxContent {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10upx 30upx 10upx 50upx;

      .imgBox {
        display: flex;
      }

      .userImg {

        margin-left: -20upx;
        width: 80upx;
        height: 80upx;
        border-radius: 50%;
        background: #EEEEEE;
        color: #999999;
        font-size: 32upx;
        text-align: center;
        line-height: 80upx;
        border: 1upx solid #fff;

        image {
          width: 80upx;
          height: 80upx;
          border-radius: 50%;
        }
      }

      .userNum {
        display: flex;
        flex-direction: column;
        font-size: 28upx;
        color: #333;

        .groupTime {
          font-size: 20upx;
          color: #999999;
        }
      }

      .groupBtn {
        width: 120upx;
        height: 56upx;
        text-align: center;
        line-height: 56upx;
        background: #F05161;
        color: #fff;
        font-size: 24upx;
        border-radius: 28upx;
      }
    }
  }
		.mask {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 1000;
		}
</style>
