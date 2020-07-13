<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户管理</span>
      <el-button style="float:right;" type="primary" @click="$router.push({path:'/createUser'})">添加用户</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        手机号
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入手机号" @change="replace('page',1);"></el-input>
      </span>
      <span class="myWords">
        用户组
        <el-select v-model="userGroupId" style="width:150px;" @change="replace('page',1);">
          <el-option v-for="(item,i) in userGroupList" :key=i :label="item.name" :value="item.id"></el-option>
        </el-select>
      </span>
      <span class="myWords">
        账号状态
        <el-select v-model="status" style="width:150px;" @change="replace('page',1);">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </span>
    </el-row>
    <el-table ref="userRef" :data="userTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="userGroupName" label="用户组" align="center"></el-table-column>
      <el-table-column prop="departmentName" label="所属单位" align="center"></el-table-column>
      <el-table-column prop="sex" label="性别" width="50" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.sex==1">男</span>
          <span v-if="scope.row.sex==2">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="status" label="账号状态(启用/禁用)" width="180" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            @change="up(scope.row.status,scope.row.id)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push({path:'/createUser',query:{id:scope.row.id}})">编辑</el-button>
          <el-button type="warning" size="mini" @click="resetPwd(scope.row.id)">重置密码</el-button>
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
import {getUserList,setStatus,resetPassword,userDropDown} from '../../http/request'
export default {
  name:'userList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      status:'',
      userGroupId:'',
      userGroupList:[],
      userTable:[],
      tableHeight:0,
      totalNum:0
    }
  },
  watch:{
    inputX(){
      this.replace('phone',this.inputX);
    },
    status(){
      this.replace('status',this.status);
    },
    userGroupId(){
      this.replace('userGroupId',this.userGroupId);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='userList'){
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
        setStatus({id,status}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
          }else{
            this.$message.success(res.msg);
            this.listData();
          }
        }).catch(err=>{
          this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
        })
      }).catch(error=>{
        this.userTable.forEach(v=>{if(v.id==id){v.status=resetStatus;}});
      })
    },
    resetPwd(id){
      resetPassword({id}).then(res=>{
        
      })
    },
    getDropDown(){
      userDropDown().then(res=>{
        this.userGroupList = res.data;
        this.userGroupList.unshift({id:'',name:'全部'});
      })
    },
    listData(){
      getUserList(this.$route.query).then(res=>{
        this.userTable=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.getDropDown();
    this.listData();
    this.inputX = this.$route.query.phone||'';
    this.status = this.$route.query.status||'';
    this.userGroupId = this.$route.query.userGroupId?parseInt(this.$route.query.userGroupId):'';
  },
  updated(){
    if(this.$route.name=='userList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>