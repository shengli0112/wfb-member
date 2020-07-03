<template>
	<view class="wrap">
		<view class="titleBox">
      <!-- 楼盘状态 0 无 1待审核 2审核通过 3驳回 4上架 5下架 -->
			<view class="titleList" :class="[propertyStatus==0?'titleList1':'']" v-if='propertyStatus!=3'>1.填写资料</view>
      <view class="titleList" :class="[propertyStatus==3?'titleList1':'']" v-else>1.重新提交</view>
			<view class="titleList" :class="[propertyStatus==1?'titleList1':'']">2.等待审核</view>
			<view class="titleList" :class="[propertyStatus==2?'titleList1':'']" v-if="propertyStatus==2">3.审核通过</view>
      <view class="titleList" :class="[propertyStatus==5?'titleList1':'']" v-else-if="propertyStatus==5">3.已下架</view>
      <view class="titleList" :class="[propertyStatus==4?'titleList1':'']" v-else>3.已上架</view>
		</view>
		<view class="content">
			<view class="effect">
				<view class="effectTitle">
		效果图
				</view>
				<view class="effectImg" v-for="(val,index) in effectImg" :key='index'>
					<view class="delBtn" @click="delEffectImg(index)" v-if="propertyStatus==0 || propertyStatus==3">×</view>
					<image :src="val" mode=""></image>
				</view>
			<view class="uploadBtn" @click="upLoadImg()" v-if="propertyStatus==0 || propertyStatus==3">+</view>
			</view>
		<view class="selectBox">
			<view class="selectList">
				<view class="selectLeft">所在区域</view>
				<view class="selectRight">
					<!-- <picker mode="selector" :value="addressId"  @change="changeaddress" :range='addressArr' range-key="remark">
					  <view class="uni-input selectPicker">{{addressArr[addressId].remark}}</view>
					</picker> -->
          <picker @change="bindPickerChange" :value="addressIndex" :range="addressArr" mode=multiSelector @columnchange="getNext" @cancel="cancel">
          	<view class="uni-input">{{address}}</view>
          </picker>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">楼盘名称</view>
				<view class="selectRight">
					<input type="text" v-model="housesName"  class='rightContent' placeholder="请输入"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">楼盘简介</view>
				<view class="selectRight">
						<input type="text" v-model="housesDetail"  class='rightContent' placeholder="请输入"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">最小建面</view>
				<view class="selectRight">
					<input type="number" v-model="smallArea"  class='rightContent' placeholder="请输入(单位㎡)"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">最大建面</view>
				<view class="selectRight">
						<input type="number" v-model="bigArea"  class='rightContent' placeholder="请输入(单位㎡)"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">参考均价</view>
				<view class="selectRight">
						<input type="number" v-model="price"  class='rightContent' placeholder="请输入(单位元)"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">参考总价</view>
				<view class="selectRight">
						<input type="number" v-model="allPrice"  class='rightContent' placeholder="请输入(单位万元)"/>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">佣金</view>
				<view class="selectRight">
						<input type="number" v-model="commission"  class='rightContent' placeholder="请输入(单位元)"/>
				</view>
			</view>
			<!-- <view class="selectList">
				<view class="selectLeft">建筑结构</view>
				<view class="selectRight">
					<picker mode="selector" :value="structureId"  @change="changeStructure" :range='structureArr' range-key="remark">
					  <view class="uni-input selectPicker">{{buildingStructure}}</view>
					</picker>
				</view>
			</view> -->
			<view class="selectList">
				<view class="selectLeft">售卖状态</view>
				<view class="selectRight">
					<picker mode="selector" :value="sellStateId"  @change="changeSellState" :range='sellStateArr' range-key="remark">
					  <view class="uni-input selectPicker">{{saleStatus}}</view>
					</picker>
				</view>
			</view>
			<view class="selectList">
				<view class="selectLeft">开盘时间</view>
				<view class="selectRight">
					<picker mode="date" :value="sellTimeId"  @change="bindDateChange">
					  <view class="uni-input selectPicker">{{sellTimeId}}</view>
					</picker>
				</view>
			</view>
			<!-- <view class="selectList">
				<view class="selectLeft">售卖户型</view>
				<view class="selectRight">
					<picker mode="selector" :value="modelId"  @change="changeModel" :range='modelArr' range-key="remark">
					  <view class="uni-input selectPicker">{{saleApartment}}</view>
					</picker>
				</view>
			</view> -->
			<view class="selectList">
				<view class="selectLeft">售楼地址</view>
				<view class="selectRight">
						<input type="text" v-model="sellAddressId"  class='rightContent' placeholder="请输入"/>
				</view>
			</view>
		</view>
		<view class="effectTitle">户型图</view>
		<view class="effectImg apartmentPictures" v-for="(val,index) in apartmentPictures" :key='index'>
				<view class="delBtn" @click="delEffectImg1(index)" v-if="propertyStatus==0 || propertyStatus==3">×</view>
				<image :src="val.picture" mode=""></image>
			</view>
		<view class="effectImg apartmentPictures uploadBtn2" @click="upLoadImg(2)"><text class="addIcon">+</text></view>
      <!-- <view class="selectList">
      	<view class="selectLeft">建筑结构</view>
      	<view class="selectRight">
      		<picker mode="selector" :value="structureId"  @change="changeStructure" :range='structureArr' range-key="remark">
      		  <view class="uni-input selectPicker">{{buildingStructure}}</view>
      		</picker>
      	</view>
      </view> -->
     <!-- <view class="selectList">
      	<view class="selectLeft">售卖户型</view>
      	<view class="selectRight">
      		<picker mode="selector" :value="modelId"  @change="changeModel" :range='modelArr' range-key="remark">
      		  <view class="uni-input selectPicker">{{saleApartment}}</view>
      		</picker>
      	</view>
      </view> -->
      <view class="effectTitle">售卖户型</view>
      <view class="labelBox">
      	<view class="labelList" :class="[selectModelArr[index]?'labelList1':'']"  v-for="(val ,index) in modelArr" :key='index' @click="selectModel(index,val.dictName)">{{val.dictName}}</view>
      </view>
      <view class="effectTitle">建筑结构</view>
      <view class="labelBox">
      	<view class="labelList" :class="[selectArr[index]?'labelList1':'']"  v-for="(val ,index) in structureArr" :key='index' @click="selectBulid(index,val.dictName)">{{val.dictName}}</view>
      </view>
			<view class="effectTitle">标签</view>	
			<view class="labelBox">
				<view class="labelList" :class="[selectLableArr[index]?'labelList1':'']" v-for="(val ,index) in labelList" :key='index' @click="selectLable(index,val.dictName)">{{val.dictName}}</view>
			</view>
		</view>
		<view class="submit" @click="upload()" v-if="propertyStatus==0">提交</view>
    <view class="submit" @click="editor()" v-if="propertyStatus==3">提交修改</view>
    <view class="loadingImg" v-if="isLoadingImg">
       <image src="../../static/img/timg.gif" mode=""></image>
     </view>
	</view>
