<template>
  <div>
    <div v-if="$route.name=='playbackVideoManage'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">回放视频管理</span>
      </div>
      <el-row
        class="tac"
        style="padding:15px 0;"
      >
        <span class="myWords">
          视频名称：
          <el-input
            v-model="wd"
            style="width: 220px"
            suffix-icon="el-icon-search"
            maxlength="50"
            placeholder=""
            @change="replace('page',1);"
          ></el-input>
        </span>
        <span class="myWords">
          上传用户：
          <el-input
            v-model="q"
            style="width: 220px"
            suffix-icon="el-icon-search"
            maxlength="50"
            placeholder=""
            @change="replace('page',1);"
          ></el-input>
        </span>
        <span class="myWords">
          用户组：
          <el-select
            v-model="userGroup"
            @change="replace('page',1)"
            style="width: 220px"
          >
          <el-option v-for="(item,i) in userGroupData" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </span>
      </el-row>
      <el-row
        class="tac"
        style="border-bottom:1px solid #eeeeee; padding:15px 0;"
      >
        <span class="myWords">
          回放状态：
          <el-select
            v-model="liveStatus"
            @change="replace('page',1)"
            style="width: 220px"
          >
            <el-option
              label="全部"
              value=""
            ></el-option>
            <el-option
              label="未开播"
              value='0'
            ></el-option>
            <el-option
              label="回放中"
              value='2'
            ></el-option>
            <el-option
              label="已结束"
              value='3'
            ></el-option>
             <el-option
              label="--"
              value='4'
            ></el-option>
          </el-select>
        </span>
        <span class="myWords">
          上传时间：<timeSwitch></timeSwitch>
        </span>
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
        <el-table-column
          prop="videoName"
          label="视频名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="playStatus"
          label="回放状态"
          align="center"
        >
         <template slot-scope="scope">
            <span
              v-if="scope.row.playStatus==0"
            >未开播</span>
            <span
              v-if="scope.row.playStatus==1"
            >直播中</span>
            <span
              v-if="scope.row.playStatus==2"
            >回放中</span>
            <span
              v-if="scope.row.playStatus==3"
            >已结束</span>
            <span
              v-if="!scope.row.playStatus"
            >--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="上传用户"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="userGroup"
          label="用户组"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column
          prop="duration"
          label="视频时长"
          width=""
          align="center"
        >
         <template slot-scope="scope">
            {{scope.row.duration?(parseInt((scope.row.duration)/3600).toString().padStart(2,'0')+':'+parseInt((scope.row.duration%3600)/60).toString().padStart(2,'0')+':'+Math.ceil(scope.row.duration%60).toString().padStart(2,'0')):'0:00'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status==1"
              style="color:#339900;"
            >上架</span>
            <span
              v-if="scope.row.status==2"
              style="color:red;"
            >下架</span>
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
         <el-table-column
          prop="uploadTime"
          label="上传时间"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架/下架"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-switch
             :disabled="scope.row.beDelete"
              v-model="scope.row.status"
              :active-value=1
              :inactive-value=2
              @change="upState(scope.row.status,scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
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
              @click="upState(scope.row.status,scope.row.id,1)"
              :disabled="scope.row.beDelete"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>

<script>
import timeSwitch from "../../share/timeSwitch";
import pagination from "../../share/pagination";
import {
  playbackVideoManageList,
  playbackStatus,groupList
} from "../../http/request";
export default {
  name: "playbackVideoManage",
  inject: ["replace", "reload"],
  data() {
    return {
      wd: "",
      q: "",
      tableData: [],
      tableHeight: 250,
      status: "",
      serverStatus: "",
      serverList: [],
      userGroup: "",
      userGroupData:[],
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
    userGroup() {
      this.replace("userGroup", this.userGroup)
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
      if (this.$route.name == "playbackVideoManage") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      playbackVideoManageList(this.$route.query).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    },
    groupList() {
      groupList().then(res => {
        this.userGroupData=res.data;
        this.userGroupData.unshift({id:'',name:'全部'});
      });
    },
    upState(state, id,del) {
      let serverActionType=state==1&&!del==1?1:state==2&&!del==1?2:3
      playbackStatus({playbackId:id,serverActionType:serverActionType}).then(res=>{
        if(serverActionType){
          this.reload()
        }
      }).catch(err=>{
         if(err==1&&serverActionType !=3){
          this.tableData=this.tableData.map(item=>{
            if(item.id==id){
              item.status=2
            }
             return item
          })
        } else if(err==2&&serverActionType !=3){
          this.tableData=this.tableData.map(item=>{
            if(item.id==id){
              item.status=1
            }
             return item
          })
        }
        })
    },
  },
  created() {
    this.wd = this.$route.query.wd || "";
    this.q = this.$route.query.q || "";
    this.status = this.$route.query.status || "";
    this.userGroup = this.$route.query.userGroup || "";
    this.serverStatus = this.$route.query.serverStatus || "";
    this.liveStatus = this.$route.query.liveStatus || "";
    this.listData();
    this.groupList();
  },
  updated() {
    if (this.$route.name == "playbackVideoManage") {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      });
    }
  },
  components: {
    pagination,
    timeSwitch
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
