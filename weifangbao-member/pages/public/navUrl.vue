<template>
	<view class="wrap">
		 <web-view :src="url" v-if="isShow"></web-view>   
	</view>
</template>

<script>
	export default {

		data() {
			return {
				url:'',
				isShow:true,
			}
		},
		onLoad(options) {
			this.url=options.url
		},
		methods: {},
		
	}
</script>

<style lang="scss">
	
</style>
