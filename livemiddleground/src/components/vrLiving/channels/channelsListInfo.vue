<template>
  <div>
    <div v-if="$route.name=='channelsListInfo'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="$router.go(-1)" content="管理频道" style="font-size:24px;font-weight:bold;color:#614a4d;">
        </el-page-header>
      <el-button  style="top:10px;position:absolute;right:15px;" type="primary" @click="$router.push({path:'/channelsList/channelsCreate',query:{msg:JSON.stringify($route.query)}})">频道编辑</el-button>
      </div>
      <div style="overflow:hidden;margin-top:20px;position:relative">
        <img :src="formSize.channelCover?`${formSize.channelCover}`:null" alt=""  style="width:200px;height:200px;float:left" v-focus>
        <div style="position:absolute;left:220px">
        <h3>{{formSize.channelName}}</h3>
        <h5>副标题：{{formSize.channelViceTopic}}</h5>
        <p>简介：{{formSize.channelBrief}}</p>
        <p>状态：<span v-if="formSize.state==1">上架</span>
            <span v-if="formSize.state==2" style="color:#FF644E">下架</span></p>
        </div>
        </div>
      <el-divider></el-divider>
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:16px;color:#614a4d;">直播间数量：{{formSize.liveNum}}</span>
        <span style="font-size:16px;color:#614a4d;padding-left:60px;">在线观看人数：{{formSize.onlineViewing}}</span>
        <el-button  style="float:right;" type="primary"  @click="$router.push(`/live/addLive?roomId=${$route.query.id}`)">创建直播间</el-button>
      </div>
      <el-table ref="groundRef" :data="tableData" border style="width: 100%;margin-bottom:32px" class="mt15">
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="liveCover" label="封面图" align="center" width="120">
         <template slot-scope="scope">
            <img :src="scope.row.liveCover?`${scope.row.liveCover}`:null" alt=""  style="width:70px;height:70px;" v-focus>
        </template>
        </el-table-column>
        <el-table-column prop="liveName" label="直播间名称" align="center" width="180">
           <template slot-scope="scope">
            {{ scope.row.liveName.length>15?scope.row.liveName.substring(0,15)+'......':scope.row.liveName}}
          </template>
        </el-table-column>
        <el-table-column prop="liveState" label="直播状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.liveState==0">未开播</span>
            <span v-if="scope.row.liveState==1">直播中</span>
<!--            <span v-if="scope.row.liveState==2">回放中</span>-->
            <span v-if="scope.row.liveState==3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="isNeedPassword" label="直播间密码" align="center" width="120">
           <template slot-scope="scope">
            <span v-if="scope.row.isNeedPassword==0">有</span>
            <span v-if="scope.row.isNeedPassword==1">无</span>
          </template>
        </el-table-column>
        <el-table-column prop="liveNetRule" label="网络规则" align="center" width="">
            <template slot-scope="scope">
              <span v-if="scope.row.liveNetRule==1">公网</span>
              <span v-if="scope.row.liveNetRule==0">内网</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastLiveTime" label="上次直播时间" align="center" width="100">
            <template slot-scope="scope">
            {{ scope.row.lastLiveTime?scope.row.lastLiveTime:'--'}}
          </template>
        </el-table-column>
        <el-table-column prop="cameraNum" label="机位数" align="center" width="120">
        </el-table-column>
        <el-table-column prop="onlineViewing" label="在线观看人数" align="center" width="120">
        </el-table-column>
        <el-table-column prop="liveUrl" label="直播地址" align="center" width="120">
          <template slot-scope="scope">
          <el-button type="text" @click="openWin(scope.row.id,scope.row.liveState,scope.row.isOnShelf)" >观看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="recordUrl" label="回放地址" align="center" width="120">
          <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.liveState==2" @click="openWin2(scope.row.id)">观看</el-button>
          <span v-else>--</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="isOnShelf" label="状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.isOnShelf==1">上架</span>
            <span v-if="scope.row.isOnShelf==2" style="color:#FF644E">下架</span>
          </template>
        </el-table-column>
         <el-table-column prop="isOnShelf" label="上架/下架" align="center" width="120">
          <template slot-scope="scope">
            <el-switch
                :disabled="scope.row.liveState==1||scope.row.liveState==2"
                v-model="scope.row.isOnShelf"
                :active-value='1'
                :inactive-value='2'
                @change="upState(scope.row.isOnShelf,scope.row.id)"
              >
              </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center" >
          <template slot-scope="scope">
            <el-button  type="warning" size="mini" @click="oneKey({id:scope.row.id})"  v-if="scope.row.liveState==1&&scope.row.isOnShelf==1">一键下播</el-button>
            <!-- <el-button  type="primary" size="mini" @click="stopReview({id:scope.row.id})" v-if="scope.row.liveState==2&&scope.row.isOnShelf==1">停止回放</el-button> -->
            <el-button type="success"  size="mini"  @click="$router.push({path:'/live/editLive',query:{id:scope.row.id}})" v-if="scope.row.liveState==3&&scope.row.isOnShelf==1||scope.row.liveState==0&&scope.row.isOnShelf==1">直播设置</el-button>
            <!-- <el-button  type="primary" size="mini" @click="playV=true;roomId=scope.row.id" v-if="scope.row.liveState==0&&scope.row.isOnShelf==1||scope.row.liveState==3&&scope.row.isOnShelf==1" >回放设置</el-button> -->
            <el-button type="danger" size="mini" @click="del(scope.row.id)"  v-if="scope.row.isOnShelf==2">删除</el-button>
            <!-- <el-button  size="mini" @click="playV=true;roomId=scope.row.id;playType='dis'" v-if="scope.row.liveState==2">回放详情</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="total"></pagination>
      </div>
       <div>
        <el-dialog title="提示" :visible.sync="playV" width="30%" >
          <span><playBack v-if="playV" :roomId="roomId" ref="playBack"></playBack></span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="playV = false">取 消</el-button>
            <el-button type="primary" @click="addP()" :disabled="playType=='dis'">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>

    </div>
