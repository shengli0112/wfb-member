<template>
  <view class="content">
    <scroll-view scroll-y class="left-aside">
      <view v-for="(item,index) in flist" :key="item.id" class="f-item b-b" :class="{active: item.id === currentId}" @click="tabtap(item,index)">
        {{item.name}}
      </view>
    </scroll-view>
    <scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view class="banner">
				<image :src="bannerImg" mode=""></image>
			</view>
      <view v-for="item in slist" :key="item.id" class="s-list" :id="'main-'+item.id">
        <text class="s-item">{{item.name}}</text>
        <view class="t-list">
          <view @click="navToList(titem.id)" v-if="titem.pid === item.id" class="t-item" v-for="titem in item.childGoodsCategory" :key="titem.id">
            <image :src="titem.icon"></image>
            <text>{{titem.name}}</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        sizeCalcState: false,
        tabScrollTop: 0,
        currentId: 1,
        flist: [],
        slist: [],
        tlist: [],
        url: this.$constant.API_HOME,
        index: 0,//记录滚动到哪个分类
				bannerImg:'',
      }
    },
		onShow() {
			var myDate = new Date();
			// console.log(myDate.getTime()==this.$store.state.time)
			if(myDate.getTime()>=this.$store.state.time){
				this.$store.commit('logout')
			}
		},
    onLoad () {
      // 一级分类
      this.loadData();
    },
    methods: {
      async loadData () {
        this.$api.httpRequest(
          'GET',
          this.url + '/goods/goodscategory/first_level_goods_category'
        ).then((data) => {
          this.loadData2(data[0].id);
          this.flist = data;
          this.currentId = data[0].id;
					this.bannerImg=data[0].icon;
        })
      },
      loadData2 (id) {
        this.$api.httpRequest(
          'GET',
          this.url + '/goods/goodscategory/child_goods_category',
          {"pid": id}
        ).then((data) => {
          // console.log(data);
					
          this.slist = data;
        })
      },
      //一级分类点击
      tabtap (item, index) {
        if (!this.sizeCalcState) {
          this.calcSize();
        }
				this.bannerImg=item.icon;
        this.loadData2(item.id)
        this.currentId = item.id;
        this.index = index;
      },

      //右侧栏滚动
      asideScroll (e) {
        if (!this.sizeCalcState) {
          this.calcSize();
        }
        let scrollTop = e.detail.scrollTop;
        let tabs = this.slist.filter(item => item.top <= scrollTop).reverse();
        // console.log(tabs);
        if (tabs.length > 0) {
          this.currentId = tabs[0].pid;
        }
      },
      //计算右侧栏每个tab的高度等信息
      calcSize () {
        let h = 0;
        this.slist.forEach(item => {
          let view = uni.createSelectorQuery().select("#main-" + item.id);
          view.fields({
            size: true
          }, data => {
            item.top = h;
            h += data.height;
            item.bottom = h;
          }).exec();
        })
        this.sizeCalcState = true;
      },
      navToList (cateid) {
        uni.navigateTo({
          url: `/pages/product/list?cateid=${cateid}`
        })
      }
    }
  }
</script>

<style lang='scss'>
  page,
  .content {
    height: 100%;
    background-color: #f8f8f8;
  }

  .content {
    display: flex;
  }
  .left-aside {
    flex-shrink: 0;
    width: 200upx;
    height: 100%;
    background-color: #fff;
  }
  .f-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100upx;
    font-size: 28upx;
    color: $font-color-base;
    position: relative;
    &.active{
      color: $base-color;
      background: #f8f8f8;
      &:before{
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 36upx;
        width: 8upx;
        background-color: $base-color;
        border-radius: 0 4px 4px 0;
        opacity: .8;
      }
    }
  }

  .right-aside{
		.banner{
			height: 182upx;
			width: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
    flex: 1;
    overflow: hidden;
    padding-left: 20upx;
  }
  .s-item{
    display: flex;
    align-items: center;
    height: 70upx;
    padding-top: 8upx;
    font-size: 28upx;
    color: $font-color-dark;
  }
  .t-list{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    background: #fff;
    padding-top: 12upx;
    &:after{
      content: '';
      flex: 99;
      height: 0;
    }
  }
  .t-item{
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 176upx;
    font-size: 26upx;
    color: #666;
    padding-bottom: 20upx;

    image{
      width: 140upx;
      height: 140upx;
    }
  }
</style>
