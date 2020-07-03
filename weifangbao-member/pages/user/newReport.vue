<template>
	<view class="wrap">
		<view class="content" v-for="(item,index) in dataList" :key='index'>
		<view class="selectBox">
			<view class="selectList">
				<view class="selectLeft" @click="navToHouseList">楼盘</view>
				<view class="selectRight">
					<!-- <picker mode="selector" @change="changehouses" :range='housesArr' range-key="propertyName" >
					  <view class="uni-input selectPicker" @click="changeIndex(index)">{{propertyName[index]}}</view>
					</picker> -->
          <view class="userName" :class="[propertyName[index]!='从楼盘列表选择'?'userName1':'']" @click="navToHouseList(index)">
          	{{propertyName[index]}}
          </view>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">客户</view>
				<view class="selectRight" @click="navToUserList(1,index)">
					<view class="userName" @click="changeIndex(index)">
						从客户列表选择
					</view>
				</view>
			</view>
		</view>

		<view class="userInfo" v-for="(val1,index1) in userInfo[index]" :key='index1'>

			<view class="listBox">
				<view class="listLeft">
					<image src="../../static/img/myUser.png" mode=""></image>
					<view class="nameText"><input type="text" v-model='val1.fullName'></view>
				</view>
				<view class="listRight">
					<view class="women" :class="[userGender[index][index1]==1?'man':'']" @click="changeGender(index,index1,1)">男士</view>
					<view class="women" :class="[userGender[index][index1]==2?'man':'']" @click="changeGender(index,index1,2)">女士</view>
				</view>
			</view>
    <view class="listBox">
    	<view class="listLeft">
    		<image src="../../static/img/phone.png" mode=""></image>
        <view class="phText" v-if="numStatus[index][index1]"><input type="number" maxlength="11"  v-model='mobileArr[index][index1]'></view>
       <view class="phText" v-else>{{encryptionArr[index][index1]}}</view>
    	</view>
    <view class="listRight2">
      <label class="radio" @click='changeNumStatus(index,index1)'><radio value="r1" :checked="numStatus[index][index1]" color="#3171F2" style="transform:scale(0.7)"/>全号报备</label>
     </view>
    </view>

			<view class="listBox">
				<view class="listLeft">
					<image src="../../static/img/clock.png" mode=""></image>
					<!-- <view class="phText">明天 15:00</view> -->
					<view class="phText">
						<picker style="width: 330upx;" mode="time"  @change="bindDateChange">
						  <view class="uni-input selectPicker" @click="changeIndex(index,index1)">{{sellTime[index][index1]}}</view>
						</picker>
					</view>
				</view>
        <view class="listRight">
        	<view class="women" :class="[isToday[index][index1]?'man':'']" @click="changeData(index,index1,true)">今天</view>
        	<view class="women" :class="[!isToday[index][index1]?'man':'']" @click="changeData(index,index1,false)">明天</view>
        </view>
			</view>

		</view>
		<view class="addUser" @click="navToUserList(2,index)">
			<!-- <view class="addIcon">+</view> -->
			<view class="addText">从客户列表添加客户</view>
		</view>
    <view class="addUser" @click="navToUserList(3,index)">
    	<!-- <view class="addIcon">+</view> -->
    	<view class="addText">手动添加客户</view>
    </view>
		</view>
		<view class="addHouses" @click="addHouses">
			添加楼盘
		</view>
		<view class="submit" @click="upload()">提交</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
        numStatus:[[]],//是否加密
        mobileArr:[[]],//加密前的联系方式
        encryptionArr:[[]],//加密后的联系方式
        userGender:[[1]],//用户性别
        isMan:true,
				houseIndex:0,
				housesId:0,
				userIndex:0,
				housesArr:[],
				propertyName:['从楼盘列表选择'],
				userName:'从客户列表选择',
				userInfo:[[]],
				sellTime:[['请选择时间']],
        today:'',
        nextDay:'',
        isToday:[[true]],
				dataList:[{
						propertyId:'',
						reportCustomers:[{customerId:'',appointTime:'',isSecret:'',customerName:'',customerGender:'',mobile:''}],
					}],//提交新增报备
				}
		},
		onShow(){
      console.log(this.dataList)
			console.log(this.userInfo)
			// if(this.userInfo){
			// 	this.userName=this.userInfo.fullName
			// }

		},
		onLoad(options) {
      var date = new Date();
      this.today=date.getFullYear()+'-'+ (date.getMonth()+1) +'-'+date.getDate()
     var date2 = new Date();
     date2.setTime(date2.getTime()+24*60*60*1000);
     this.nextDay = date2.getFullYear()+"-" + (date2.getMonth()+1) + "-" + date2.getDate();
      console.log(this.today);
      console.log(this.nextDay)
      if(options.id && options.houseName){
        this.dataList[this.houseIndex].propertyId=options.id;
        this.propertyName[0]=options.houseName;
      }

      // this.propertyId=options.id;
      // this.propertyName=options.houseName;
			this.getSelectId();
			this.getHouseList()
		},
		methods: {
      navToHouseList(index){
        uni.navigateTo({
          url:'/pages/user/houseList?index='+index
        })
      },
      changeNumStatus(index,index1){
        if(this.mobileArr[index][index1].length!=11){
          this.$api.msg('请输入正确格式的手机')
          return false;
        }
        this.$set(this.numStatus[index],index1,!this.numStatus[index][index1])
        this.$set(this.encryptionArr[index],index1,this.mobileArr[index][index1].substr(0,3)+'****'+this.mobileArr[index][index1].substr(6,10))
        console.log(this.numStatus);
      },
      changeGender(index,index1,gender){
        // 修改客户性别
        this.$set(this.userGender[index],index1,gender)
      },
      changeData(index,index1,status){
        this.$set(this.isToday[index],index1,status)
        console.log(this.isToday);
        // if(this.isToday[this.houseIndex][this.userIndex]){
        //   const timer = this.today+' '+e.target.value
        //   this.$set(this.sellTime[this.houseIndex],this.userIndex,timer)
        // }else{
        //   const timer = this.nextDay+' '+e.target.value
        //   this.$set(this.sellTime[this.houseIndex],this.userIndex,timer)
        // }
        // this.$set(this.sellTime[index],index1,)
      },
			bindDateChange: function(e) {
        this.$set(this.sellTime[this.houseIndex],this.userIndex,e.target.value)
				console.log(this.userIndex)
        // if(this.isToday[this.houseIndex][this.userIndex]){
        //   const timer = this.today+' '+e.target.value
        //   this.$set(this.sellTime[this.houseIndex],this.userIndex,e.target.value)
        // }else{
        //   const timer = this.nextDay+' '+e.target.value
        //   this.$set(this.sellTime[this.houseIndex],this.userIndex,timer)
        // }


        console.log(this.sellTime)
				console.log(this.dataList)
			},
			navToUserList(source,index){
       if(source==2 && this.userInfo[index].length==2){
         this.$api.msg('最多添加两位客户！')
         return false;
       }
       if(source!=3){
         uni.navigateTo({
         	url:'/pages/user/myUser?source='+source+'&index='+index
         })
       }else{
         let e={fullName:'',mobile:'',id:'',gender:1};
         this.numStatus[index].push(true)
         this.userGender[index].push(1)
         this.mobileArr[index].push('')
         this.encryptionArr[index].push('')
         this.userInfo[index].push(e); console.log(this.userInfo)
         this.sellTime[index].push('请选择时间')
       }


			},
			changehouses(e){
				console.log(this.dataList[this.houseIndex].propertyId)
				this.$set(this.propertyName,this.houseIndex,this.housesArr[e.target.value].propertyName)
        this.dataList[this.houseIndex].propertyId=this.housesArr[e.target.value].id
        // 楼盘id传入dataList
        // this.$set(this.dataList[this.houseIndex],propertyId,this.housesArr[e.target.value].id)
        console.log(this.dataList)
			},
			changeIndex(index,index1=0){
				console.log(index1)
				this.houseIndex=index
				this.userIndex=index1
			},
			addHouses(){
				this.userInfo.push([])
				this.propertyName.push('从楼盘列表选择')
				this.sellTime.push([])
        this.isToday.push([])
        this.numStatus.push([])
        this.userGender.push([])
        this.mobileArr.push([])
        this.encryptionArr.push([])
				const addHouse={
						propertyId:'',
						reportCustomers:[{customerId:'',appointTime:'',isSecret:'',customerName:'',customerGender:'',mobile:''}],
					}
				this.dataList.push(addHouse)
			},
			getHouseList(){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'property/property/user/page',{
					page:1,
					limit:10,
					propertyStatus:0
					},
					// {token:'6b712905bb204216bb6b344df38b70f8'}
					{
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					console.log(data);
					this.housesArr=data.list;
					// if(pId==0){
					// 	console.log(data);
					// 	for(var i=0;i<data.length;i++){
					// 		this.getSelectId(data[i].id)
					// 	}
					// }else if(data[0].dictType=="building_structure"){
					// 	console.log(data)
					// 	// 建筑结构
					// 	this.housesArr=data;
					// }
				// this.editorList=data;
				})
			},
			getSelectId(pId=0){
				this.$api.httpRequest(
					'GET',
					this.$constant.API_HOME + 'common/dictList',
					{pid:pId}
				).then((data) => {
					if(pId==0){
						console.log(data);
						for(var i=0;i<data.length;i++){
							this.getSelectId(data[i].id)
						}
					}else if(data[0].dictType=="building_structure"){
						console.log(data)
						// 建筑结构
						// this.housesArr=data;
					}

				// this.editorList=data;
				})
			},
			upload(){
        const appointTime=JSON.parse(JSON.stringify(this.sellTime));
				for(var i=0;i<this.dataList.length;i++){
					for(var j=0;j<this.userInfo[i].length;j++){
            if(this.sellTime[i][j]=='请选择时间'){
              this.$api.msg('请选择时间')
              return;
            }
            if(this.isToday[i][j]){
              this.$set(appointTime[i],j,this.today+' '+this.sellTime[i][j])
            }else{
              this.$set(appointTime[i],j,this.nextDay+' '+this.sellTime[i][j])
            }
						const e={customerId:'',appointTime:'',isSecret:'',customerName:'',customerGender:'',mobile:''};
						this.dataList[i].reportCustomers.push(e)
						this.dataList[i].reportCustomers[j].customerId=this.userInfo[i][j].id?this.userInfo[i][j].id:'';
						this.dataList[i].reportCustomers[j].appointTime=appointTime[i][j];
						this.dataList[i].reportCustomers.length=this.userInfo[i].length;
            this.dataList[i].reportCustomers[j].isSecret=this.numStatus[i][j]?0:1;
            this.dataList[i].reportCustomers[j].customerName=this.userInfo[i][j].fullName;
            this.dataList[i].reportCustomers[j].customerGender=this.userGender[i][j];
            this.dataList[i].reportCustomers[j].mobile=this.mobileArr[i][j];
					}
				}
        for(var a=0;a<this.dataList.length;a++){
          if(this.dataList[a].propertyId==''){
            this.$api.msg('请选择楼盘')
            return;
          }
          for(var b=0;b<this.dataList[a].reportCustomers.length;b++){
            if(this.dataList[a].reportCustomers[b].mobile=='' || this.dataList[a].reportCustomers[b].customerName==''){
              this.$api.msg('请补全客户信息')
              return;
            }
            if(this.dataList[a].reportCustomers[b].mobile.length!=11){
              this.$api.msg('请填写正确格式的联系方式')
              return;
            }
          }
        }
				console.log(this.dataList);
				// return;
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'report/report/batch',
					JSON.stringify(this.dataList)
					,
					// {token:'6b712905bb204216bb6b344df38b70f8'}
					{
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					console.log(data);
          this.$api.msg('提交成功');
          setTimeout(function() {
            uni.navigateBack();
          }, 1500);
				// this.editorList=data;
				})
			},
		},

	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: #F8F8F8;
	}
	.content{
		background: #fff;
		border-bottom: 1upx solid #fff;
	}
	.submit{
		margin: 40upx auto;
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		text-align: center;
		background: #3171F2;
		color: #fff;
	}
	.titleBox{
		display: flex;
		.titleList{
			width: calc(100% / 3);
			text-align: center;
			padding: 20upx 0;
			font-size: 28upx;
		}
	}
	.uploadBtn{
		// width: 95%;
		margin: 20upx auto;
		font-size: 120upx;
		background: #EEEEEE;
		color: #fff;
		text-align: center;
		height: 250upx;
		line-height: 250upx;
	}
	.effectImg{
		position: relative;
		image{
			width: 100%;
			height: 250upx;
		}
		.delBtn{
			width: 50upx;
			height: 50upx;
			text-align: center;
			line-height: 50upx;
			position: absolute;
			right: 5upx;
			top: 5upx;
			font-size: 40upx;
			font-weight: 550;
			background: rgba(0,0,0,0.5);
			border-radius: 50%;
			color: #D6D6D6;
			z-index: 111;
		}
	}
	.apartmentPictures{
		width: calc(100% / 3);
		padding: 10upx;
		border: 1upx solid #303133;
		display: inline-block;
		image{
			width: 100%;
			height: 200upx;
		}
		.delBtn{
			width: 30upx;
			height: 30upx;
			text-align: center;
			line-height: 30upx;
			position: absolute;
			right: 5upx;
			top: 5upx;
			font-size: 20upx;
			font-weight: 550;
			background: rgba(0,0,0,0.5);
			border-radius: 50%;
			color: #D6D6D6;
			z-index: 111;
		}
	}
	.selectBox{
		// margin: 20upx auto;
	}
	.selectList{
		width: 100%;
		padding: 0 30upx;
	    font-size: 32upx;
		height: 100upx;
		display: flex;
		align-items: center;
		// border: 1upx solid #DCDFE6;
		background: #fff;
		.selectLeft{
			width: 200upx;
			text-align: left;
			box-sizing: border-box;
			padding-right: 30upx;
		}
		.selectRight{
			width: 500upx;
			height: 100%;
			text-align: right;
			picker{
				height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
			}
			.rightContent{
				width: 100%;
				height: 100%;
			}
			.userName{
				// width: 400upx;
				height: 100upx;
				line-height: 100upx;
				color: #CCCCCC;
				// border: 1upx solid #0190A0;
			}
      .userName1{
        color: #333333;
      }
		}
	}
	.userInfo{
		width: 690upx;
		margin: 26upx auto;
		background: #F8F8F8;
		border-radius: 8upx;
	}
	.listBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 28upx;
		padding: 30upx;
		.listLeft{
			display: flex;
			align-items: center;
			image{
				width: 32upx;
				height: 32upx;
				margin-right: 14upx;
			}
		}
		.listRight,.listRight2{
			display: flex;
			align-items: center;
      border-radius: 8upx;
      overflow: hidden;
      border: 1upx solid #3171F2;
		}
		.listRight2{
      border: 0;
    }
		.women{
			background: #fff;
			color: #3171F2;
			text-align: center;
			width: 103upx;
			height: 50upx;
			text-align: center;
			line-height: 50upx;
		}
    .man{
    	background: #3171F2;
    	color: #fff;
    	width: 103upx;
    	height: 50upx;
    	text-align: center;
    	line-height: 50upx;
    }
	}
	.addUser{
		width: 690upx;
		height: 90upx;
		padding: 0 30upx;
		color: #3171F2;
		background: #EFF4FF;
		box-sizing: border-box;
		margin: 42upx auto;
		font-size: 28upx;
		border-radius: 8upx;
		display: flex;
		align-items: center;
		.addIcon{
			border-radius: 50%;
			height: 29upx;
			width: 29upx;
			line-height: 29upx;
			font-size: 24upx;
			border: 1upx solid #3171F2;
			text-align: center;
			margin-right: 20upx;
		}
	}
	.addHouses{
		width: 690upx;
		height: 90upx;
		text-align: center;
		line-height: 90upx;
		color: #3171F2;
		background: #EFF4FF;
		border: 1upx solid #3171F2;
		border-radius: 8upx;
		margin: 32upx auto;
		font-szie: 34upx;
	}
</style>
