<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户组管理</span>
      <el-button style="float:right;" type="primary" @click="$router.push({path:'/createGroup'})">添加用户组</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        用户组名称
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入用户组名称" @change="replace('page',1);"></el-input>
      </span>
      <span class="myWords">
        状态
        <el-select v-model="status" style="width:150px;" @change="replace('page',1);">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </span>
    </el-row>
    <el-table ref="userRef" :data="groupTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="用户组名称" align="center"></el-table-column>
      <el-table-column prop="userCount" label="用户数量" width="100" align="center"></el-table-column>
      <el-table-column prop="status" label="状态(启用/禁用)" width="150" align="center">
        <template slot-scope="scope">
          <el-switch
            :disabled="scope.row.userCount"
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="up(scope.row.status,scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push({path:'/createGroup',query:{id:scope.row.id}})">编辑</el-button>
          <el-button :disabled="scope.row.userCount" type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
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
import {getGroupList,setGroupStatus,delGroup} from '../../http/request'
export default {
  name:'groupList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      status:'',
      groupTable:[],
      tableHeight:0,
      totalNum:0
    }
  },
  watch:{
    inputX(){
      this.replace('name',this.inputX);
    },
    status(){
      this.replace('status',this.status);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='groupList'){
        this.listData();
      }
    }
  },
  methods:{
    up(status,id){
      let notice,resetStatus;
      if(status==1){
        notice = '确认启用吗？';
        resetStatus = 2;
      }else{
        notice = '确认禁用吗？';
        resetStatus = 1;
      }
      this.$confirm(notice).then(u=>{
        setGroupStatus({id,status}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.groupTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
          }else{
            this.$message.success(res.msg);
            this.listData();
          }
        }).catch(err=>{
          this.groupTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
        })
      }).catch(error=>{
        this.groupTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
      })
    },
    del(id){
      delGroup({id}).then(res=>{
        if(this.groupTable.length==1){
          this.replace('page',1);
        }
        this.reload();
      })
    },
    listData(){
      getGroupList(this.$route.query).then(res=>{
        this.groupTable=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
    this.inputX = this.$route.query.name||'';
    this.status = this.$route.query.status||'';
  },
  updated(){
    if(this.$route.name=='groupList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>