<template>
  <div>
    <div v-if="$route.name=='channelInfo'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
        <el-page-header @back="$router.push({path:'/channelList',query:JSON.parse($route.query.oldQuery)})" content="频道详情" style="font-size:24px;font-weight:bold;color:#614a4d;">
        </el-page-header>
      </div>
      <div style="overflow:hidden;color:#606266;">
        <div style="width:300px;height:306px;float:left;">
          <el-image style="width:300px;height:300px;border:3px solid #DCDFE6" :src="channelInfo.imgUrl?`/static/${channelInfo.imgUrl}`:''"></el-image>
        </div>
        <div style="float:left;vertical-align：top;margin-left:50px;">
          <div style="line-height:70px;">
            <div style="display:inline-block;width:800px;">
              <h2 style="display:inline;">{{channelInfo.channelName}}</h2>
              <h3 style="display:inline;margin-left:150px;">{{channelInfo.channelViceTopic}}</h3>
            </div>
          </div>
          <div style="line-height:60px;font-size:18px;font-weight:bold;">
            <span>发布用户：</span><span class="myDetails" style="width:210px;">{{channelInfo.author}}</span>
            <span>类别：</span><span class="myDetails" style="width:250px;">{{'全部'}}</span>
            <span>状态：</span><span class="myDetails" :style="{'color':channelInfo.state==1?'#0000ff':channelInfo.state==2?'#008000':''}">{{channelInfo.state==1?'已上架':channelInfo.state==2?'已下架':''}}</span>
          </div>
          <div style="line-height:60px;font-size:18px;font-weight:bold;margin-bottom:20px;">
            <span>发布时间：</span><span class="myDetails" style="width:210px;">{{channelInfo.createTime}}</span>
            <span>最新修改时间：</span><span class="myDetails" style="width:210px;">{{channelInfo.updateTime}}</span>
            <span>直播间数量：</span><span class="myDetails" style="width:100px;">{{channelInfo.liveNum}}</span>
            <span>在线观看人数：</span><span class="myDetails" style="width:100px;">{{channelInfo.onlineViewing}}</span>
          </div>
          <div style="font-size:18px;font-weight:bold;">
            <span style="vertical-align:top;">简介：</span>
            <span style="display:inline-block;width:1000px;height:80px;border:1px solid #DCDFE6;overflow-y:auto;font-weight:500;">{{channelInfo.channelBrief}}</span>
          </div>
        </div>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入直播标题" @change="replace('page',1)"></el-input>
        <span class="myWords">
          状态
          <el-select v-model="status" style="width:150px;" @change="replace('page',1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" :value="1"></el-option>
            <el-option label="已下架" :value="2"></el-option>
          </el-select>
        </span>
        <el-button type="success" size="mini" @click="lotUp">批量上架</el-button>
        <el-button type="danger" size="mini" @click="lotLower">批量下架</el-button>
        <span v-if="appIdList.length" style="color:#606266;"><i class="el-icon-warning"></i>已选择<span style="color:#409EFF;">{{appIdList.length}}</span>项数据</span>
      </el-row>
      <el-table ref="liveRef" :data="liveTable" border style="width: 100%;margin-bottom:32px;" class="mt15 mb15" @sort-change="sortChange" @selection-change="handleSelectionChange" row-key="id">
        <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="imgUrl" label="直播封面图" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:70px;height:70px;" v-focus>
          </template>
        </el-table-column>
        <el-table-column prop="liveName" label="直播标题" align="center">
          <template slot-scope="scope">
            <div style="overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;">{{scope.row.liveName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="liveViceTopic" label="直播副标题" width="100" align="center">
          <template slot-scope="scope">
            <div style="overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;">{{scope.row.liveViceTopic}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="liveClassify" label="直播类别" width="120" align="center">
          {{'全部'}}
        </el-table-column>
        <el-table-column prop="author" label="发布用户" width="150" align="center"></el-table-column>
        <el-table-column prop="createTime" label="发布时间" width="180" align="center"></el-table-column>
        <!-- <el-table-column prop="updateTime" label="分辨率" width="180" align="center"></el-table-column> -->
        <el-table-column prop="liveBrief" label="直播简介" align="center">
          <template slot-scope="scope">
            <div style="overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;">{{scope.row.liveBrief}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="liveState" label="直播状态" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.liveState==0">未开播</span>
            <span v-if="scope.row.liveState==1">直播中</span>
            <span v-if="scope.row.liveState==2">回放中</span>
            <span v-if="scope.row.liveState==3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="isNeedPassword" label="直播间密码" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isNeedPassword==0">有</span>
            <span v-if="scope.row.isNeedPassword==1">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="liveNetRule" label="网络规则" width="80" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.liveNetRule==0">内网</span>
            <span v-if="scope.row.liveNetRule==1">公网</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="直播间创建时间" width="150" align="center" sortable></el-table-column>
        <el-table-column prop="lastLiveTime" label="上次直播时间" width="150" align="center" sortable>
          <template slot-scope="scope">
            {{scope.row.lastLiveTime?scope.row.lastLiveTime:'--'}}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="直播总时长" width="120" align="center" sortable>
          <template slot-scope="scope">
            <span>{{scope.row.duration?(parseInt((scope.row.duration)/3600).toString().padStart(2,'0')+':'+parseInt((scope.row.duration%3600)/60).toString().padStart(2,'0')+':'+Math.ceil(scope.row.duration%60).toString().padStart(2,'0')):'0:00'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="onlineViewing" label="在线观看人数" width="130" align="center" sortable></el-table-column>
        <el-table-column prop="isOnShelf" label="上架状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isOnShelf"
              :active-value="1"
              :inactive-value="2"
              :disabled="scope.row.liveState==1||scope.row.liveState==2"
              @change="up(scope.row.isOnShelf,scope.row.id)"           
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="warning" size="mini" @click="playVideo(scope.row.id,scope.row.liveState,scope.row.isOnShelf)">预览</el-button>
            <el-button :disabled="scope.row.isOnShelf!=2" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="totalNum"></pagination>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import pagination from '../../share/pagination'
import {getChannelInfo,getLiveList,liveUpper,liveLower,liveDel,getVideoUrl} from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'channelInfo',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      status:'',
      liveTable:[],
      appIdList:[],//批量上下架的数组
      channelInfo:{},
      totalNum:0,
      sortName:'',
      sortType:''
    }
  },
  watch:{
    inputX(){
      this.replace('liveName',this.inputX);
      this.appIdList=[];//清空选择
    },
    status(){
      this.replace('isOnShelf',this.status);
      this.appIdList=[];//清空选择
    },
    sortType(){
      this.replace('sortType',this.sortType);
      this.appIdList=[];//清空选择
    },
    sortName(){
      this.replace('sortName',this.sortName);
      this.appIdList=[];//清空选择
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='channelInfo'){
        this.listData();
      }
    }
  },
  methods:{
    sortChange(col){
      this.sortName = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
      this.listData();
    },
    handleSelectionChange(val) {
      this.appIdList=val.map(v=>v.id)
    },
    up(isOnShelf,id,url){
      if(isOnShelf==1){
        this.$confirm('确认上架吗？').then(u=>{
          liveUpper({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
            }else{
              this.$message.success('上架成功');
            }
          }).catch(err=>{
            this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
          })
        }).catch(error=>{
          this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
        })
      }else if(isOnShelf==2){
        this.$confirm('确认下架吗？').then(u=>{
          liveLower({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
            }else{
              this.$message.success('下架成功');
            }
          }).catch(err=>{
            this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
          })
        }).catch(error=>{
          this.liveTable.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
        })
      }    
    },
    lotUp(){
      if(this.appIdList.length){
        let isHasNoVideoList = this.appIdList.filter(item=>this.liveTable.some(v=>v.id==item&&(v.liveState==1||v.liveState==2)));
        if(isHasNoVideoList.length){
          this.$alert(`所选id为${isHasNoVideoList.join('、')} 的直播间存在直播中或回放中，不允许上架`, {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        liveUpper({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要上架的行');
      }
    },
    lotLower(){
      if(this.appIdList.length){
        let isHasNoVideoList = this.appIdList.filter(item=>this.liveTable.some(v=>v.id==item&&(v.liveState==1||v.liveState==2)));
        if(isHasNoVideoList.length){
          this.$alert(`所选id为${isHasNoVideoList.join('、')} 的直播间存在直播中或回放中，不允许下架`, {
            dangerouslyUseHTMLString: true
          });
          return;
        }
        liveLower({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要下架的行');
      }
    },
    del(id){
      liveDel([id]).then(res=>{
        if(this.liveTable.length===1){
          this.replace('page',1)
        }
        this.reload();
      })
    },
    getInfo(){
      getChannelInfo({id:this.$route.query.id}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.channelInfo = res.data;
          this.channelInfo.imgUrl = res.data.channelCover?Base64.decode(res.data.channelCover):''
        }
      })
    },
      playVideo(id,liveState,state) {
        let routes = this.$router.resolve({ name: "aliplayer" });
        getVideoUrl({id}).then(res=>{
        let cameraList=!res.data.cameraList?[]:res.data.cameraList
        if(cameraList.length&&liveState==1){
          let rtmpUrl = liveState==1&&state==1?res.data.cameraList[0].deviceDto.address:'';
          let token=liveState==1&&state==1?res.data.cameraList[0].deviceDto.token:'';
          window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&token=${token}&id=${id}&liveState=${liveState}&state=${state}&first=1`,'win1',"height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else if(!cameraList.length&&liveState==1){
          let rtmpUrl ='';
          window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&id=${id}&liveState=-1&state=${state}&first=1`,'win1',"height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else if(res.data){
          let rtmpUrl =''
          window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&id=${id}&liveState=${liveState}&state=${state}&first=1`, "win1","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error('没有播放地址')
        }
      })
      },
    listData(){
      getLiveList({"channelId":this.$route.query.id,...this.$route.query}).then(res=>{
        this.liveTable=res.data.items.map(v=>{
            v.liveCover?v.imgUrl=Base64.decode(v.liveCover):null;
            return v;
          });
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.getInfo();
    this.listData();
    this.inputX = this.$route.query.liveName||'';
    this.status = this.$route.query.isOnShelf||'';
  },
}
</script>
<style scoped>
.myDetails{
  display: inline-block;
  font-weight:500;
}
</style>