</template>

<script>
import { Base64 } from 'js-base64'
import pagination from '../../../share/pagination'
import playBack from '../../liveControl/playBack/playBack'
import {channelsInfo,roomsList,roomsUpper,roomsLower,oneKeyEndLive2,stopReview,getVideoUrl,queryReplayListByRoomId} from '../../../http/request'
export default {
  name: 'channelsListInfo',
  inject: ['replace', 'reload'],
  components: {
    pagination,
    playBack
  },
  data () {
    return {
      tableData: [
      ],
      roomId:'',
      formSize: {
        channelsName: '',
        channelsClassify: '',
        channelsBrief: '',
        channelsCover: '',
        channelsViceTopic: '',
      },
      total: 0,
      playV:false,
      playType:'edit'
    }
  },
  computed: {

  },
  watch: {
    $route () { // 判断路由query变化执行请求
      if (this.$route.name == 'channelsListInfo') {
        this.listData();
        this.infoData();
      }
    }
  },
  methods: {
   oneKey(params){
     oneKeyEndLive2(params).then(res=>{
        if (res.code) {
          this.$message.error(res.msg)
        } else {
         this.reload()
        }
     })
   },
   stopReview(params){
     stopReview(params).then(res=>{
        if (res.code) {
          this.$message.error(res.msg)
        } else {
         this.reload()
        }
     })
   },
   infoData () {
      channelsInfo({id: this.$route.query.id}).then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.formSize = res.data
          this.formSize.channelCover = `/static/${Base64.decode(this.formSize.channelCover)}`
        }
      })
    },
    listData () {
      roomsList({...this.$route.query, orderBy: 1,channelId:this.$route.query.id}).then(res => {
        this.tableData = res.data.items
        this.tableData = this.tableData.map(v => {
          if (v.liveCover) {
            v.liveCover = `/static/${Base64.decode(v.liveCover)}`
          }
          return v
        })
        this.total= res.data.total
      })
    },
     upState (state, id) {
      if (state === 2) {
        roomsLower({id, state}).then(res => {
          if (res.code) {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.tableData = this.tableData.map(item => {
            if (item.id == id) {
              item.isOnShelf = 1
            }
            return item
          })
        })
      } else {
        roomsUpper({id, state}).then(res => {
          if (res.code) {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.tableData = this.tableData.map(item => {
            if (item.id == id) {
              item.isOnShelf = 2
            }
            return item
          })
        })
      }
    },
    addP(){
              this.$refs.playBack.savePlayback();
          },
    //直播
    openWin(id,liveState,state) {
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
      //回放
     openWin2(roomId,liveState,state,playBack) {
        queryReplayListByRoomId({roomId:roomId}).then(res=>{
        if(res.data){
          // let index=res.data.cameras.map(v=>v.camareId).indexOf(camareId)
          let videoUrl =res.data.cameras[index].files.length?res.data.cameras[index].files[0].fileId:null
          let routes = this.$router.resolve({ name: "playAliplayer2" });
          let status =res.data.cameras[index].files.length?res.data.cameras[index].files[0].resolvingName:null
          window.open(`${routes.href}?videoUrl=${videoUrl}&roomId=${roomId}&status=${status}&first=1`, "win2","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error(res.msg)
        }
      })
      }
  },
  created () {
    this.listData()
    this.infoData()
  }
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
