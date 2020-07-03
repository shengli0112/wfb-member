<template>
	<view>
		<view class="notice-item" v-for="(val,index) in messageList" :key='index' @click="navToUrl(val.url)">
			<text class="time">{{val.createDate}}</text>
			<view class="content">
				<text class="title">{{val.title}}</text>
			<!-- 	<view class="img-wrapper">
					<image class="pic" :src="val.image"></image>
				</view> -->
				<text class="introduce">
				{{val.content}}
				</text>
			<!-- 	<view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view> -->
			</view>
		</view>
	<!-- 	<view class="notice-item">
			<text class="time">昨天 12:30</text>
			<view class="content">
				<text class="title">新品上市，全场满199减50</text>
				<view class="img-wrapper">
					<image class="pic" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3761064275,227090144&fm=26&gp=0.jpg"></image>
					<view class="cover">
						活动结束
					</view>
				</view>
				<view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view>
			</view>
		</view> -->
		<!-- <view class="notice-item">
			<text class="time">2019-07-26 12:30</text>
			<view class="content">
				<text class="title">新品上市，全场满199减50</text>
				<view class="img-wrapper">
					<image class="pic" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1556465765776&di=57bb5ff70dc4f67dcdb856e5d123c9e7&imgtype=0&src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01fd015aa4d95fa801206d96069229.jpg%401280w_1l_2o_100sh.jpg"></image>
					<view class="cover">
						活动结束
					</view>
				</view>
				<text class="introduce">新品上市全场2折起，新品上市全场2折起，新品上市全场2折起，新品上市全场2折起，新品上市全场2折起</text>
				<view class="bot b-t">
					<text>查看详情</text>
					<text class="more-icon yticon icon-you"></text>
				</view>
			</view>
		</view> -->
		<uni-load-more :status="loadingType"></uni-load-more>
	</view>
</template>

<script>
		import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
		  uniLoadMore
		},
		data() {
			return {
					page:1,
					messageList:[],
					loadingType: 'more', //加载更多状态
			}
		},
			onLoad(options) {
				this.getMessageList()
			},
			//加载更多
			onReachBottom(){
			// this.loadData();
			if(this.loadingType === 'nomore'){
				return;
			}
			this.page++;
			this.getMessageList();
			
			  },
		methods: {
							getMessageList(){
								this.$api.httpRequest(
										'GET',
										this.$constant.API_HOME+'message/messageuser/page',
										{page:this.page,limit:10},
										{token:this.$store.state.userInfo.token.token}
									).then((data) => {
										console.log(data)
										this.readNewMsg();
										this.page==Math.ceil(data.total/10)? this.loadingType  ='nomore' : this.loadingType = 'more';
										data.total==0?this.loadingType='nomore':''
										if(this.page!=1){
											for(var i=0;i<data.list.length;i++){
												this.messageList.push(data.list[i]);
											}
										}else{
											this.messageList=data.list;
										}
									});
							},
							readNewMsg(){
								this.$api.httpRequest(
										'POST',
										this.$constant.API_HOME+'message/messageuser/readAll',
										{},
										{token:this.$store.state.userInfo.token.token}
									).then((data) => {
										console.log(data)
									});
							},
							navToUrl(url){
								location.href=url
							},
		}
	}
</script>

<style lang='scss'>
	page {
		background-color: #f7f7f7;
		padding-bottom: 30upx;
	}

	.notice-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 80upx;
		padding-top: 10upx;
		font-size: 26upx;
		color: #7d7d7d;
	}

	.content {
		width: 710upx;
		padding: 0 24upx;
		background-color: #fff;
		border-radius: 4upx;
	}

	.title {
		display: flex;
		align-items: center;
		height: 90upx;
		font-size: 32upx;
		color: #303133;
	}

	.img-wrapper {
		width: 100%;
		height: 260upx;
		position: relative;
	}

	.pic {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: 6upx;
	}

	.cover {
		display: flex;
		justify-content: center;
		align-items: center;
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .5);
		font-size: 36upx;
		color: #fff;
	}

	.introduce {
		display: inline-block;
		padding-bottom: 16upx;
		font-size: 28upx;
		color: #606266;
		line-height: 38upx;
	}

	.bot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80upx;
		font-size: 24upx;
		color: #707070;
		position: relative;
	}

	.more-icon {
		font-size: 32upx;
	}
</style>
