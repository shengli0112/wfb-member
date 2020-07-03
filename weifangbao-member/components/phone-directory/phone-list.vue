<template>
	<view>
		<scroll-view class="scroll-list"
		:scroll-top="1"
		scroll-y="true"
		:scroll-with-animation="scrollAnimationOFF" 
		:scroll-into-view="scrollViewId" 
		:style="{height:winHeight + 'px'}" 
		@scroll="handleScroll">
			<view class="phone-list">
				<view class="list-item" 
        v-if="selectList.length==0"
				v-for="(item, key) of phones" 
				:key="key" 
				:id="key">
					<view class="list-item-title" v-if="item.length>0">{{key}}</view>
					<view class="list-item-phone" 
           v-if="item.length>0"
					@click="handleClick(innerItem)"
					hover-class="commonly-hover" 
					:hover-start-time="20" 
					:hover-stay-time="70" 
					v-for="innerItem in item"
					:key="innerItem.id"
					:data-name="innerItem.name"
					:data-id="innerItem.id"
					:data-phoneNumber="innerItem.phoneNumber"
					>
					{{innerItem.fullName}}
					</view>
				</view>
        <view class="list-item" v-if="selectList.length>1">
        	<!-- <view class="list-item-title">{{key}}</view> -->
        	<view class="list-item-phone" 
        	@click="handleClick(innerItem)"
        	hover-class="commonly-hover" 
        	:hover-start-time="20" 
        	:hover-stay-time="70" 
        	v-for="innerItem in selectList"
        	:key="innerItem.id"
        	:data-name="innerItem.name"
        	:data-id="innerItem.id"
        	:data-phoneNumber="innerItem.phoneNumber"
        	>
        	{{innerItem.fullName}}
        	</view>
        </view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name:"phone-list",
		props:{
			phones:Object,
			letter:String,
			scrollAnimationOFF:Boolean,
			source:0,
			index:0,
      selectList:Array
		},
		data () {
			return {
				winHeight:0,
				scrollTop:0,
				letterDetails:[],
				timer:null
			}
		},
		computed:{
			scrollViewId () {
				return this.letter
			}
		},
		mounted(){
			
			this.winHeight = uni.getSystemInfoSync().windowHeight
			
			
			//#ifdef APP-PLUS
			this.winHeight = uni.getSystemInfoSync().windowHeight - 100
			//#endif

		},
		methods:{
			handleClick (e) {
				if(this.source==1){
					// alert('选择客户');
					console.log(this.index)
					this.$set(this.$api.prePage().userInfo[this.index],0,e)
					this.$set(this.$api.prePage().sellTime[this.index],0,'请选择时间')
          this.$set(this.$api.prePage().isToday[this.index],0,true)
          this.$set(this.$api.prePage().numStatus[this.index],0,true)
          this.$set(this.$api.prePage().mobileArr[this.index],0,e.mobile)
          this.$set(this.$api.prePage().encryptionArr[this.index],0,e.mobile.substr(0,3)+'****'+e.mobile.substr(6,10))
          this.$set(this.$api.prePage().userGender[this.index],0,e.gender)
					// console.log(this.$api.prePage().userInfo[this.index])
					// this.$api.prePage().addressId = e.id;
					uni.navigateBack()
					return ;
				}else if(this.source==2){
					this.$api.prePage().userInfo[this.index].push(e);
					this.$api.prePage().sellTime[this.index].push('请选择');
          this.$api.prePage().isToday[this.index].push(true);
          this.$api.prePage().numStatus[this.index].push(true);
          this.$api.prePage().mobileArr[this.index].push(e.mobile);
          this.$api.prePage().encryptionArr[this.index].push(e.mobile.substr(0,3)+'****'+e.mobile.substr(6,10));
          this.$api.prePage().userGender[this.index].push(e.gender);
					// this.$api.prePage().addressId = e.id;
					uni.navigateBack()
					return ;
				}
				// this.$emit('handleClick',e.target.dataset)
        uni.navigateTo({
          url:'/pages/user/addUser?id='+e.id
        })
				// uni.makePhoneCall({
				//     phoneNumber: e.mobile 
				// });
			},
			handleScroll (e){
				// if(this.letterDetails.length === 0){
				// 	let view = uni.createSelectorQuery().selectAll('.list-item')
				// 	view.boundingClientRect(data=>{
				// 		let top = data[0].top
				// 		data.forEach((item,index)=>{
				// 			item.top = item.top - top
				// 			item.bottom  = item.bottom - top
				// 			this.letterDetails.push({
				// 				id:item.id,
				// 				top:item.top,
				// 				bottom:item.bottom
				// 			})
				// 		})
				// 	}).exec()	
				// }
				
				const scrollTop = e.detail.scrollTop
				this.letterDetails.some((item,index)=>{
					if(scrollTop>=item.top && scrollTop <= item.bottom - 5){
						this.$emit('change',item.id)
						this.$emit('reset',true)
						return true
					}
				})
			}
		}
			
	}
  
</script>

<style>
	
	.commonly-hover{
		background-color: #eee;
	}
	
	.scroll-list{
		flex: 1;
		height: 100vh;
		overflow-y: hidden;
    padding-bottom: 100upx;
	}

	.phone-list{
		display: flex;
		background-color: #fff;
		flex-direction:column;
		position:relative;
		width: 100%;
	}
	
	.list-item {
		width: 100%;
		display: flex;
		align-items: center;
		flex-wrap:wrap;
		height: 92upx;
		background-color: #fff;
		height: 100%;
		
	}
	
	.list-item >.list-item-phone{
		font-weight: normal;
	}
	
	.list-item-title{
		background-color: #eee;
	}
	
	.list-item-title,.list-item-phone{
		width: 750upx;
		height: 92upx;
		line-height: 92upx;
		font-size: 32upx;
		font-weight: bold;
		padding: 0 20upx;
		border-bottom: 1px solid #e5e5e5;
	}
	
	

</style>