</template>

<script>
	export default {

		data() {
			return {
        isLoadingImg:false,
				labelList:[],
				selectLableArr:[],
        selectModelArr:[],//判断售卖户型
				labels:'',
				editorList:'',
				areaId:'',
				structureArr:[],
				sellStateArr:[],
				sellTimeArr:[],
				sellAddressArr:[],
				modelArr:[],
				modelId:0,
				saleApartment:'',
				sellStateId:0,
				sellTimeId:'请选择',
				sellAddressId:'',
				housesName:'',//楼盘名称
				housesDetail:'',//楼盘简介
				smallArea:'',//最小建面
				bigArea:'',//最大建面
				price:'',//参考均价
				allPrice:'',//参考总价
				commission:'',//佣金
				structureId:0,//建筑结构Id
				buildingStructure:'',//建筑结构
        selectArr:[],//选中建筑结构
        selectBuilding:[],
				index:0,
				effectImg:[],//效果图
				apartmentPictures:[],//户型图
				imgArr:[],
				basicArr: [],
				isAnonymous:true,
			pId:0,//一级区域id
			addressId:'',//选中二级区域id
			addressArr:[[],[]],
      addressIndex:[0,0],
      addressIdArr:[],//1级
      addressIdArr1:[],//2级
      address:'请选择地址',
      isEditor:false,
      id:'',//楼盘id
      propertyStatus:0,
      saleStatus:'请选择',//售卖状态
				}
		},
		onLoad(options) {
      if(options.id){
        this.isEditor=true;
        this.id=options.id
        // this.getHouseDetail(this.id)
      }
			this.getSelectId();
      this.getAreaList();
			// this.orderId=options.id;
			// this.getDetail(options.id);
			// this.$api.httpRequest(
			// 	'GET',
			// 	this.$constant.API_HOME + '/member/userInfo', {
			// 		token: this.$store.state.userInfo.token.token
			// 	}
			// ).then((data) => {
			// 	// console.log(data);
			// 	this.userData=data;
				
			// })
		},
		methods: {
      cancel(){
      	this.address="请选择地址";
      },
			 bindDateChange: function(e) {
			  this.sellTimeId = e.target.value
			 },
			// 删除效果图
			delEffectImg(index){
				this.effectImg.splice(index, 1)
			},
			delEffectImg1(index){
				this.apartmentPictures.splice(index, 1)
			},
      // 建筑结构
      selectBulid(index,val){
        this.$set(this.selectArr,index,this.selectArr[index]?false:true);
        this.buildingStructure='';
        for(var i=0;i<this.structureArr.length;i++){
          if(this.selectArr[i]){
            if(this.buildingStructure.length==0){
            	this.buildingStructure=this.structureArr[i].dictName
            }else{
            	this.buildingStructure+=','+this.structureArr[i].dictName
            }
          }
        }
        console.log(this.buildingStructure)
      },
      // 售卖户型
      selectModel(index,val){
        this.$set(this.selectModelArr,index,this.selectModelArr[index]?false:true);
        this.saleApartment='';
        for(var i=0;i<this.modelArr.length;i++){
          if(this.selectModelArr[i]){
            if(this.saleApartment.length==0){
            	this.saleApartment=this.modelArr[i].dictName
            }else{
            	this.saleApartment+=','+this.modelArr[i].dictName
            }
          }
        }
        console.log(this.saleApartment)
      },
      // 标签
			selectLable(index,val){
				this.$set(this.selectLableArr,index,this.selectLableArr[index]?false:true);
        this.labels='';
        for(var i=0;i<this.labelList.length;i++){
          if(this.selectLableArr[i]){
            if(this.labels.length==0){
            	this.labels=this.labelList[i].dictName
            }else{
            	this.labels+=','+this.labelList[i].dictName
            }
          }
        }
				// if(this.labels.length==0){
				// 	this.labels=val
				// }else{
				// 	this.labels+=','+val
				// }
				
				console.log(this.selectLableArr)
        console.log(this.labels)
				// this.selectLableArr[index]=true;
			},
      getHouseDetail(id){
        	this.$api.httpRequest(
        		'GET',
        		this.$constant.API_HOME + '/property/property/' + id,
        		{},
        		{token:this.$store.state.hasLogin?this.$store.state.userInfo.token.token:''}
        	).then((data) => {
        		
            this.effectImg=JSON.parse(data.designPictures)
            this.addressId=data.areaId
            this.housesName=data.propertyName
            this.housesDetail=data.propertyIntroduce
            this.bigArea=data.maxBuildArea
            this.smallArea=data.minBuildArea
            this.price=data.unitPrice
            this.allPrice=data.totalPrice
            this.commission=data.commission
            this.saleStatus=data.saleStatus
            for (var i = 0; i < this.sellStateArr.length; i++) {
              if(this.sellStateArr[i]==this.saleStatus){
                this.sellStateId=i
              }
              
            }
            this.sellTimeId=data.openingDate
            // 售卖户型
            this.saleApartment=data.saleApartment;
            var selectModel=this.saleApartment.split(',')
            for(var i=0;i<selectModel.length;i++){
              for(var j=0;j<this.modelArr.length;j++){
                if(selectModel[i]==this.modelArr[j].dictName){
                  this.$set(this.selectModelArr,j,true)
                  // console.log(selectModel[i],this.modelArr[j].dictName)
                }
              }
            }
            this.sellAddressId=data.saleAddress
            this.apartmentPictures=JSON.parse(data.apartmentPictures)
            // this.labels=data.labels
            this.address=data.areaName
            this.propertyStatus=data.propertyStatus
            // 楼盘状态 0 无 1待审核 2审核通过 3驳回 4上架 5下架
            if(this.propertyStatus==3){
              uni.showToast({
                  title: '审核失败请重新提交',
                  duration: 3000,
                  icon:'none'
              });
            }
            this.labels=(data.labels).split(',');
            this.selectBuilding=(data.buildingStructure).split(',');
            this.buildingStructure=data.buildingStructure
            for(var i=0;i<this.labelList.length;i++){
              for(var j=0;j<this.labels.length;j++){
               
                if(this.labelList[i].dictName==this.labels[j]){
                  this.$set(this.selectLableArr,i,true)
                }
              }
            }
            // console.log(this.buildingStructure)
            for(var x=0;x<this.structureArr.length;x++){
              
              for(var y=0;y<this.selectBuilding.length;y++){
                 console.log(this.structureArr[x],this.selectBuilding[y])
                if(this.structureArr[x].remark==this.selectBuilding[y]){
                  this.$set(this.selectArr,x,true)
                }
              }
            }
            console.log(this.selectLableArr)
        	});
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
			  this.addressIndex=e.target.value
			  this.address=this.addressArr[0][this.addressIndex[0]]+this.addressArr[1][this.addressIndex[1]];
			  this.addressId=this.addressIdArr1[this.addressIndex[1]]
			  console.log(this.addressId)
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
			changeStructure(e){
				console.log(e)
				this.structureId=e.target.value
				this.buildingStructure=this.structureArr[this.structureId].remark
			},
			changeSellState(e){
				console.log(e)
				this.sellStateId=e.target.value
        this.saleStatus=this.sellStateArr[this.sellStateId].dictName
			},
			changeSellTime(e){
				console.log(e)
			},
			changeModel(e){
				console.log(e)
				this.modelId=e.target.value
				this.saleApartment=this.modelArr[this.modelId].remark
			},
			// 上传图片
			upLoadImg(type=1) {
			  var _this = this;
			  uni.chooseImage({
			    count: 1, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'],
			    success: function (res) {
            _this.isLoadingImg=true;
			      // console.log('resresresresres',res);
			      const tempFilePaths = res.tempFilePaths;
			      uni.uploadFile({
			      	url: _this.$constant.API_OPEN_HOME+'sys/oss/upload',
			      	filePath: tempFilePaths[0],
			      	name: 'file',
			      	formData: {
			      		'user': 'test'
			      	},
			      	success: (uploadFileRes) => {
                _this.isLoadingImg=false;
			      		// console.log(uploadFileRes.data);
			      		// console.log(JSON.parse(uploadFileRes.data).data.src)
			      		_this.userImg=JSON.parse(uploadFileRes.data).data.src
			      		console.log(_this.userImg)
											if(type==1){
												_this.effectImg.push(_this.userImg)
											}else{
                        
												_this.apartmentPictures.push({'picture':_this.userImg,'desc':''})
											}
											
			      		// _this.changeUserInfo(1,_this.userImg);
			      	}
			      });
			    }
			  });
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
						this.structureArr=data;
            for(var i=0;i<this.structureArr.length;i++){
              this.selectArr[i]=false;
            }
					}else if(data[0].dictType=="sale_status"){
						console.log(data)
						// 售卖状态
						this.sellStateArr=data;
					}else if(data[0].dictType=="sale_apartment"){
						console.log(data)
						// 售卖户型	
						this.modelArr=data;
					}else if(data[0].dictType=="labels"){
						console.log(data)
						this.labelList=data;
						for(var i=0;i<this.labelList.length;i++){
							this.selectLableArr[i]=false;
						}
            if(this.id){
              this.getHouseDetail(this.id)
            }
					}
					
				// this.editorList=data;
				})
			},
			upload(){
        if(typeof this.labels!=='string'){
          this.labels=JSON.stringify(this.labels)
        }
        if(this.effectImg.length==0 || this.apartmentPictures==0){
          this.$api.msg('请选择图片！');
          return false;
        }
        if(this.addressId==''){
          this.$api.msg('请选择区域')
          return false;
        }
        if(this.housesName==''){
          this.$api.msg('请填写楼盘名称')
          return false;
        }
       if(this.housesDetail==''){
         this.$api.msg('请填写楼盘简介')
         return false;
       }
        if(this.minBuildArea=='' || this.maxBuildArea==''){
          this.$api.msg('请填写建筑面积')
          return false;
        }
        if(this.price==''){
          this.$api.msg('请填写均价')
          return false;
        }
        if(this.allPrice==''){
          this.$api.msg('请填写总价')
          return false;
        }
        if(this.commission==''){
          this.$api.msg('请填写佣金')
          return false;
        }
        if(this.saleStatus==''){
          this.$api.msg('请选择售卖状态')
          return false;
        }
        if(this.sellTimeId=='请选择'){
          this.$api.msg('请选择开盘时间')
          return false;
        }
        if(this.sellAddressId==''){
          this.$api.msg('请填写售楼地址')
          return false;
        }
        if(this.saleApartment==''){
          this.$api.msg('请选择售卖户型')
          return false;
        }
        if(this.buildingStructure==''){
          this.$api.msg('请选择建筑结构')
          return false;
        }
        if(this.labels==''){
          this.$api.msg('请选择标签')
          return false;
        }
        // console.log(this.sellTimeId)
        // return false;
				this.$api.httpRequest(
					'POST',
					this.$constant.API_HOME + 'property/property/',{
						designPictures:JSON.stringify(this.effectImg),
						areaId:this.addressId,
						propertyName:this.housesName,
						propertyIntroduce:this.housesDetail,
						minBuildArea:this.smallArea,//最小建面
				    maxBuildArea:this.bigArea,
						unitPrice:this.price,
						totalPrice:this.allPrice,
						commission:this.commission,
						buildingStructure:this.buildingStructure,
						openingDate:this.sellTimeId,
						saleApartment:this.saleApartment,
						saleAddress:this.sellAddressId,
            saleStatus:this.saleStatus,
						apartmentPictures:JSON.stringify(this.apartmentPictures),
						labels:this.labels,
					}, {
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
          this.$api.msg('提交成功')
          this.propertyStatus=1
					console.log(data);
				// this.editorList=data;
				})
			},
			editor(){
        if(typeof this.labels!=='string'){
          this.labels=this.labels.join(',')
        }
        if(this.effectImg.length==0 || this.apartmentPictures==0){
          this.$api.msg('请选择图片！');
          return false;
        }
        if(this.housesName==''){
          this.$api.msg('请填写楼盘名称')
          return false;
        }
        if(this.addressId==''){
          this.$api.msg('请选择区域')
          return false;
        }
        if(this.minBuildArea=='' || this.maxBuildArea==''){
          this.$api.msg('请填写建筑面积')
          return false;
        }
        if(this.price==''){
          this.$api.msg('请填写均价')
          return false;
        }
        if(this.saleStatus==''){
          this.$api.msg('请选择售卖状态')
          return false;
        }
        if(this.saleApartment==''){
          this.$api.msg('请选择售卖户型')
          return false;
        }
				this.$api.httpRequest(
					'PUT',
					this.$constant.API_HOME + 'property/property/',{
              id:this.id,
							designPictures:JSON.stringify(this.effectImg),
							areaId:this.addressId,
							propertyName:this.housesName,
							propertyIntroduce:this.housesDetail,
							minBuildArea:this.smallArea,//最小建面
						  maxBuildArea:this.bigArea,
							unitPrice:this.price,
							totalPrice:this.allPrice,
							commission:this.commission,
							buildingStructure:this.buildingStructure,
							openingDate:this.sellTimeId,
							saleApartment:this.saleApartment,
							saleAddress:this.sellAddressId,
							apartmentPictures:JSON.stringify(this.apartmentPictures),
							labels:this.labels,
						  saleStatus:this.saleStatus
					}, {
						token: this.$store.state.userInfo.token.token
					}
				).then((data) => {
					console.log(data);
           this.propertyStatus=1
          this.$api.msg('修改成功')
				// this.editorList=data;
				})
			},
			
		},
		
	}
