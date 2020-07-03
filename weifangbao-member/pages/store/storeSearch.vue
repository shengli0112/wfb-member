<template>
	<view class="content">
		<view class="box">
			<view class="inputBox">
				<image src="../../static/image/search.png" mode=""></image>
				<input type="text" value="" placeholder="在千万海外商品中搜索" @confirm="getSearchAnser" v-model="keywords"/>
			</view>
			<text @click="back()">取消</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeId:'',
				keywords:''
			};
		},
		onLoad(options) {
			this.storeId=options.storeId
		},

		methods: {
			back() {
				uni.navigateBack({
					delta: 1,

				});
			},
			getSearchAnser(){
				// 获取搜索结果
				uni.navigateTo({
					url:'/pages/product/list?storeId='+this.storeId+'&keywords='+this.keywords
				})
			},
		},
	}
</script>

<style lang="scss">
	page,
	.content {
		background: $page-color-base;
	}

	.box {
		background: #FFFFFF;
		display: flex;
		align-items: center;
		font-size: 32upx;
		padding: 20upx 30upx;
		border-top: 2upx solid #F8F8F8;

		.inputBox {
			display: flex;
			align-items: center;
			width: 600upx;
			background: #F8F8F8;
			height: 60upx;
			border-radius: 30upx;

			image {
				width: 32upx;
				height: 32upx;
				margin: 0 20upx;
			}

			input {
				width: 480upx;
				display: inline-block;
			}
		}

		text {
			color: #999999;
			margin-left: 20upx;
		}
	}
</style>
