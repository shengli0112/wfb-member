<template>
	<view class="phone-main" :style="{height: winHeight + 'px'}">
		<view class="phone-main-search">
			<!-- <navigator :url="'/components/phone-directory/pages/phones/phone-search?phones=' + phonesEscape" hover-class="none"> -->
				<input class="phone-main-input" type="text" placeholder="请输入要搜索的联系人" @input="handleInput"/>
<!-- 			</navigator>-->
 		</view>
		<view class="phoneDirectory">
			<phone-list 
      class="userList"
			:phones="phones"
      :selectList="selectList"
			:letter="letter"
			:source='source'
			:index='index'
			:scrollAnimationOFF="scrollAnimationOFF" 
			@change="handlePhoneListIndex"
			@reset="handleReset"
			@handleClick="handleClick"
			>
			</phone-list>
			<phone-alphabet
       class="alpgbetList"
			:phones="phones"
			:phoneListIndex="phoneListIndex"
			@change="handleDatasetKey" 
			@scrollAnimationOFF="handleScrollAnimationOFF"
			@reset="handleReset"
			>
			</phone-alphabet>
		</view>
	</view>
</template>

<script>
	import phoneList from './phone-list.vue'
	import phoneAlphabet from './phone-alphabet.vue'
	
	export default {
		name:"phone-directory",
		components:{
			phoneList,
			phoneAlphabet
		},
		props:{
			phones:Object,
			default:false,
			source:0,
			index:0
		},
		data () {
			return {
				winHeight:0,
				letter : 'A',
				scrollAnimationOFF:true,
				phoneListIndex:'A',
				reset:true,
        keyword:'',
        list:[],
        timer:null,
        selectList:[]
			}
		},
		computed:{
			phonesEscape () {
				return escape(JSON.stringify(this.phones))
			}
		},
		mounted () {
     
			let windowHeight = uni.getSystemInfoSync().windowHeight
			
			// #ifndef APP-PLUS
			this.winHeight = windowHeight
			//#endif
			
			//#ifdef APP-PLUS
			this.winHeight = windowHeight - 56
			//#endif
			
 			if(!this.phones){
				uni.showToast({
					title: '没有数据',
					icon:"none",
					mask: false,
					duration: 1500
				})
			}
		},
    watch:{
    	keyword () {
        console.log('sousuozhi')
    		if(this.timer) {
    			clearTimeout(this.timer)
    		}
    		if(!this.keyword){
          this.selectList=[]
    			// this.list = []
    			return
    		}
    		this.timer = setTimeout(()=>{
    			const result = []
    			for (let i in this.phones){
    				this.phones[i].forEach((item)=>{
    					if(item.fullName.indexOf(this.keyword) > -1||item.firstSpelling.indexOf(this.keyword) > -1){
    						result.push(item)
    					}
    				})
    			}
          console.log(result)
          // console.log(this.phones)
          this.selectList=result
         // for(var key in this.phones){
         //   for(var i=0;i<this.phones[key].length;i++){
         //     for(var j=0;j<result.length;j++){
         //       if(this.phones[key][i].id!=)
         //     }
         //   }
         // }
    			// this.phones = result
    		},100)
    	}
    },
		methods:{
      handleInput (e) {
      	this.keyword = e.detail.value
        console.log(e.detail.value)
      },
			handleClick (e) {
				this.$emit('paramClick',e)
			},
			handleDatasetKey (val) {
				this.letter = val
			},
			handleScrollAnimationOFF (val) {
				this.scrollAnimationOFF = val
			},
			handlePhoneListIndex(val){
				if(this.reset){
					this.phoneListIndex = val
				}
			},
			handleReset (val){
				if(val){
					this.letter = ''
				}
				this.reset = val
			}
			
		}
	}
 
</script>

<style>
.phone-main{
	display: flex;
	flex-direction: column;
	overflow: hidden;
}
.phoneDirectory{
	display: flex;
	flex-direction: row;
}
.userList{
  width: 750upx;
}
.alpgbetList{
  position: fixed;
  top: 80upx;
  right: 0upx;
}
.phone-main-search{
	background-color: #fff;
	padding: 10upx 20upx;
	border-bottom: 1px solid #e5e5e5;
}

.phone-main-input{
	font-size:28upx;
	border: 1px solid #e5e5e5;
	border-radius: 3px;
	padding: 10upx 20upx 10upx 20upx;
   height: 70upx !important;
}
</style>
