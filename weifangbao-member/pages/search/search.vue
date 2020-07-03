<template>
	<view class="wrap">
		<view class="searchInp">
			<image src="../../static/img/Search.png" mode=""></image>
			<input focus=true type="text" value="" placeholder="搜索您想要的楼盘" v-model="msg"/>
			<view style="color: #333;font-weight: 550;" @click="goSearchDetails(msg)">搜索</view>
		</view>
		<!-- 最近搜索 -->
		<!-- <view class="recentSearch">
			<view class="recentSearchTitle" v-if="searchHistoryList.length>0">最近搜索<image src="../../static/image/trash.png" mode="" @click="del"></image></view>
			<view class="recentSearchBox">
				<view class="recentSearchContent" v-for="(val,index) in searchHistoryList" :key='index' @click="goSearchDetails(val.keywords)">{{val.keywords}}</view>
			</view>
		</view> -->
		<!-- 搜索发现 -->
		<!-- <view class="searchFound recentSearch" v-if="hotSearchList.length>0">
			<view class="searchFoundTitle recentSearchTitle">搜索发现</view>
			<view class="searchFoundBox recentSearchBox">
				<view class="searchFoundContent recentSearchContent" v-for="(val,index) in hotSearchList" :key='index' @click="goSearchDetails(val.keyword)">{{val.keyword}}</view>
			</view>
		</view> -->
		<!-- 常用分类 -->
		<!-- <view class="dailyClassify recentSearch" v-if="categoryList.length>0">
			<view class="dailyClassifyTitle recentSearchTitle">常用分类</view>
			<view class="dailyClassifyBox recentSearchBox">
				<view :class="dailyClassifyContent[Math.floor(Math.random()*3)]" v-for="(val,index) in categoryList" :key='index'
				 @click="goSearchDetails(val.keyword)">{{val}}</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchHistoryList: [], //最近搜索
				hotSearchList: [], //搜索发现
				categoryList: [], //常用分类
				dailyClassifyContent: ["dailyClassifyContent1", "dailyClassifyContent2", "dailyClassifyContent3"], //常用分类class
				searchKey:'',
				type:1,
				token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:'',
				msg:''
			}
		},
		// 监听输入框
		// onNavigationBarSearchInputChanged(val) {
		// 	console.log(val)
		// },
		// onShow() {},
		onLoad(options) {
			// if(options.type){
			// 	this.type=options.type
			// 	if(options.token){
			// 		this.token=options.token;
			// 	}
			// } 
			
			// console.log(this.$store.state.userInfo.token.token);
			// this.getSearchData();
		},
		onShow() {
      // document.forms.searchInp.input_name.focus()
			// this.getSearchData();
		},
		onNavigationBarSearchInputConfirmed(val) {
			if(val.text!=''){
				this.goSearchDetails(val.text);
			}else{
				this.$api.msg('请输入搜索关键字')
			}
			
		},
		methods: {
			getSearchData(){
				this.$api.httpRequest(
									'GET',
									this.$constant.API_HOME + 'search/hotsearch/recomSearch',
									{token: this.token}
								).then((data) => {
									console.log(data);
									this.searchHistoryList=data.searchHistoryList;
									this.hotSearchList=data.hotSearchList;
									this.categoryList=data.categoryList;
								})
			},
			goSearchDetails(val) {
				if(val==''){
						this.$api.msg('请输入搜索关键字')
						return false;
				}
				this.searchKey=val;
				// this.$api.msg('进入搜索详情页');
				uni.navigateTo({
					url:'/pages/search/searchDetails?keywords='+this.searchKey
				})
			},
			// 删除搜索记录
			del(){
				this.$api.httpRequest(
					'DELETE',
					this.$constant.API_HOME + '/search/searchhistory',
					{},
					{token:this.token}
					).then((data) => {
						this.getSearchData();			
					})
			}
		},
	}
</script>

<style lang="scss">
	.wrap {
		overflow-x: hidden;
	}
.searchInp{
	// text-align: center;
	padding: 0 20upx;
	height: 100upx;
	line-height: 100upx;
	background: #F8F8F8;
	text-align: left;
	font-size: 30upx;
	color: #999999;
	display: flex;
	justify-content:space-between;
	align-items: center;
	image{
		width: 32upx;
		height: 32upx;
		margin:0 10upx;
	}
	input{
		width: 580upx;
		background: #fff;
		border-radius: 30upx;
		height: 60upx;
		font-size: 30upx;
		padding-left: 20upx;
		// border: 1upx solid #303133;
	}
	view{
		margin-left: 10upx;
	}
}
	.recentSearch {
		margin: 48upx 30upx;
		margin-bottom: 40upx;

		.recentSearchTitle {
			font-size: 28upx;
			margin-bottom: 20upx;
			image{
				width: 32upx;
				height: 32upx;
				float: right;
			}
		}

		.recentSearchBox {
			width: 774upx;

			.recentSearchContent {
				height: 60upx;
				line-height: 60upx;
				text-align: center;
				background-color: #F8F8F8;
				border-radius: 30upx;
				display: inline-block;
				padding: 0 30upx;
				font-size: 24upx;
				margin: 15upx 0;
				margin-right: 24upx;
			}
		}

	}

	.searchFound {
		padding: 32upx 0;
		// border-top: 1px solid #E8E8E8;
		border-bottom: 1px solid #E8E8E8;
	}

	.dailyClassifyContent1,
	.dailyClassifyContent2,
	.dailyClassifyContent3 {
		display: inline-block;
		width: 112upx;
		height: 112upx;
		line-height: 112upx;
		text-align: center;
		border-radius: 50%;
		font-size: 24upx;
		background-color: #FFF5F5;
		margin: 32upx 32upx 0 0;
	}

	.dailyClassifyContent2 {
		background-color: #F3F9FD;
	}

	.dailyClassifyContent3 {
		background-color: #F4FBF3;
	}
</style>