</script>

<style lang="scss">
	page,
	.wrap {
		background: $page-color-base;
	}
	.content{
		border-top: 2upx solid #E8E8E8;
		padding:30upx;
		.effectTitle{
			font-size: 32upx;
		}
	}
	.submit{
		width: 100%;
		height: 100upx;
		line-height: 100upx;
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
    .titleList1{
      color: #3171F2;
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
  .uploadBtn2{
    // width: 200upx;
   // font-size: 80upx;
   background: #EEEEEE;
   display: inline-block;
   // text-align: center;
   // height: 200upx;
   // line-height: 200upx;
   color: #fff;
   position: relative;
   .addIcon{
     position: absolute;
     top: 0;
     bottom: 0;
     left: 0;
     right: 0;
     margin: auto;
     text-align: center;
     font-size: 120upx;
   }
  }
	.effectImg{
		position: relative;
		image{
			width: 100%;
			height: 500upx;
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
		// border: 1upx solid #303133;
		display: inline-block;
    height: 200upx;
    line-height: 200upx;
    text-align: center;
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
		margin: 20upx auto;
	}
	.selectList{
	 font-size: 32upx;
		height: 100upx;
		display: flex;
		align-items: center;
		border: 1upx solid #DCDFE6;
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
		// justify-content: space-between;
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
      margin-right: 30upx;
		}
    .labelList:nth-child(3n){
      margin-right: 0;
    }
		.labelList1{
			background: #3171F2;
			color: #fff;
		}
	}
  .loadingImg{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.5);
    image{
      width: 200upx;
      height: 200upx;
    }
  }
</style>
