<template>
  <div>
    <div v-if="$route.name=='livingList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">直播页面管理</span>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          标题：
          <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入标题搜索" @change="replace('page',1);"></el-input>
        </span>
        <span class="myWords">
          类别：
          <el-select v-model="classBy" style="width:150px;" @change="replace('page',1);">
            <el-option label="全部" value=""></el-option>
          </el-select>
        </span>
        <span class="myWords">
          直播状态：
          <el-select v-model="status" style="width:150px;" @change="replace('page',1);">
            <el-option label="全部" value=""></el-option>
            <el-option label="直播中" value="1"></el-option>
            <el-option label="未开播" value="0"></el-option>
            <el-option label="已结束" value="3"></el-option>
            <el-option label="回放中" value="2"></el-option>
          </el-select>
        </span>
        <span class="myWords">
          直播间状态：
          <el-select v-model="roomStatus" style="width:150px;" @change="replace('page',1);">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="已下架" value="2"></el-option>
          </el-select>
        </span>
        
        <el-button type="success" size="mini" @click="lotUp">批量上架</el-button>
        <el-button type="warning" size="mini" @click="lotLower">批量下架</el-button>
        <el-button type="danger" size="mini" @click="lotDel('all')">批量删除</el-button>
        <span v-if="appIdList.length" style="color:#606266;"><i class="el-icon-warning"></i>已选择<span style="color:#409EFF;">{{appIdList.length}}</span>条</span>
      </el-row>
      <el-table ref="userRef" :data="tableData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @selection-change="handleSelectionChange" row-key="id" @sort-change="changeUpadte">
        <el-table-column type="selection" width="50" :reserve-selection="true" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="liveCover" label="直播封面图" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.liveCover?`/static/${scope.row.liveCover}`:''" alt="" style="width:70px;height:70px;" v-focus>
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
        <el-table-column prop="liveViceTopic" label="直播副标题" align="center">
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
        <el-table-column prop="author" label="直播用户" width="120" align="center"></el-table-column>
        <el-table-column prop="liveBrief" label="直播简介" align="center">
          <template slot-scope="scope">
            <div style="overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;">{{scope.row.liveBrief}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="liveState" label="直播状态" align="center">
          <template slot-scope="scope">
             <span
              v-if="scope.row.liveState==0"
            >未开播</span>
            <span
              v-if="scope.row.liveState==1"
            >直播中</span>
            <span
            v-if="scope.row.liveState==2"
           >回放中</span>
            <span
            v-if="scope.row.liveState==3"
            >已结束</span>
          </template>
        </el-table-column>
         <el-table-column prop="isNeedPassword" label="直播间密码" align="center" width="80">
          <template slot-scope="scope">
             <span
              v-if="scope.row.isNeedPassword==0"
            >有</span>
            <span
              v-if="scope.row.isNeedPassword==1"
            >无</span>
          </template>
        </el-table-column>
         <el-table-column prop="liveNetRule" label="网络规则" align="center" width="80">
          <template slot-scope="scope">
             <span
              v-if="scope.row.liveNetRule==0"
            >内网</span>
            <span
              v-if="scope.row.liveNetRule==1"
            >公网</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="直播间创建时间" width="110" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="lastLiveTime" label="上次直播时间" width="110" align="center" sortable="custom">
            <template slot-scope="scope">
             {{ scope.row.lastLiveTime?scope.row.lastLiveTime:'--'}}
            </template>
        </el-table-column>
        <el-table-column prop="duration" label="直播总时长" width="90" align="center" sortable="custom">
           <template slot-scope="scope">
            {{scope.row.duration?(parseInt((scope.row.duration)/3600).toString().padStart(2,'0')+':'+parseInt((scope.row.duration%3600)/60).toString().padStart(2,'0')+':'+Math.ceil(scope.row.duration%60).toString().padStart(2,'0')):'0:00'}}
            <!-- {{Math.floor(scope.row.duration/3600) + "时" + Math.floor(Math.floor(scope.row.duration%3600)/60) + "分"+ scope.row.duration%60 + "秒"}} -->
          </template>
        </el-table-column>
        <el-table-column prop="onlineViewing" label="在线观看人数" width="100" align="center" sortable="custom"></el-table-column>
        <el-table-column prop="isOnShelf" label="上架状态" width="100" align="center">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.liveState==1||scope.row.liveState==2"
              v-model="scope.row.isOnShelf"
              :active-value="1"
              :inactive-value="2"
              @change="up(scope.row.isOnShelf,scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150" align="center">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" @click="openWin(scope.row.id,scope.row.liveState,scope.row.isOnShelf)">预览</el-button>
            <el-button  size="mini"  type="danger" @click="lotDel(scope.row.id)" v-if="scope.row.isOnShelf==2">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="total"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import {livingList,livingBatchUpper,livingBatchLower,getVideoUrl,livingBatchDel } from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'livingList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      status:'',
      roomStatus:'',
      classBy:'',
      tableData:[
      ],
      tableHeight:0,
      multipleSelection:[],
      appIdList:[],//批量上下架的数组
      orderByName:'',
      orderBy:'',
      total:0,
      loading:null,
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    inputX(){
      this.replace('liveName',this.inputX);
      this.appIdList=[];//清空选择
    },
    status(){
      this.replace('state',this.status);
      this.appIdList=[];//清空选择
    },
    roomStatus(){
      this.replace('roomStatus',this.roomStatus);
      this.appIdList=[];//清空选择
    },
    classBy(){
      this.replace('liveClassify',this.classBy);
      this.appIdList=[];//清空选择
    },
    orderBy(){
      this.replace('orderBy',this.orderBy);
      this.appIdList=[];//清空选择
    },
    orderByName(){
      this.replace('orderByName',this.orderByName);
      this.appIdList=[];//清空选择
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='livingList'){
        this.listData();
      }
    }
  },
  methods:{
    up(state,id){
      if(state==1){
        this.$confirm('确认上架吗？').then(u=>{
          livingBatchUpper({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
            }else{
              this.$message.success('上架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=2;}});
        })
      }else if(state==2){
        this.$confirm('确认下架吗？').then(u=>{
          livingBatchLower({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
            }else{
              this.$message.success('下架成功');
            }
          }).catch(err=>{
            this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
          })
        }).catch(error=>{
          this.tableData.forEach(v=>{if(v.id==id){v.isOnShelf=1;}});
        })
      }    
    },
    lotUp(){
      let appIdList= this.appIdList.map(v=>v.id)
      if(this.appIdList.length){
      let hasArray=[]
      hasArray=this.appIdList.filter(v=>
        v.liveState !==2&&v.liveState !==1
      )
       if(this.appIdList.length !==hasArray.length){
          this.$message.error('直播中、回访中的直播间不允许进行上下架');
       }else{
          livingBatchUpper({"ids":appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
       }
       
      }else{
        this.$message.error('请勾选需要上架的行');
      }
    },
    lotLower(){
      let appIdList= this.appIdList.map(v=>v.id)
      if(this.appIdList.length){
        let hasArray=[]
        hasArray=this.appIdList.filter(v=>
          v.liveState !==2&&v.liveState !==1
      )
       if(this.appIdList.length !=hasArray.length){
          this.$message.error('直播中、回放中的直播间不允许进行上下架');
       }else{
         livingBatchLower({"ids":appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
       } 
      }else{
        this.$message.error('请勾选需要下架的行');
      }
    },
    lotDel(id){
    let appIdList= this.appIdList.map(v=>v.id)
       let hasArray=[]
        hasArray=this.appIdList.filter(v=>
          v.isOnShelf ==2
      )
      if(id=='all'&&this.appIdList.length){
        if(this.appIdList.length !==hasArray.length){
        this.$message.error('只有下架中的才可以被删除');
       }
        else{
          livingBatchDel({"ids":appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
        }
      }else if(id=='all'&&!this.appIdList.length){
        this.$message.error('请勾选需要删除的行');
      }
      else{
        livingBatchDel({"ids":[id],"isBatch":true}).then(res=>{
          this.reload();
        })
      }
    },
    listData(){
       this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      livingList(this.$route.query).then(res=>{
        this.loading.close();
        this.tableData=res.data.items.map(v=>{
            v.liveCover?v.liveCover=Base64.decode(v.liveCover):null;
            return v;
          });
        this.total=res.data.total
      }).catch(err=>{
        this.loading.close();
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.appIdList=this.multipleSelection
    },
   changeUpadte(col){
      this.orderByName = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.orderBy = col.order=='ascending'?'asc':col.order=='descending'?'desc':'';
    },
  openWin(id,liveState,state) {
        let height=window.screen.height
        let routes = this.$router.resolve({ name: "aliplayer" });
        getVideoUrl({id}).then(res=>{
        let cameraList=!res.data.cameraList?[]:res.data.cameraList
        if(cameraList.length&&liveState==1){
          let rtmpUrl = liveState==1&&state==1?res.data.cameraList[0].deviceDto.address:'';
          let token=liveState==1&&state==1?res.data.cameraList[0].deviceDto.token:'';
          window.open(`${routes.href}?rtmpUrl=${rtmpUrl}&token=${token}&id=${id}&liveState=${liveState}&state=${state}&first=1`,'win1',`height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no,left=0,top=0`);
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
      }
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.liveName||'';
    this.status = this.$route.query.state||'';
    this.roomStatus = this.$route.query.roomStatus||'';
    this.classBy = this.$route.query.liveClassify||'';
  },
  updated(){
    if(this.$route.name=='livingList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>
<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>