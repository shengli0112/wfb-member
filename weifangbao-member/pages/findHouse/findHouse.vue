<template>
	<view class="wrap">
		<view class="content">
		<view class="selectBox">
      <view class="selectList">
      	<view class="selectLeft">首付预算</view>
      	<view class="selectRight">
      			<input type="text" v-model="price"  class='rightContent' placeholder="请输入首付预算(单位元)"/>
      	</view>
      </view>
      <view class="selectList">
      	<view class="selectLeft">户型</view>
      	<view class="selectRight">
      		<picker mode="selector" :value="modelId"  @change="changeModel" :range='modelArr' range-key="remark">
      		  <view class="uni-input selectPicker">{{saleApartment}}</view>
      		</picker>
      	</view>
      </view>
			<view class="selectList">
				<view class="selectLeft">区域</view>
				<view class="selectRight">
					<!-- <picker mode="selector" :value="addressId"  @change="changeaddress" :range='addressArr' range-key="remark">
					  <view class="uni-input selectPicker">{{address}}</view>
					</picker> -->
          <!-- <picker @change="bindPickerChange" :value="index" :range="addressArr" mode=multiSelector @columnchange="getNext" @cancel="cancel">
          	<view class="uni-input">{{address}}</view>
          </picker> -->
          <picker @change="bindPickerChange" :value="addressIndex" :range="addressArr" mode=multiSelector @columnchange="getNext" @cancel="cancel">
          	<view class="uni-input">{{address}}</view>
          </picker>
				</view>
			</view>

			<view class="selectList2">
				<view class="selectLeft">备注</view>
				<view class="selectRight">
						<textarea  v-model="userNote"  class='rightContent' placeholder="请输入备注"/>
				</view>
			</view>

		</view></view>
		<!-- <view class="stateBox">
      <view class="stateBtn" :class="[hasInfo?'isSelect':'']" @click="cancleFind(),hasInfo=true">启用</view>
      <view class="stateBtn" :class="[!hasInfo?'isSelect':'']" @click="cancleFind(),hasInfo=false">停用</view>
    </view> -->
		<view class="submit" @click="upload()">确定</view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
        userNote:'',
        pId:0,//一级区域id
				addressId:'',//选中二级区域id
				addressArr:[[],[]],
				saleApartment:'请选择户型',
				sellStateId:0,
				sellAddressId:'',
				price:'',//参考均价
				modelId:'',
				address:'请选择所在区域',
				modelArr:[],
        addressIndex:[0,0],
        addressIdArr:[],//1级
        addressIdArr1:[],//2级
        hasInfo:false,
        findHouseId:'',
				}
		},
		onLoad(options) {
			this.getSelectId();
      this.getFindInfo();
      this.getAreaList();
		},
		methods: {
      cancel(){
      	this.address="请选择地址";
      },
      cancleFind(){
        this.$api.httpRequest(
        	'PUT',
        	this.$constant.API_HOME + 'property/helpfindhouse',{
        		id:this.findHouseId,
        	  status:this.hasInfo?0:1
        	}, {
        		token: this.$store.state.userInfo.token.token
        	}
        ).then((data) => {
        	console.log(data);
          this.hasInfo=!hasInfo;
          this.$api.msg('提交成功！')
          // this.areaId='';
          // this.address='请选择所在区域',
          // this.price='';
          // this.saleApartment='请选择户型';
        	// uni.navigateBack();
        // this.editorList=data;
        })
      },
      getNext(e){
        // 获取二级区域
        console.log(e.target.column,e.target.value)
        this.$set(this.addressIndex,e.target.column,e.target.value)
        if(e.target.column==0){
          this.pId=this.addressIdArr[e.target.value]
          this.getAreaList(this.pId,2)
        }
      },
			bindPickerChange:function(e) {
        // 选中并确定
        this.index=e.target.value
        this.address=this.addressArr[0][this.index[0]]+this.addressArr[1][this.index[1]];
        this.addressId=this.addressIdArr1[this.index[1]]
        console.log(this.addressId)
			},
			changeModel(e){
				console.log(e)
				this.modelId=e.target.value
				this.saleApartment=this.modelArr[this.modelId].remark
			},
      getFindInfo(){
        this.$api.httpRequest(
        	'GET',
        	this.$constant.API_HOME + 'property/helpfindhouse/info',{
        	},
          // {
          //   token:'d8f73b67fbe34f36a129d24c5f1b9899'
          // }
          {
        		token: this.$store.state.userInfo.token.token
        	}
        ).then((data) => {
        	console.log(data);
          if(data.status==1){
            this.hasInfo=true
          }
            this.findHouseId=data.id
          this.addressId=data.areaId;
          this.price=data.budget;
          this.saleApartment=data.apartment;
          this.address=data.areaName;
          this.userNote=data.remark
        	// uni.navigateBack();
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
					}else if(data[0].dictType=="area"){
						console.log(data)
						// this.addressArr=data;
						// this.areaId=this.addressArr[this.addressId].id
					}else if(data[0].dictType=="sale_apartment"){
						console.log(data)
						// 售卖户型
						this.modelArr=data;
					}

				// this.editorList=data;
				})
			},
      getAreaList(pId=0,leavl=1){
        this.$api.httpRequest(
        	'GET',
        	this.$constant.API_HOME + 'property/propertyregion/list',{
            parentId:pId
        	},
          {
        		token: this.$store.state.userInfo.token.token
        	}
        ).then((data) => {
        	console.log(data);
          // this.addressArr=data;
          if(pId==0){
            this.getAreaList(data[0].id,2)
            for(var i=0;i<data.length;i++){
              this.$set(this.addressArr[0],i,data[i].regionName);
              this.$set(this.addressIdArr,i,data[i].id)
            }
          }
          if(leavl==2){
            this.$set(this.addressArr,1,[])
            for(var j=0;j<data.length;j++){
              console.log(data[j].regionName)
              this.$set(this.addressArr[1],j,data[j].regionName)
              this.$set(this.addressIdArr1,j,data[j].id)
            }
            console.log(this.addressArr)
          }
        })
      },
			upload(){
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'property/helpfindhouse',{
						areaId:this.addressId,
						budget:this.price,
						apartment:this.saleApartment,
            remark:this.userNote
					}, {
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					console.log(data);
         this.$api.msg('提交成功！')
					// uni.navigateBack();
				// this.editorList=data;
				})
			}

		},

	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: #fff;
	}
	.content{
		border-top: 2upx solid #E8E8E8;
		// padding:30upx;

	}
	.submit{
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		background: #3171F2;
		color: #fff;
		margin: 70upx auto;
		font-size: 34upx;
		border-radius: 8upx;
	}
	.selectBox{
		margin: 0 auto;
	}
  .selectList2{
    height: 250upx;
    display: flex;
    align-items: top;
    background: #fff;
    // color: #333;
    padding: 20upx 0;
    border-bottom: 1upx solid #F1F1F1;
    .selectLeft{
    	width: 200upx;
    	text-align: right;
    	box-sizing: border-box;
    	padding-right: 30upx;
      font-size: 32upx;
    }
    .selectRight{
      width: 500upx;
      height: 100%;
      .rightContent{
        width: 100%;
        height: 100%;
        border: 1upx solid #F1F1F1;
        padding: 10upx;
      }

    }
  }
	.selectList{
	 font-size: 32upx;
		height: 100upx;
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #E8E8E8;
		background: #fff;
		.selectLeft{
			width: 200upx;
			text-align: right;
			box-sizing: border-box;
			padding-right: 30upx;
		}
		.selectRight{
			width: 500upx;
			height: 100%;
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
		}
	}
	.labelBox{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30upx 20upx 0 20upx;
		border: 1upx solid #DCDFE6;
		background: #FFFFFF;
		margin: 20upx auto;
		.labelList{
			width: 30%;
			text-align: center;
			height: 60upx;
			line-height: 60upx;
			border-radius: 30upx;
			border: 1upx solid #DCDFE6;
			color: #999999;
			font-size: 28upx;
			background: #fff;
			margin-bottom: 30upx;
		}
		.labelList1{
			background: #E54D42;
			color: #fff;
		}
	}
  // <view class="stateBox">
  //   <view class="stateBtn" :class="[hasInfo?'isSelect':'']" @click="cancleFind()">启用</view>
  //   <view class="stateBtn" :class="[!hasInfo?'isSelect':'']" @click="cancleFind()">停用</view>
  // </view>
  .stateBox{
    display:flex;
    justify-content: space-between;
    width: 200upx;
    height: 50upx;
    align-items: center;
    // line-height: 50upx;
    margin-left: 520upx;
    border-radius: 25upx;
    border: 1upx solid #3171F2;
    overflow: hidden;
    .stateBtn{
      width: 100upx;
      height: 50upx;
      line-height: 50upx;
      text-align: center;
      font-size: 32upx;
    }
  }
  .isSelect{
    color: #fff;
    background: #3171F2;
  }
</style>
