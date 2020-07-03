<template>
	<view class="container">
		<view class="logo">
			<image src="../../static/image/logo.png" mode=""></image>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToStatement">
			<text class="cell-tit">平台声明</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToAboutXb">
			<text class="cell-tit">关于我们</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
    <view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToPrivacy">
    	<text class="cell-tit">客服电话</text>
    	<text class="cell-more yticon icon-you"></text>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mobile:'',
			};
		},
		onLoad(options) {
			console.log(options)
			this.mobile=options.mobile;
		},
		methods:{
			// 平台声明
			navToStatement(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/set/statement'
					})
				}
			},
			// 隐私条款
			navToPrivacy(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/set/privacy'
					})
				}
			},
			// 关于仙宝
			navToAboutXb(){
				if(!this.$store.state.hasLogin){
					uni.navigateTo({
						url:'/pages/public/login'
					})
				}else{
					uni.navigateTo({
						url:'/pages/set/aboutXb'
					})
				}
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: #F0F1F5;
	}
	.logo{
		width: 80%;
		/* height: 110upx; */
		margin: 60upx auto;
		image{
			width: 100%;
			height: 160upx;
		}
	}
	
	.list-cell{
		display:flex;
		align-items:baseline;
		padding: 20upx $page-row-spacing;
		line-height:60upx;
		position:relative;
		background: #fff;
		justify-content: center;
		
		&.log-out-btn{
			margin-top: 40upx;
			.cell-tit{
				color: $uni-color-primary;
				text-align: center;
				margin-right: 0;
			}
		}
		&.cell-hover{
			background:#fafafa;
		}
		&.b-b:after{
			left: 30upx;
		}
		&.m-t{
			margin-top: 16upx; 
		}
		.cell-more{
			align-self: baseline;
			font-size:$font-lg;
			color:$font-color-light;
			margin-left:10upx;
		}
		.cell-tit{
			flex: 1;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			margin-right:10upx;
		}
		.cell-tip{
			font-size: $font-base;
			color: $font-color-light;
		}
		switch{
			transform: translateX(16upx) scale(.84);
		}
	}
</style>
