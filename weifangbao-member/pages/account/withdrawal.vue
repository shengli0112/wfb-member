<template>
	<view class="content">
		<view class="content-top">
			<view class="top-text">当前金币</view>
			<view class="top-num">{{goldCount}}</view>
		</view>
		<view class="content-center">
			<view>提现方式</view>
			<view class="way">
				<view class="way-box" :class="{selectBorder1:isSelect==0}" @click="isSelect=0,raiseType=1,getBankInfo(1)">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect==0"></image>
					<image src="../../static/image/weixin.png" mode=""></image>
					微信
				</view>
				<!-- <view class="way-box" :class="{selectBorder1:isSelect==1}" @click="prompt"> -->
				<view class="way-box" :class="{selectBorder1:isSelect==1}" @click="isSelect=1,raiseType=2,getBankInfo(2)">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect==1"></image>
					<image src="../../static/image/zhifubao.png" mode=""></image>
					支付宝
				</view>
			</view>
			<view class="way-bottom" v-if="isBound==false && isSelect==0" @click="toBound()">
				<view class="bot-left">绑定后可直接提现</view>
				<view class="bot-right">立即绑定<image src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
				</view>
			</view>
			<view class="way-bottom" v-if="isBound && isSelect==0">
				<view class="bot-left">提现账号：{{nickname}}</view>
				<view class="bot-right">切换账号<image src="../../static/image/Combined%20Shape@2x.png" mode=""></image>
				</view>
			</view>
			<view class="way-bottom" v-if="isSelect==1">
				<view class="bot-left">提现账号：<input type="text" value="" placeholder="请输入支付宝账号" v-model="paymentAccount"/></view>
			</view>
		</view>
		<view class="money">
			<view class="money-title">提现金额</view>
			<view class="money-content">


				<view class="money-box" :class="{selectBorder2:isSelect2==0}" @click="isSelect2=0,raiseAmount=30">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==0"></image>
					<text class="one">30元</text>
					<text class="two">消耗30金币</text>
				</view>
				<view class="money-box" :class="{selectBorder2:isSelect2==1}" @click="isSelect2=1,raiseAmount=50">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==1"></image>
					<text class="one">50元</text>
					<text class="two">消耗50金币</text>
				</view>
				<view class="money-box" :class="{selectBorder2:isSelect2==2}" @click="isSelect2=2,raiseAmount=100">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==2"></image>
					<text class="one">100元</text>
					<text class="two">消耗100金币</text>
				</view>
				<view class="money-box" :class="{selectBorder2:isSelect2==3}" @click="isSelect2=3,raiseAmount=200">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==3"></image>
					<text class="one">200元</text>
					<text class="two">消耗200金币</text>
				</view>
				<view class="money-box" :class="{selectBorder2:isSelect2==4}" @click="isSelect2=4,raiseAmount=500">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==4"></image>
					<text class="one">500元</text>
					<text class="two">消耗500金币</text>
				</view>
				<view class="money-box" :class="{selectBorder2:isSelect2==5}" @click="isSelect2=5,raiseAmount=1000">
					<image src="../../static/image/dui.png" mode="" class="selectImg" v-if="isSelect2==5"></image>
					<text class="one">1000元</text>
					<text class="two">消耗1000金币</text>
				</view>
			</view>
		</view>
		<view class="btn" @click="submit">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isSelect: 0,
				isSelect2: 0,
				type: 0,
				token: '',
				isBound: false,
				bindType:'',
				signId:'',
				avatar:'',
				nickname:'',
				goldCount:0,
				raiseAmount:30,
				raiseType:1,
				paymentAccount:''
			}
		},
		onLoad(options) {
			this.type = options.type;
			this.token = options.token;
			this.$api.httpRequest(
			    'GET',
			    this.$constant.API_HOME+'rebate/rebatelog/rebateTotal',
			    {token:this.token}
			).then((data) => {
			  this.goldCount=data.goldCount;
			})
			this.getBankInfo(1);
		},
		methods: {
			// 获取绑定信息
			getBankInfo(type){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + '/raise/raisebind/bindDeatil', 
					{bindType:type},
					{token: this.token}
				).then((data) => {
					if (data != null) {
						this.bindType = data.bindType;
						this.signId = data.signId;
						this.avatar = data.avatar;
						this.nickname = data.nickname;
						this.isBound = true;
					} else {
						this.isBound = false;
					}
				
				})
			},
			prompt(){
				this.$api.msg('暂未开通')
			},
			getUserInfo(){
				this.$api.httpRequest(
				    'GET',
				    this.$constant.API_HOME+'rebate/rebatelog/rebateTotal',
				    {token:this.token}
				).then((data) => {
				  this.goldCount=data.goldCount;
				})
			},
			toBound(){
				if(this.type==2){
					let ret = window.android.bind(this.isSelect);
				}
			},
			submit(){
				if(this.goldCount<this.raiseAmount){
					this.$api.msg('金币余额不足');
				}else{
					let data;
					// 若选择微信提现
					if(this.raiseType==1){
						if(this.signId==''){
							this.$api.msg('请绑定账户');
							return false;
						}
					}else if(this.raiseType==2){
						if(this.paymentAccount==''){
							this.$api.msg('请输入支付宝账号');
							return false;
						}else{
							this.signId=this.paymentAccount;
						}
					}
					
					// if(this.isSelect==0){
						data={raiseType:this.raiseType,raiseAmount:this.raiseAmount,paymentAccount:this.signId}
					// }
					this.$api.httpRequest(
					    'POST',
					    this.$constant.API_HOME+'raise/raiseapply/saveRaiseApply',
						data,
					    {token:this.token}
					).then((data) => {
						this.$api.msg('申请成功');
						this.getUserInfo();
					})
				}
				
			}
			// binding() {
			// 	this.$api.httpRequest(
			// 		'GET',
			// 		'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="wx08ee80e9f6d4b6bc"&secret="00b61279b9f4b572ffb9f15ebc506933"',
			// 	).then((data) => {
			// 		console.log(data);
			// 	})
			// }
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content-top {
		padding: 30upx;
		background: #FFFFFF;

		.top-text {
			color: #999999;
			font-size: 24upx;
		}

		.top-num {
			color: #333333;
			font-size: 44upx;
		}
	}

	.content-center {
		font-size: 28upx;
		color: #666666;
		padding: 30upx;
		background: #FFFFFF;
		margin: 20upx 0;

		.way {
			display: flex;
			justify-content: space-between;

			image {
				width: 40upx;
				height: 40upx;
				margin-right: 10upx;
			}

			.way-box {
				position: relative;
				width: 328upx;
				display: flex;
				align-items: center;
				justify-content: center;
				border: 2upx solid #E8E8E8;
				margin: 22upx 0;
				padding: 28upx 0;
				border-radius: 10upx;

			}
		}

		.way-bottom {
			display: flex;
			justify-content: space-between;

			.bot-right {
				display: flex;
				align-items: center;
			}
			.bot-left{
				display: flex;
				align-items: center;
				input{
					
				}
			}
			image {
				width: 28upx;
				height: 28upx;
				margin-left: 10upx;
			}
		}
	}

	.selectImg {
		width: 38upx;
		height: 38upx;
		position: absolute;
		top: 0;
		left: 0;
		border-top-left-radius: 5upx;
	}

	.selectBorder1 {
		border: 2upx solid #F05161 !important;
	}

	.selectBorder2 {
		border: 2upx solid #F05161 !important;

		.one,
		.two {
			color: #F05161 !important;
		}

	}

	.money {
		padding: 30upx;
		background: #FFFFFF;

		.money-title {
			color: #666666;
			font-size: 28upx;
		}

		.money-content {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.money-box {
				position: relative;
				width: 328upx;
				display: flex;
				flex-direction: column;
				text-align: center;
				margin: 15upx 0;
				border: 2upx solid #E8E8E8;
				border-radius: 10upx;

				.one {
					font-size: 32upx;
					padding: 10upx;
					color: #333333;
				}

				.two {
					font-size: 20upx;
					padding-bottom: 10upx;
					color: #999999;
				}
			}
		}

	}

	.btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		font-size: 30upx;
		color: #FFFFFF;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
		background: #F05161;
	}
</style>
