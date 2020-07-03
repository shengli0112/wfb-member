<template>
  <view class="content">
	<view class="box">
		<input type="text" value="" placeholder="请输入昵称" v-model="nickname"/>
	</view>
	<view class="btn" @click="changeName">保存</view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
		nickname:'', 
	  }
    },
    onLoad (options) {
      this.nickname=options.nickname;
    },
    methods: {
		changeName(){
			this.$api.httpRequest(
			  'POST',
			 this.$constant.API_HOME+'/member/update',
			  {nickname:this.nickname},
			  {'token':this.$store.state.userInfo.token.token},
			).then((data) => {
			  uni.navigateBack({
				delta: 1
			  });
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
  .box{
	background: #FFFFFF;
	margin: 20upx 0;
	padding: 20upx;
	font-size: 32upx;
		input{
			width: 100%;
		}
  }
  .btn{
	  text-align: center;
	  background: #007AFF;
	  color: #fff;
	  font-size: 32upx;
	  padding: 20upx;
  }
</style>
