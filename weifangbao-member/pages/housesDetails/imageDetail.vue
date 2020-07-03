<template>
	<view class="container">
		<view class="carousel">
		   <swiper  circular=true duration="400" :current='index1'>
		     <swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index" >
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
	</view>
</template>

<script>

	export default {
	
		data() {
			return {
        imgList:[],
        index1:0,
      };
		},
   
		onLoad(options) {
      console.log(options);
			this.imgList=JSON.parse(options.imgList);
      this.index1=options.index;
		},
		methods: {

     
		
			
		},
	

	}
</script>

<style lang='scss'>
	page {
		background: #F8F8F8;
    display: flex;
    align-items: center;
    background: #333;
    height: 100%;
    width: 100%;
	}
.carousel {
  width: 750upx;
  margin: 0 auto;
    height: 520upx;
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
  .mask {
  	position: fixed;
  	top: 0;
  	left: 0;
  	z-index: 1000;
  }
</style>
