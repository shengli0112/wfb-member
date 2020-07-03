<template name='page-advertising'>
	<view class="advertising" v-if="isShow">
		<view class="box" >
			<view class="delBtn">
				<image class="delImg" src="/static/img/del.png" mode="" @click="cancle"></image>
			</view>
			<view class="advImage" @click="navTo">
				<image src="/static/img/gold.gif" mode=""></image>
			</view>
			
			</view>
			
	</view>
</template>

<script>
	export default{
		name:'page-advertising',
		data () {
		  return {
		    isShow:true,
		  }
		},
		onShow() {
			 const value = uni.getStorageSync('advTime');
				// if(value)
				// const myDate = new Date();
			 //    if (value>=myDate) {
			 //        console.log(value);
				// 							this.isShow=true;
			 //    }
			// if(this.$store.state.isFirst){
			// 	this.isShow=true;
			// }
		},
		methods:{
			cancle(){
				this.isShow=false;
				// this.$emit('isCancle',false)
				this.$store.state.isFirst=false;
				var myDate = new Date();
				uni.setStorage({//缓存广告时间
				  key: 'advTime',
				  data: myDate.getTime()+3600*1000,
				})
			},
			navTo(){
				// location.href=''
				console.log('点击了广告')
			}
		}
	}
</script>

<style>
.advertising{
	 position: fixed;
		top: 0;
		left: 0;
		font-size: 28upx;
		width: 750upx;
		height: 2000upx;
		background: rgba(0,0,0,0.7);
		padding-top: 250upx;
		color: #333333;
	}
	.box{
		width: 596upx;
		margin: auto;
		text-align: center;
		/* padding: 74upx 0 56upx 0; */
		border-radius: 20upx;
		position: relative;
		/* background: #4399FC; */
	}

.advImage{
	width: 596upx;
	
}
.advImage image{
		width: 596upx;
	}
/* 	<view class="delBtn">
		<image class="delImg" src="../../static/img/del.png" mode="" @click="cancle"></image>
	</view> */
	.delBtn{
		width: 50upx;
		height: 50upx;
		/* background: rgba(0,0,0,0.5); */
		text-align: center;
		line-height: 50upx;
		position: absolute;
		top: 0upx;
		right: 0upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* margin: 40upx auto; */
		border-radius: 50%;
		z-index: 10;
	}
	.delImg{
		width: 32upx;
		height: 32upx;
	}
</style>
