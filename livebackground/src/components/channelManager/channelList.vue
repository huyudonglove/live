<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">频道页面管理</span>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入频道标题" @change="replace('page',1)"></el-input>
      <span class="myWords">
        状态
        <el-select v-model="status" style="width:150px;" @change="replace('page',1)">
          <el-option label="全部" value=""></el-option>
          <el-option label="已上架" value="1"></el-option>
          <el-option label="已下架" value="2"></el-option>
        </el-select>
      </span>
      <span class="myWords" @change="replace('page',1)">
        类别
        <el-select v-model="classBy" style="width:150px;">
          <el-option label="全部" value=""></el-option>
        </el-select>
      </span>
      <el-button type="success" size="mini" @click="lotUp">批量上架</el-button>
      <el-button type="danger" size="mini" @click="lotLower">批量下架</el-button>
      <span v-if="appIdList.length" style="color:#606266;"><i class="el-icon-warning"></i>已选择<span style="color:#409EFF;">{{appIdList.length}}</span>项数据</span>
    </el-row>
    <el-table ref="channelRef" :data="channelTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @sort-change="sortChange" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
      <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
      <el-table-column prop="imgUrl" label="频道封面图" width="100" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.imgUrl?`/static/${scope.row.imgUrl}`:''" alt="" style="width:70px;height:70px;" v-focus>
        </template>
      </el-table-column>
      <el-table-column prop="channelName" label="频道标题" align="center">
        <template slot-scope="scope">
          <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="channelViceTopic" label="频道副标题" align="center">
        <template slot-scope="scope">
          <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelViceTopic}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="channelClassify" label="频道类别" width="120" align="center">
        {{'全部'}}
      </el-table-column>
      <el-table-column prop="author" label="发布用户" width="150" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180" align="center" sortable></el-table-column>
      <el-table-column prop="updateTime" label="最新修改时间" width="180" align="center" sortable></el-table-column>
      <el-table-column prop="channelBrief" label="频道简介" align="center">
        <template slot-scope="scope">
          <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelBrief}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="liveNum" label="直播间数量" width="100" align="center"></el-table-column>
      <el-table-column prop="onlineViewing" label="在线观看人数" width="130" align="center" sortable></el-table-column>
      <el-table-column prop="state" label="上架状态" width="80" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.state"
            :active-value="1"
            :inactive-value="2"
            @change="up(scope.row.state,scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="$router.push({path:'/channelInfo',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="totalNum"></pagination>
    </div>
  </div>
</template>
<script>
import pagination from '../../share/pagination'
import {getChannelList,batchUpper,batchLower} from '../../http/request'
import { Base64 } from 'js-base64';
export default {
  name:'channelList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      status:'',
      classBy:'',
      channelTable:[],
      showPagination:false,
      tableHeight:0,
      appIdList:[],//批量上下架的数组
      totalNum:0,
      sortName:'',
      sortType:''
    }
  },
  watch:{
    inputX(){
      this.replace('channelName',this.inputX);
      this.appIdList=[];//清空选择
    },
    status(){
      this.replace('state',this.status);
      this.appIdList=[];//清空选择
    },
    classBy(){
      this.replace('channelClassify',this.classBy);
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
      if(this.$route.name=='channelList'){
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
    up(state,id){
      if(state==1){
        this.$confirm('确认上架吗？').then(u=>{
          batchUpper({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.channelTable.forEach(v=>{if(v.id==id){v.state=2;}});
            }else{
              this.$message.success('上架成功');
            }
          }).catch(err=>{
            this.channelTable.forEach(v=>{if(v.id==id){v.state=2;}});
          })
        }).catch(error=>{
          this.channelTable.forEach(v=>{if(v.id==id){v.state=2;}});
        })
      }else if(state==2){
        this.$confirm('确认下架吗？').then(u=>{
          batchLower({"ids":[id],"isBatch":false}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
              this.channelTable.forEach(v=>{if(v.id==id){v.state=1;}});
            }else{
              this.$message.success('下架成功');
            }
          }).catch(err=>{
            this.channelTable.forEach(v=>{if(v.id==id){v.state=1;}});
          })
        }).catch(error=>{
          this.channelTable.forEach(v=>{if(v.id==id){v.state=1;}});
        })
      }    
    },
    lotUp(){
      if(this.appIdList.length){
        batchUpper({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要上架的行');
      }
    },
    lotLower(){
      if(this.appIdList.length){
        batchLower({"ids":this.appIdList,"isBatch":true}).then(res=>{
          this.reload();
        })
      }else{
        this.$message.error('请勾选需要下架的行');
      }
    },
    listData(){
      getChannelList(this.$route.query).then(res=>{
        this.channelTable=res.data.items.map(v=>{
            v.channelCover?v.imgUrl=Base64.decode(v.channelCover):null;
            return v;
          });
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
    this.inputX = this.$route.query.channelName||'';
    this.status = this.$route.query.state||'';
    this.classBy = this.$route.query.channelClassify||'';
  },
  updated(){
    if(this.$route.name=='channelList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.channelRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>
<style scoped>

</style>