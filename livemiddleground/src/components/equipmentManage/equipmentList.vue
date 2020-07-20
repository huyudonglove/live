<template>
  <div>
    <div v-if="$route.name=='equipmentList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">设备管理</span>
         <el-button  style="float:right;" type="primary" @click="edit()">添加设备</el-button>
      </div>
      <el-table ref="multipleTable" :data="tableData" border style="width: 100%" class="mt15 mb15 el-table"  v-cloak>
        <el-table-column  prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column  prop="name" label="设备名称" width="180" align="center"></el-table-column>
        <el-table-column prop="resolvingName" label="分辨率" align="center" width="120">
      </el-table-column>
        <el-table-column  prop="relativePath" label="直播推流地址" width="" align="center">
          <template slot-scope="scope">
            rtmp://{{scope.row.address}}:{{scope.row.pushPort}}{{scope.row.relativePath}}
          </template>
        </el-table-column>
        <el-table-column  prop="serverName" label="服务器" width="150" align="center"></el-table-column>
        <el-table-column  prop="address" label="服务器IP" width="150" align="center"></el-table-column>
        <el-table-column  prop="detailPositionName" label="投放位置" width="150" align="center">
             <template slot-scope="scope">
            {{ scope.row.detailPositionName?scope.row.detailPositionName:'--'}}
          </template>
        </el-table-column>
        <el-table-column prop="onlineStatus" label="在线状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.onlineStatus==1" style="color:#339900;">在线</span>
            <span v-if="scope.row.onlineStatus==2" style="color:red;">离线</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  prop="onlineTime" label="在线时长" width="150" align="center"></el-table-column> -->
         <el-table-column prop="status" label="启用状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1" style="color:#339900;">启用</span>
            <span v-if="scope.row.status==2" style="color:red;">停用</span>
            <span v-if="scope.row.status==3" style="color:red;">删除</span>
          </template>
        </el-table-column>
        <el-table-column  prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
        <!-- <el-table-column prop="state" label="启用/停用" align="center" width="120">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" :active-value='1' :inactive-value='2'
              :disabled="scope.row.onlineStatus==1"
              @change="upState(scope.row.state,scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" fixed="right" width="180" align="center" key=3>
          <template slot-scope="scope">
            <!-- <el-button type="success" size="mini" @click="del(scope.row.id)" :disabled="scope.row.onlineStatus==1">预览</el-button> -->
            <el-button type="primary" size="mini" @click="edit(scope.row.id)">编辑</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)" :disabled="scope.row.liveState==1||scope.row.liveState==2">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <dialogDel :fSee="dialogDelShow"  @dialogDelClose="dialogDelClose" :id="id">
    </dialogDel>
    <dialogEdit :fSee="dialogEditShow"  @dialogEditClose="dialogEditClose" :id="id">
    </dialogEdit>
    </div>
  </div>
</template>

<script>
import {
  queryDeviceManageList,deviceBinding,deleteDeviceBinding
} from "../../http/request";
import dialogDel from './dialogDel'
import dialogEdit from './dialogEdit'
export default {
  name: "equipmentList",
  inject: ["replace", "reload"],
  data() {
    return {
      dialogDelShow:false,
      dialogEditShow:false,
      wd: "",
      q: "",
      tableData: [
      ],
      status: "",
      serverStatus: "",
      serverList: [],
      GroupStatus: "",
      liveStatus: "",
      total: 0,
      id:0,
    };
  },
  computed: {},
  watch: {
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "equipmentList") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      queryDeviceManageList(this.$route.query).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    },
    upState(state, id) {},
    del(id) {
     deviceBinding({deviceId:id}).then(res => {
       if(res.data.length){
         this.dialogDelShow = true;
       }else{
          deleteDeviceBinding({deviceId:id}).then(res=>{
          if (res.code) {
            this.$message.error(res.msg)
          } else {
            this.reload()
          }
        })
       }
      });
     
     this.id=id
    },
    dialogDelClose(){
      this.dialogDelShow = false;
    },
    dialogEditClose(){
      this.dialogEditShow=false
    },
    edit(id){
      this.dialogEditShow=true
      this.id=id
    }
  },
  created() {
    this.listData();
  },
  updated() {
    if (this.$route.name == "equipmentList") {
    }
  },
  components: {
    dialogDel,
    dialogEdit
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
