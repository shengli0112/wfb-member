<template>
	<view class="container">
		<view class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50" @click="navToReset">
			<text class="cell-tit">修改密码</text>
			<text class="cell-more yticon icon-you"></text>
		</view>
		<view class="list-cell" hover-class="cell-hover" :hover-stay-time="50" @click="navToPn">
			<text class="cell-tit">修改手机号</text>
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
			navToReset(){
				uni.navigateTo({
					url:'/pages/set/resetPassWord?mobile='+this.mobile
				})
			},
			navToPn(){
				uni.navigateTo({
					url:'/pages/set/resetPhoneNumber?mobile='+this.mobile
				})
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	.user{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 20upx 30upx;
		margin: 20upx 0;
		color: $font-color-light;
		.userInfo{
			display: flex;
			align-items: center;
			.userImg{
				width: 100upx;
				height: 100upx;
				image{
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
				}
			}
			.userName{
				display: flex;
				flex-direction: column;
				color: $font-color-dark;
				font-size: 28upx;
				margin-left: 20upx;
			}
			.login{
				font-size: 28upx;
				margin-left: 20upx;
				color: #333;
			}
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
