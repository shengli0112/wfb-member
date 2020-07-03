<template>
  <!-- scroll-y :scroll-top='scrollTop'  @scroll="scroll" -->
  <view class="content" @scroll="getScroll">
    <view class="maskBox" @click.stop="isChangeCondition=false,isScreen=false,isPrice=false,isSort=false" v-if="isChangeCondition==true || isScreen==true || isPrice==true || isSort==true" @touchmove.stop></view>
    <view class="navbar" >
      <view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
        区域
      </view>
      <view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
        价格
      </view>
      <view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
        筛选
      </view>
      <view class="nav-item" :class="{current: filterIndex === 3}" @click="tabClick(3)">
        排序
      </view>
    </view>
    <view class="selectBox1" v-if="isChangeCondition" @touchmove.stop>
      <!-- <view class="selectLeft">区域</view> -->
      <view class="selectLeft">
        <view class="selectList" :class="[condition==-1?'isSelect':'']" v-on:click.stop="condition=-1,areaId='',getData()">不限</view>
        <view class="selectList" :class="[condition==index?'isSelect':'']" v-for="(val,index) in addressArr[0]" :key='index' v-on:click.stop="getAreaList(val.id,2,index)">{{val.regionName}}</view>
      </view>
      <view class="selectRight selectRight2">

        <view v-if="condition!=-1">
          <view class="selectList" :class="[condition1==index1?'isSelect':'']" v-for="(val1,index1) in addressArr[1]" :key='index1' @click="changeAddress(index1,val1)">{{val1.regionName}}</view>
        </view>


      </view>
    </view>
    <view class="selectBox1" v-if="isPrice" @touchmove.stop>
      <view class="selectLeft">
        <view @click="isAllPrice=true" :class="[isAllPrice?'isSelect':'']">总价</view>
        <view @click="isAllPrice=false" :class="[!isAllPrice?'isSelect':'']">单价</view>
      </view>
      <view class="selectRight" v-if="isAllPrice">
        <view class="selectList" :class="[selectPrice==0?'isSelect':'']" @click.stop="page=1,selectPrice=0,totalPrice='',getData()">不限</view>
        <view class="selectList" :class="[selectPrice==1?'isSelect':'']" @click.stop="page=1,selectPrice=1,totalPrice='0,800000',getData()">80万以下</view>
        <view class="selectList" :class="[selectPrice==2?'isSelect':'']" @click.stop="page=1,selectPrice=2,totalPrice='80000,1500000',getData()">80～150万</view>
        <view class="selectList" :class="[selectPrice==3?'isSelect':'']" @click.stop="page=1,selectPrice=3,totalPrice='1500000,2000000',getData()">150万～200万</view>
        <view class="selectList" :class="[selectPrice==4?'isSelect':'']" @click.stop="page=1,selectPrice=4,totalPrice='2000000,3000000',getData()">200～300万</view>
        <view class="selectList" :class="[selectPrice==5?'isSelect':'']" @click.stop="page=1,selectPrice=5,totalPrice='3000000,',getData()">300万以上</view>
      </view>
      <view class="selectRight" v-if='!isAllPrice'>
        <view class="selectList" :class="[selectPrice1==0?'isSelect':'']" @click.stop="page=1,selectPrice1=0,unitPrice='',getData()">不限</view>
        <view class="selectList" :class="[selectPrice1==1?'isSelect':'']" @click.stop="page=1,selectPrice1=1,unitPrice='0,10000',getData()">1万以下</view>
        <view class="selectList" :class="[selectPrice1==2?'isSelect':'']" @click.stop="page=1,selectPrice1=2,unitPrice='10000,20000',getData()">1～2万</view>
        <view class="selectList" :class="[selectPrice1==3?'isSelect':'']" @click.stop="page=1,selectPrice1=3,unitPrice='20000,30000',getData()">2万～3万</view>
        <view class="selectList" :class="[selectPrice1==4?'isSelect':'']" @click.stop="page=1,selectPrice1=4,unitPrice='30000,40000',getData()">3～4万</view>
        <view class="selectList" :class="[selectPrice1==5?'isSelect':'']" @click.stop="page=1,selectPrice1=5,unitPrice='40000,',getData()">4万以上</view>
      </view>
    </view>
    <view class="selectBox1" v-if="isSort" @touchmove.stop>
      <view class="selectLeft">价格</view>
      <view class="selectRight">
        <view class="selectList" :class="[selectSort==0?'isSelect':'']" @click.stop="page=1,selectSort=0,order='',getData()">默认</view>
        <view class="selectList" :class="[selectSort==1?'isSelect':'']" @click.stop="page=1,selectSort=1,order='asc',getData()">单价由低到高</view>
        <view class="selectList" :class="[selectSort==2?'isSelect':'']" @click.stop="page=1,selectSort=2,order='desc',getData()">单价由高到低</view>
      </view>
    </view>
    <scroll-view scroll-y="true" class="selectBox2" v-if="isScreen" @touchmove.stop>
      <view  >
        <view class="selectContent">
          <view class="selectTitle">户型</view>
          <view class="slectCart">
            <view class="selectList" :class="[apartmentArr[0]?'selectList1':'']" @click="changeApartMent(0)">1居室</view>
            <view class="selectList" :class="[apartmentArr[1]?'selectList1':'']" @click="changeApartMent(1)">2居室</view>
            <view class="selectList" :class="[apartmentArr[2]?'selectList1':'']" @click="changeApartMent(2)">3居室</view>
          </view>

        </view>
        <view class="selectContent">
          <view class="selectTitle">面积（m²）</view>
          <view class="slectCart">
            <view class="selectList" :class="[areaArr[0]?'selectList1':'']" @click="changeArea(0)">50-70m²</view>
            <view class="selectList" :class="[areaArr[1]?'selectList1':'']" @click="changeArea(1)">70-90m²</view>
            <view class="selectList" :class="[areaArr[2]?'selectList1':'']" @click="changeArea(2)">90-110m²</view>
            <view class="selectList" :class="[areaArr[3]?'selectList1':'']" @click="changeArea(3)">110-130m²</view>
            <view class="selectList" :class="[areaArr[4]?'selectList1':'']" @click="changeArea(4)">150-200m²</view>
            <view class="selectList" :class="[areaArr[5]?'selectList1':'']" @click="changeArea(5)">200m²以上</view>
          </view>

        </view>
        <view class="selectContent">
          <view class="selectTitle">特色</view>
          <view class="slectCart">
            <view class="selectList" :class="[selectLableArr[index]?'selectList1':'']" v-for="(val,index) in labelList" :key='index' @click="changeSelectLabel(index)">{{val.remark}}</view>
            <!-- <view class="selectList" :class="[typeArr[0]?'selectList1':'']" @click="changeType(0)">住宅</view>
            <view class="selectList" :class="[typeArr[1]?'selectList1':'']" @click="changeType(1)">别墅</view>
            <view class="selectList" :class="[typeArr[2]?'selectList1':'']" @click="changeType(2)">写字楼</view> -->
          </view>

        </view>
        <view class="selectContent">
          <view class="selectTitle">售卖状态</view>
          <view class="slectCart">
            <view class="selectList" :class="[selectStatusArr[index]?'selectList1':'']" v-for="(val,index) in sellStateArr" :key='index' @click="changeSelectStatus(index)">{{val.remark}}</view>
          </view>
        </view>
        <view class="selectContent">
          <view class="selectTitle">开盘时间</view>
          <view class="slectCart">
            <view class="selectList" :class="[selectOpeningDate[0]?'selectList1':'']" @click="changeOpenDate(0)">最近开盘</view>
            <view class="selectList" :class="[selectOpeningDate[1]?'selectList1':'']" @click="changeOpenDate(1)">未来一个月</view>
            <view class="selectList" :class="[selectOpeningDate[2]?'selectList1':'']" @click="changeOpenDate(2)">过去一个月</view>
            <view class="selectList" :class="[selectOpeningDate[3]?'selectList1':'']" @click="changeOpenDate(3)">过去三个月</view>
          </view>

        </view>
        <view class="btnBox">
          <view class="clearBtn" @click="clearSelect">清空</view>
          <view class="confirm" @click="submitSelect">确定</view>
        </view>
      </view>
    </scroll-view>
    <view class="goods-list1">
      <!-- <view class="goods-item" @click="navToDetailPage()">

          <view class="image-wrapper">
            <image src="" mode="aspectFill"></image>
          </view>
          <view class="listRight">
            <view class="nameBox">
              <view class="houseName">环秀湖花园</view>
                <view class="state">在售</view>
            </view>
            <view class="houseAddress">
              <text>苏州-高铁新城 </text>
              <text class="area">建面：89~160</text>
            </view>
            <view class="tagBox">
              <view class="tagList">住宅</view>
            </view>
            <view class="price">
              <text class="priceLeft" >20000元</text>
              <text class="priceLeft">佣金：20000元</text>
            </view>
          </view>

      </view> -->
      <view class="goods-item" @click="navToDetailPage(item)" v-for="(item, index) in goodsList" :key="index" >

        <view class="image-wrapper">
          <view class="topLabel" v-if="item.topLabel">{{item.topLabel}}</view>
          <image :src="(JSON.parse(item.designPictures))[0]" mode=""></image>
        </view>
        <view class="listRight">
          <view class="nameBox">
            <view class="houseName">{{item.propertyName}}</view>
            <view class="state" v-bind:class="{'chip':item.saleStatus=='认筹中','shopping':item.saleStatus=='在售','out':item.saleStatus=='售罄' }" v-if="item.saleStatus">{{item.saleStatus}}</view>
          </view>
          <view class="houseAddress">
            <text>{{item.areaName}}</text>
            <text class="area">建面：{{item.minBuildArea}}㎡~{{item.maxBuildArea}}㎡</text>
          </view>
          <view class="tagBox">
            <view class="tagList" v-for="(item1,index1) in labelArr[index]" :key='index1'>{{item1}}</view>
          </view>
          <view class="price">
            <text class="priceLeft" >{{item.unitPrice}}元/㎡</text>
            <text class="priceLeft" v-if="item.commission">佣金：{{item.commission}}</text>
          </view>
        </view>

      </view>
    </view>
    <view class="placedTop" @click="navToTop"><image src="../../static/img/top.png" mode=""></image></view>
    <uni-load-more :status="loadingType"></uni-load-more>
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
                scrollTop:0,
                oldScrollTop:0,
                labelArr:[],
                condition:-1,
                condition1:-1,
                selectPrice:0,
                selectPrice1:0,
                selectSort:0,
                isAllPrice:true,
                headerPosition: "fixed",
                headerTop: "0px",
                loadingType: 'more', //加载更多状态
                filterIndex: 0,
                goodsList: [],
                url: this.$constant.API_HOME,
                page: 1, //请求页数
                token: this.$store.state.hasLogin ? this.$store.state.userInfo.token.token : '',
                keywords: '',
                isScreen:false,//筛选
                isChangeCondition:false,//区域
                addressArr:[[]],
                isPrice:false,//价格
                isSort:false,//排序
                areaId:'',//区域
                unitPrice:'',//单价
                totalPrice:'',//总价
                order:'',//排序
                apartment:'',//户型
                area:'',//面积
                type:'',//类型
                apartmentArr:[0,0,0],//户型选中状态
                areaArr:[0,0,0,0,0,0],//面积选中状态
                typeArr:[0,0,0],//类型选中状态
                apertmentSelectArr:['1居室','2居室','3居室'],//户型选中值
                areaSelectArr:['50-70','70-90','90-110','110-130','150-200','200-'],//面积选中值
                typeSelectArr:['住宅','别墅','写字楼'],//类型选中值，
                addressIdArr:[],
                selectLableArr:[],
                labelList:[],//特色标签
                sellStateArr:[],//售卖状态
                selectStatusArr:[],
                saleStatus:'',
                openingDate:'',
                selectOpeningDate:[false,false,false,false],
                openingDateArr:[0,30,-30,-90]
            };
        },
        onShow() {
            this.clearSelect();
            this.getData(0);
        },
        onLoad(options) {
            this.getAreaList();
            //this.getData(0);
            this.getSelectId();
        },
        onPageScroll(e) {
            //兼容iOS端下拉时顶部漂移
            if (e.scrollTop >= 0) {
                this.headerPosition = "fixed";
            } else {
                this.headerPosition = "absolute";
            }
        },
        //下拉刷新
        onPullDownRefresh() {
            this.page = 1
            this.getData(this.filterIndex, 'refresh');
        },
        //加载更多
        onReachBottom() {
            // this.loadData();
            if (this.loadingType === 'nomore') {
                return;
            }
            this.page++;
            this.getData(this.filterIndex, 'isadd');
        },
        methods: {
            getScroll(e){
                console.log(e)
            },
            scroll: function(e) {
                // console.log(e)
                this.oldScrollTop = e.detail.scrollTop
            },
            // 置顶
            navToTop(){
                uni.pageScrollTo({
                    duration: 0,
                    scrollTop: 0
                })
            },
            // 选中开盘时间
            changeOpenDate(index){
                this.$set(this.selectOpeningDate,index,!this.selectOpeningDate[index])
                console.log(this.selectOpeningDate)
            },
            // 选中特色
            changeSelectLabel(index){
                this.$set(this.selectLableArr,index,!this.selectLableArr[index])
            },
            // 选中售卖状态
            changeSelectStatus(index){
                this.$set(this.selectStatusArr,index,!this.selectStatusArr[index])
            },
            // 选中区域
            changeAddress(index,val){
                this.condition1=index;
                this.areaId=val.id;
                this.getData();
            },
            getNext(e){
                // 获取二级区域
                console.log(e.target.column,e.target.value)
                this.$set(this.addressIndex,e.target.column,e.target.value)
                if(e.target.column==0){
                    this.pId=this.addressIdArr[e.target.value]
                    this.getAreaList(this.pId,2)
                }
            },
            // 获取区域
            getAreaList(pId=0,leavl=1,index){
                this.condition=index
                this.$api.httpRequest(
                  'GET',
                  this.$constant.API_HOME + 'property/propertyregion/list',{
                      parentId:pId
                  },
                  {
                      token: this.$store.state.userInfo.token.token
                  }
                ).then((data) => {
                    // console.log(data);
                    // this.addressArr=data;
                    if(pId==0){
                        this.getAreaList(data[0].id,2)
                        for(var i=0;i<data.length;i++){
                            this.$set(this.addressArr[0],i,data[i]);
                            // this.$set(this.addressIdArr,i,data[i].id)
                        }
                    }
                    if(leavl==2){
                        this.$set(this.addressArr,1,[])
                        for(var j=0;j<data.length;j++){
                            // console.log(data[j].regionName)
                            this.$set(this.addressArr[1],j,data[j])
                            // this.$set(this.addressIdArr1,j,data[j].id)
                        }
                        // console.log(this.addressArr)
                    }
                })
            },
            clearSelect(){
                for(var i=0;i<this.apartmentArr.length;i++){
                    this.$set(this.apartmentArr,i,0)
                }
                for(var i=0;i<this.areaArr.length;i++){
                    this.$set(this.areaArr,i,0)
                }
                for(var i=0;i<this.typeArr.length;i++){
                    this.$set(this.typeArr,i,0)
                }
                this.apartment=''
                this.area=''
                this.type=''
            },
            submitSelect(){
                this.page=1;
                this.apartment='';
                this.area='';
                this.type='';
                this.saleStatus='';
                this.openingDate='';
                for(var i=0;i<this.apartmentArr.length;i++){
                    if(this.apartmentArr[i]==1){
                        if(this.apartment==''){
                            this.apartment=this.apertmentSelectArr[i];
                        }else{
                            this.apartment+=','+this.apertmentSelectArr[i];
                        }
                    }
                }
                for(var i=0;i<this.areaArr.length;i++){
                    if(this.areaArr[i]==1){
                        if(this.area==''){
                            this.area=this.areaSelectArr[i];
                        }else{
                            this.area+=','+this.areaSelectArr[i];
                        }
                    }
                }
                // for(var i=0;i<this.typeArr.length;i++){
                // 	if(this.typeArr[i]==1){
                // 		if(this.type==''){
                // 			this.type=this.typeSelectArr[i];
                // 		}else{
                // 			this.type+=','+this.typeSelectArr[i];
                // 		}
                // 	}
                // }
                for(var i=0;i<this.labelList.length;i++){
                    if(this.selectLableArr[i]){
                        if(this.type==''){
                            this.type=this.labelList[i].remark;
                        }else{
                            this.type+=','+this.labelList[i].remark;
                        }
                    }
                }
                for(var i=0;i<this.sellStateArr.length;i++){
                    if(this.selectStatusArr[i]){
                        if(this.saleStatus==''){
                            this.saleStatus=this.sellStateArr[i].remark;
                        }else{
                            this.saleStatus+=','+this.sellStateArr[i].remark;
                        }
                    }
                }
                for(var i=0;i<this.selectOpeningDate.length;i++){
                    if(this.selectOpeningDate[i]){
                        if(this.openingDate==''){
                            this.openingDate=JSON.stringify(this.openingDateArr[i]);
                        }else{
                            this.openingDate+=','+this.openingDateArr[i];
                        }
                    }
                }
                this.isScreen=false;
                this.getData()
                // console.log(this.apartment)
                // console.log(this.area)
                // console.log(this.type)
            },
            changeApartMent(index){
                this.$set(this.apartmentArr,index,this.apartmentArr[index]?0:1)
                console.log(this.apartmentArr)
            },
            changeArea(index){
                this.$set(this.areaArr,index,this.areaArr[index]?0:1)
                console.log(this.areaArr)
            },
            changeType(index){
                this.$set(this.typeArr,index,this.typeArr[index]?0:1)
                console.log(this.typeArr)
            },
            getSelectId(pId=0){
                this.$api.httpRequest(
                  'GET',
                  this.$constant.API_HOME + 'common/dictList',
                  {pid:pId}
                ).then((data) => {
                    if(pId==0){
                        // console.log(data);
                        for(var i=0;i<data.length;i++){
                            this.getSelectId(data[i].id)
                        }
                    }else if(data[0].dictType=="area"){
                        // console.log(data)
                        this.addressArr=data;
                        // this.areaId=this.addressArr[this.addressId].id
                    }else if(data[0].dictType=="labels"){
                        // console.log(data)
                        this.labelList=data;
                        for(var i=0;i<this.labelList.length;i++){
                            this.selectLableArr[i]=false;
                        }
                    }else if(data[0].dictType=="sale_status"){
                        // console.log(data)
                        // 售卖状态
                        this.sellStateArr=data;
                        for(var i=0;i<this.sellStateArr.length;i++){
                            this.selectStatusArr[i]=false;
                        }
                    }
                    // this.editorList=data;
                })
            },
            // 封装加载
            getData(index, type = 'refresh') {
                let mark = uni.getStorageSync('SWITCH_TAB_MARK');
                if(mark){
                    this.page = 1;
                }
                uni.removeStorageSync('SWITCH_TAB_MARK');

                if(this.filterIndex==0){
                    this.isChangeCondition=false
                }else if(this.filterIndex==1){
                    this.isPrice=false
                }else if(this.filterIndex==2){
                    this.isScreen=false
                }else if(this.filterIndex==3){
                    this.isSort=false
                }
                // console.log(index)
                this.$api.httpRequest(
                  'GET',
                  this.url + 'property/property/user/page',
                  {
                      page:this.page,
                      limit:10,
                      orderSort:this.order,
                      totalPrice:this.totalPrice,
                      unitPrice:this.unitPrice,
                      areaId:this.areaId,
                      apartment:this.apartment,
                      area:this.area,
                      characteristic:this.type,
                      orderBy:'unit_price',
                      openingDate:this.openingDate,
                      saleStatus:this.saleStatus,
                      mark:mark
                  },
                  {
                      token: this.$store.state.hasLogin?this.$store.state.userInfo.token.token:''
                  }
                ).then((data) => {
                    if (type == 'refresh') {
                        uni.stopPullDownRefresh();
                        if (this.page == 1) {
                            this.goodsList = data.list;
                        } else {
                            // uni.startPullDownRefresh();

                            this.goodsList = data.list;
                        }

                    } else {
                        // this.goodsList.concat(data.list);
                        for (var i = 0; i < data.list.length; i++) {
                            this.goodsList.push(data.list[i])
                        }
                        console.log(data.list);
                    }
                    for(var a=0;a<this.goodsList.length;a++){
                        this.labelArr[a]=[];
                        for(var b=0;b<this.goodsList[a].labels.split(',').length;b++){
                            this.labelArr[a][b]=this.goodsList[a].labels.split(',')[b]
                        }
                    }
                    // console.log(this.labelArr)
                    this.page == Math.ceil(data.total / 10) ? this.loadingType = 'nomore' : this.loadingType = 'more';
                    data.total == 0 ? this.loadingType = 'nomore' : '';

                })
            },
            //筛选点击
            tabClick(index) {
                if (this.filterIndex === index) {
                    if(index==0){
                        this.isChangeCondition=!this.isChangeCondition
                    }else if(index==1){
                        this.isPrice=!this.isPrice;
                    }else if(index==2){
                        this.isScreen=!this.isScreen;
                    }else if(index==3){
                        this.isSort=!this.isSort;
                    }
                    return;
                }
                // isScreen:false,//区域
                // isChangeCondition:false,//筛选
                // isPrice:false,//价格
                // isSort:false,//排序
                if(index==0){
                    this.isChangeCondition=!this.isChangeCondition;
                    this.isScreen=false;
                    this.isPrice=false;
                    this.isSort=false;
                }else if(index==1){
                    this.isPrice=!this.isPrice
                    this.isScreen=false;
                    this.isChangeCondition=false;
                    this.isSort=false;
                }else if(index==2){
                    this.isScreen=!this.isScreen;
                    this.isPrice=false;
                    this.isChangeCondition=false;
                    this.isSort=false;

                }else if(index==3){
                    this.isSort=!this.isSort;
                    this.isScreen=false;
                    this.isPrice=false;
                    this.isChangeCondition=false;
                }
                this.filterIndex = index;
                // this.getData(index);
                // uni.pageScrollTo({
                // 	duration: 300,
                // 	scrollTop: 0
                // })

            },
            //详情页
            navToDetailPage(item) {
                //测试数据没有写id，用title代替
                let id = item.id;
                uni.navigateTo({
                    url:'/pages/housesDetails/housesDetail?id='+id
                })
            },
        },
    }
