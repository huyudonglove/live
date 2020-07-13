<template>
  <div>
    <div v-if="$route.name=='vrPlayback'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">VR直播回放</span>
      </div>
      <el-row
        class="tac"
        style="padding:15px 0;"
      >
        <span class="myWords">
          直播间名称：
          <el-input v-model="roomName" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入直播间名称" @change="replace('page',1);"></el-input>
        </span>
       <span class="myWords">
         
          回放状态：
          <el-select
            v-model="status"
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
          prop="roomName"
          label="直播间名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="videoName"
          label="回放名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="deviceCount"
          label="机位数量"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="直播开始时间"
          align="center"
          width=""
        >
        </el-table-column>
        <el-table-column
          prop="endTime"
          label="直播结束时间"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="回放创建时间"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          prop="playStatus"
          label="回放状态"
          align="center"
          width="150"
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
              style="color:red;"
            >已结束</span>
            <span
              v-if="!scope.row.playStatus"
            >--</span>
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
            >上架</span>
            <span
              v-if="scope.row.status==2"
              style="color:red;"
            >下架</span>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          align="center"
          key=3
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="dialogTableVisible=true;getData(scope.row.id,scope.row.playStatus,scope.row.status,scope.row.roomId)"
              :disabled="scope.row.status==2"
            >机位列表</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="del(scope.row.id)"
              :disabled="scope.row.playStatus==0||scope.row.playStatus==2"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :totalNum="total"></pagination>
      <el-dialog title="机位列表" :visible.sync="dialogTableVisible">
      <el-table :data="gridData"  border style="width: 100%" class="mt15 mb15 el-table">
        <el-table-column property="id" label="id" width="150"  align="center"></el-table-column>
        <el-table-column property="createTime" label="日期" width="180"  align="center"></el-table-column>
        <el-table-column property="camareName" label="机位名称"  align="center"></el-table-column>
        <el-table-column label="操作" width="200"  align="center">
          <template slot-scope="scope">
            <el-button type="primary"  size="mini" @click="openWin(roomId,scope.row.camareId,scope.row.id,scope.row.playbackId)">预览</el-button>
          </template>
          <!-- <a class="btn">下载</a> -->
        </el-table-column>
      </el-table>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import pagination from "../../share/pagination";
import {
  vrPlaybackList,vrPlaybackCamera,
  vrPlaybackDel,queryReplayList
} from "../../http/request";
export default {
  name: "vrPlayback",
  inject: ["replace", "reload"],
  data() {
    return {
      wd: "",
      q: "",
      tableData: [
      ],
      tableHeight: 250,
      status: "",// 未开播-0 直播中- 1 回放中- 2 已结束 -3 
      roomName: "",
      roomsList: [],
      total: 0,
      roomId:null,
      liveState:'',
      isOnShelf:'',
      gridData:[
      ],
      dialogTableVisible:false
    };
  },
  computed: {
  },
  watch: {
    status() {
      this.replace("status", this.status)
    },
    roomName() {
      this.replace("roomName", this.roomName)
    },
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "vrPlayback") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      vrPlaybackList({...this.$route.query}).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    },
    del(id) {
      vrPlaybackDel({ playbackId: id,serverActionType:3}).then(res => {
        if (res.code) {
          this.$message.error(res.msg);
        } else {
          this.reload();
        }
      });
    },
    getData(id,liveState,isOnShelf,roomId){
      // console.log(id,liveState,isOnShelf)
      this.roomId=roomId
      this.liveState=liveState
      this.isOnShelf=isOnShelf
      vrPlaybackCamera({playbackId:id}).then(res=>
      {
        this.gridData = res.data;
      })
    },
    openWin(roomId,camareId,id,playbackId) {
        queryReplayList({replayId:playbackId}).then(res=>{
        if(res.data){
          let index=res.data.cameras.map(v=>v.camareId).indexOf(camareId)
          let videoUrl =res.data.cameras[index].files.length?res.data.cameras[index].files[0].fileId:null
          let routes = this.$router.resolve({ name: "playAliplayer2" });
          let status =res.data.cameras[index].files.length?res.data.cameras[index].files[0].resolvingName:null
          // window.open(`${routes.href}?videoUrl=${videoUrl}&id=${id}`, "_blank","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
          window.open(`${routes.href}?playbackId=${playbackId}&videoUrl=${videoUrl}&roomId=${roomId}&camareId=${camareId}&status=${status}&first=2`, "win2","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error(res.msg)
        }
      })
      }
  },
  created() {
    this.wd = this.$route.query.wd || "";
    this.q = this.$route.query.q || "";
    this.status = this.$route.query.status || "";
    this.liveStatus = this.$route.query.liveStatus || "";
    this.listData();
  },
  updated() {
    if (this.$route.name == "vrPlayback") {
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
.btn
{
  display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
    font-size: 12px;
    border-radius: 3px;
    padding: 7px 15px;
}
</style>
