<template>
	<view class="wrap">
		<!-- <view class="content">
			<view class="userList" v-for="(val,index) in userList" :key='index'>
				<view class="name">{{val.fullName}}</view>
			</view>
	    </view> -->
      <view class="addUser" @click="navToAddUser"><image src="../../static/img/plus.png" mode=""></image></view>
		<view>
			<phone-directory :phones="phones" :source='source' :index='index' @paramClick="paramClick"></phone-directory>
		</view>
	</view>
</template>

<script>
	import phoneDirectory from '@/components/phone-directory/phone-directory.vue'
	export default {
		name:"phones",
		components:{
			phoneDirectory
		},
		data() {
			return {
			phones:{},
			source:0,
			index:0
				}
		},
    onShow() {
      this.getMyTellList()
    },
		onLoad(options) {
     
			if(options.source){
				this.source=options.source;
				this.index=options.index;
				// return;
			}
			this.getMyTellList()
		},
		methods: {
      paramClick(){
        alert('点击搜索结果')
      },
			getMyTellList(){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME+'customer/customer/list',
					{},
					// {token:'6b712905bb204216bb6b344df38b70f8'}
					{token:this.$store.state.userInfo.token.token}
					).then((data)=>{
				    // console.log(data);
					var phones={'☆':[]} 
					for(var i=0;i<data.length;i++){
						var str=data[i].firstSpelling.substr(0, 1)
            if(data[i].isMarked==1){
              phones['☆'].push(data[i])
            }
						if(phones[str]==undefined){
							// console.log(str)
							// 若该字母为首的键值对不存在
							phones[str]=[];
							phones[str].push(data[i])
							// console.log(phones)
						}else{
							// 若存在 将其存入对应键值对内
							phones[str].push(data[i])
						}
						
					}
						this.phones=phones
						
				});
			},
			navToAddUser(){
				uni.navigateTo({
					url:'/pages/user/addUser'
				})
			},
			tell(){
				uni.makePhoneCall({
					 phoneNumber: this.userPh 
				})
			},
			
		},
		
	}
 
</script>

<style lang="scss">
	page,
	.wrap {
		background: $page-color-base;
	}
	.content{
		border-top: 2upx solid #E8E8E8;
		padding:30upx;
		
	}
	.addUser{
    position: fixed;
    right: 60upx;
    bottom: 50upx;
    width: 100upx;
    height: 100upx;
    z-index: 99999;
    image{
      width: 100upx;
      height: 100upx;
    }
  }
</style>