</script>

<style lang="scss">
  page,
  .content {
    background: #F0F1F5;
    height: 100%;
    // overflow-y: scroll;
  }

  .content {
    padding-top: 85upx;
  }
  .isSelect{
    color: #3171F2;
  }
  .maskBox{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100vh);
    background: rgba(0,0,0,0.5);
    z-index: 102;

  }
  .navbar {
    position: fixed;
    left: 0;
    top: var(--window-top);
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 80upx;
    background: #fff;
    // box-shadow: 0 2upx 10upx rgba(0, 0, 0, .06);
    // padding:0 30upx;
    z-index: 105;
    text-align: center;

    .nav-item {
      // flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 25%;
      font-size: 30upx;
      color: $font-color-dark;
      position: relative;
      text-align: center;
      &.current {
        color: #3171F2;
      }
    }

    .p-box {
      display: flex;
      flex-direction: column;

      .yticon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30upx;
        height: 14upx;
        line-height: 1;
        margin-left: 4upx;
        font-size: 26upx;
        color: #888;

        &.active {
          color: $base-color;
        }
      }

      .xia {
        transform: scaleY(-1);
      }
    }

    .cate-item {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 80upx;
      position: relative;
      font-size: 44upx;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        border-left: 1px solid #ddd;
        width: 0;
        height: 36upx;
      }
    }
  }
  .selectBox1{
    z-index: 10000;
    position: fixed;
    top: 80upx;
    left: 0;
    width: 750upx;
    display: flex;
    background: #fff;
    font-size: 32upx;
    .selectLeft{
      z-index: 100001;
      width: 188upx;
      text-align: center;
      padding: 30upx 0;
      view{
        margin-bottom: 20upx;
      }
    }
    .selectRight2{
      display: flex;
    }
    .selectRight{
      z-index: 100001;
      width: 562upx;
      background: #F8F8F8;
      padding: 30upx;
      .selectList{
        z-index: 1000011;
        margin-bottom: 52upx;
      }
      .selectList:last-child{
        margin: 0;
      }
    }

  }
  .selectBox2{
    z-index: 10000;
    height: 800upx;
    position: fixed;
    top: 80upx;
    left: 0;
    width: 750upx;
    background: #fff;
    font-size: 24upx;
    .selectContent{
      padding:0 38upx;
      // padding-right: 2upx;
      margin: 60upx auto;
      .selectTitle{
        font-size: 32upx;
        font-weight: 550;
        margin-bottom: 30upx;
      }
      .slectCart{
        display: flex;
        flex-wrap: wrap;
        // justify-content: space-between;
        .selectList{
          width: 144upx;
          height: 64upx;
          line-height: 64upx;
          background: #F8F8F8;
          text-align: center;
          margin: 30upx 32upx 0 0;
          // margin-right: 32upx;

        }
        .selectList:nth-child(4n){
          margin-right: 0;
        }
        .selectList1{
          background: #EEF4FF;
          color: #3171F2;
        }
      }
    }
  }
  .btnBox{
    width: 750upx;
    display: flex;
    justify-content: space-between;
    padding: 30upx 40upx;
    border-top: 1upx solid #E8E8E8;
    border-bottom: 1upx solid #E8E8E8;
    font: 34upx;
    .clearBtn{
      width: 320upx;
      height: 90upx;
      line-height: 90upx;
      text-align: center;
      background: #F8F8F8;
      border-radius: 8upx;
    }
    .confirm{
      width: 320upx;
      height: 90upx;
      line-height: 90upx;
      text-align: center;
      background: #3171F2;
      color: #fff;
      border-radius: 8upx;
    }
  }

  .mask {
    position: fixed;
    top: 260upx;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .4);
    z-index: 10;
    transition: .3s;
  }

  .cate-content {
    width: 100%;
    position: absolute;
    top: 85upx;
    z-index: 20;
    background-color: #F8F8F8;

    .mask-con {
      display: inline-block;
      width: 50%;
      margin-bottom: 30upx;
      box-sizing: border-box;
      padding: 30upx 30upx 0 30upx;
      color: #333333;
    }

    .mask-button {
      width: 750upx;
      margin-top: 10upx;

      .button-reset,
      .button-confirm {
        display: inline-block;
        width: 50%;
        height: 100upx;
        line-height: 100upx;
        text-align: center;
        background: white;
        color: #333333;
      }

      .button-confirm {
        color: white;
        background: #F05161;
      }
    }
  }

  .none {
    display: none;
  }

  .show {
    display: block;

    .cate-content {
      transform: translateX(0);
    }
  }

  .oldPrice {
    color: #999999;
    font-size: 24upx;
    padding-left: 20upx;
    text-decoration: line-through;
    // &:before{
    //   content: '￥';
    //   font-size: 24upx;
    // }
  }

  .screen-box {
    position: relative;
    background-color: white;
    font-size: 28upx;
    margin-bottom: 20upx;

    .screen {
      display: inline-block;
      width: 156upx;
      height: 64upx;
      line-height: 64upx;
      text-align: center;
      background-color: #F8F8F8;
      margin: 10upx 0 10upx 30upx;

      image {
        width: 10upx;
        height: 10upx;
        margin-left: 5upx;
        margin-bottom: 2upx;
      }
    }

    .screenRed {
      color: #F05161;
    }
  }
  // 商品列表第二套样式
  .goods-list1 {
    .goods-item {
      // margin: 10upx 0;
      width: 100%;
      background-color: white;
      padding: 20upx;
      overflow: hidden;
      display:flex;
      align-items: center;
      border-bottom: 1upx solid #E8E8E8;
      // justify-content: space-between;
    }
    .goods-item:last-child{
      border: 0;
    }
    .image-wrapper {
      width: 250upx;
      height: 180upx;
      // border: 1upx solid #303133;
      margin-right: 20upx;
      position: relative;
      image {
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
  .placedTop{
    position: fixed;
    bottom: 30upx;
    right: 20upx;
    width: 100upx;
    height: 100upx;
    background: rgba($color: #fff, $alpha:0.9);
    border-radius: 50%;
    image{
      width: 100upx;
      height: 100upx;

      // box-shadow: 0 0 20upx 0 rgba(0, 0, 0, .5);
    }
  }
</style>
