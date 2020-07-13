<template>
  <div>
    <div v-if="$route.name=='pushAddressManage'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">推流地址管理</span>
      </div>
      <el-row
        class="tac"
        style="padding:15px 0;"
      >
        <!-- <span>
          <label style="padding-left:15px;">域名：</label>
          <el-input
            v-model="wd"
            style="width: 220px"
            suffix-icon="el-icon-search"
            maxlength="50"
            placeholder=""
            @change="replace('page',1);"
          ></el-input>
        </span> -->
        <span class="myWords">
          服务器：
          <el-select
            v-model="serverStatus"
            @change="replace('page',1)"
            style="width: 220px"
          >
          <el-option v-for="(item,i) in serverList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
        <!-- <span>
          用户组：
          <el-select
            v-model="GroupStatus"
            @change="replace('page',1)"
            style="width: 220px"
          >
            <el-option  label="全部" value=""></el-option>
            <el-option  label="启用" value='1'></el-option>
            <el-option  label="禁用" value='2'></el-option>
          </el-select>
        </span> -->
        <span class="myWords">
          <label style="padding-left:15px;">启用状态：</label>
          <el-select
            v-model="status"
            @change="replace('page',1)"
            style="width: 220px"
          >
            <el-option  label="全部" value=""></el-option>
            <el-option  label="启用" value='1'></el-option>
            <el-option  label="禁用" value='2'></el-option>
          </el-select>
        </span>
        <span class="myWords">
          在线状态：
          <el-select
            v-model="liveStatus"
            @change="replace('page',1)"
            style="width: 220px"
          >
            <el-option  label="全部" value=""></el-option>
            <el-option  label="在线" value='1'></el-option>
            <el-option  label="离线" value='2'></el-option>
          </el-select>
        </span>
        <!-- <span>
          所属用户：
          <el-input
            v-model="q"
            style="width: 220px"
            suffix-icon="el-icon-search"
            maxlength="50"
            placeholder=""
            @change="replace('page',1);"
          ></el-input>
        </span> -->
      </el-row>
    
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="mt15 mb15 el-table"
        :max-height="tableHeight"
        v-cloak
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column  prop="relativePath" label="直播推流地址" width="" align="center">
          <template slot-scope="scope">
            rtmp://{{scope.row.address}}:32293{{scope.row.relativePath}}
          </template>
        </el-table-column>
        <el-table-column  prop="serverName" label="服务器" width="150" align="center"></el-table-column>
        <el-table-column  prop="address" label="服务器IP" width="150" align="center"></el-table-column>
        <el-table-column
          prop="userName"
          label="所属用户"
          align="center"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="groupName"
          label="用户组"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="启用状态"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status==1"
              style="color:#339900;"
            >启用</span>
            <span
              v-if="scope.row.status==2"
              style="color:red;"
            >停用</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="onlineStatus"
          label="在线状态"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.onlineStatus==1"
              style="color:#339900;"
            >在线</span>
            <span
              v-if="scope.row.onlineStatus==2"
              style="color:red;"
            >离线</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="beDelete"
          label="是否删除"
          align="center"
          width="150"
        >
         <template slot-scope="scope">

          <span
              v-if="scope.row.beDelete"
              style="color:red;"
            >已删除</span>
            <span
              v-if="!scope.row.beDelete"
            >--</span>
         </template>
        </el-table-column>
        <!-- <el-table-column prop="state" label="启用/禁用" align="center" width="120">
          <template slot-scope="scope">
          <el-switch
          v-model="scope.row.state"
          :active-value='1'
          :inactive-value='2'
          @change="upState(scope.row.state,scope.row.id)"
        >
        </el-switch>
          </template>
      </el-table-column> -->
        <!-- <el-table-column
          label="操作"
          fixed="right"
          width="150"
          align="center"
          key=3
        >
          <template slot-scope="scope">
            <el-button
              type="danger"
              size="mini"
              @click="del(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "../../share/pagination";
import { pushAddressManageList,serverDropDown} from "../../http/request";
export default {
  name: "pushAddressManage",
  inject: ["replace", "reload"],
  data() {
    return {
      wd: "",
      q: "",
      tableData: [],
      tableHeight: 250,
      status: "",
      serverStatus: "",
      serverList:[],
      GroupStatus: "",
      liveStatus: "",
      total: 0
    };
  },
  computed: {},
  watch: {
    wd() {
      this.replace("wd", this.wd);
    },
    q() {
      this.replace("q", this.q);
    },
    GroupStatus() {
      this.replace("GroupStatus", this.GroupStatus)
    },
    status() {
      this.replace("status", this.status)
    },
    serverStatus() {
      this.replace("serverStatus", this.serverStatus)
    },
    liveStatus() {
      this.replace("liveStatus", this.liveStatus)
    },
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "pushAddressManage") {
        this.listData();
      }
    }
  },
  methods: {
    getDropDown(){
      serverDropDown().then(res=>{
        this.serverList = res.data.items;
        this.serverList.unshift({id:'',name:'全部'});
      })
    },
    listData() {
      pushAddressManageList({...this.$route.query,needUserInfo:true}).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    },
    // upState(state, id){

    // },
    // del (id) {
    //   pushAddressManageDel({id: id}).then(res => {
    //     if (res.code) {
    //       this.$message.error(res.msg)
    //     } else {
    //       this.reload()
    //     }
    //   })
    // },
  },
  created() {
    this.wd = this.$route.query.wd || "";
    this.q = this.$route.query.q || "";
    this.status =this.$route.query.status || "";
    this.GroupStatus = this.$route.query.GroupStatus || "";
    this.serverStatus = this.$route.query.serverStatus || "";
    this.liveStatus = this.$route.query.liveStatus || "";
    this.listData();
    this.getDropDown()
  },
  updated() {
    if (this.$route.name == "pushAddressManage") {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      });
    }
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
