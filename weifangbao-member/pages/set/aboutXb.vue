<template>
	<view class="container">
		<view v-if="showWebView">
			<web-view  :src="webViewSrc"></web-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				webViewSrc:'',
				showWebView:true,
			};
		},
		onLoad(options) {
			this.webViewSrc=this.$constant.API_OPEN_H5+'#/article_detail?id=1171014313343415275';
		},
		methods:{
			
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
	}
	
	
	
</style>
