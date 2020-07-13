<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">直播管理</span>
        <el-button style="float:right;" type="primary" @click="$router.push('/live/addLive')">新建直播</el-button>
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <span class="myWords">
          <el-input v-model="liveName" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="直播间名称" @change="replace('page',1)"></el-input>
        </span>
        <span class="myWords">
          <span class="myWords">直播状态：</span>
          <el-select v-model="liveState" style="width:150px;" @change="replace('page',1)">
            <el-option label="全部" value=""></el-option>
            <el-option label="未开播" value="0"></el-option>
            <el-option label="直播中" value="1"></el-option>
<!--            <el-option label="回放中" value="2"></el-option>-->
            <el-option label="已结束" value="3"></el-option>
          </el-select>
        </span>
      </el-row>
      <el-table ref="liveRef" :data="liveData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" >
        <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
        <el-table-column prop="liveCover" label="封面图" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.imageUrl" alt="" width="80px" height="80px" v-focus>
            </template>
        </el-table-column>
        <el-table-column prop="liveName" label="直播间名称" align="center" >
          <template slot-scope="scope">
            <span class="myTable"> {{scope.row.liveName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="liveState" label="直播状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.liveState==0">未开播</span>
            <span v-if="scope.row.liveState==1">直播中</span>
<!--            <span v-if="scope.row.liveState==2">回放中</span>-->
            <span v-if="scope.row.liveState==3">已结束</span>
          </template>
        </el-table-column>
        <el-table-column prop="isNeedPassword" label="直播间密码" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isNeedPassword==0" >有</span>
            <span v-if="scope.row.isNeedPassword==1" >无</span>
          </template>
        </el-table-column>
        <el-table-column prop="liveNetRule" label="网络规则" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.liveNetRule==0" >内网</span>
            <span v-if="scope.row.liveNetRule==1" >公网</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastLiveTime" label="上次直播时间" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.lastLiveTime">{{scope.row.lastLiveTime}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
<!--        <el-table-column prop="transcodingRatio" label="直播分辨率" align="center"></el-table-column>-->
        <el-table-column prop="cameraNum" label="机位数" align="center"></el-table-column>
        <el-table-column prop="onlineViewing" label="在线观看人数" align="center"></el-table-column>
        <el-table-column prop="liveUrl" label="直播地址" align="center">
           <template slot-scope="scope">
          <el-button type="text" @click="openWin(scope.row.id,scope.row.liveState,scope.row.isOnShelf)" >观看</el-button>
          </template>
        </el-table-column>
<!--        <el-table-column prop="recordUrl" label="回放地址" align="center">-->
<!--          <template slot-scope="scope">-->
<!--          <el-button type="text" v-if="scope.row.liveState==2" @click="openWin2(scope.row.id)">观看</el-button>-->
<!--          <span v-else>&#45;&#45;</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column prop="isOnShelf" label="上架状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.isOnShelf==1">上架</span>
            <span v-if="scope.row.isOnShelf==2">下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="上下架" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.isOnShelf" :active-value="1" :inactive-value="2" @change="changeLive(scope.row)" :disabled="scope.row.liveState==1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="250" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.isOnShelf==1" >
              <el-button type="warning" size="mini" v-if="scope.row.liveState==1" @click="oneKeyEndLive(scope.row.id)" style="margin-top: 10px">一键下播</el-button>
              <el-button type="primary" size="mini" @click="$router.push({path:'/live/editLive',query:{id:scope.row.id}})" v-if="scope.row.liveState==0 ||scope.row.liveState==3" style="margin-top: 10px">直播设置</el-button>
<!--              <el-button v-if="scope.row.liveState==0 ||scope.row.liveState==3" size="mini" @click="playV=true;roomId=scope.row.id" style="margin-top: 10px">回放设置</el-button>-->
<!--              <el-button type="primary" size="mini" v-if="scope.row.liveState==2" @click="stopReviewH(scope.row.id)" style="margin-top: 10px">停止回放</el-button>-->
<!--              <el-button  size="mini" @click="playV=true;roomId=scope.row.id;playType='dis'" v-if="scope.row.liveState==2" style="margin-top: 10px">回放详情</el-button>-->
            </div>
            <el-button type="danger" size="mini" @click="deleteLive(scope.row.id)" v-if="scope.row.isOnShelf==2" style="margin-top: 10px">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
        <pagination :totalNum='total'></pagination>
      </div>
      <div>
        <el-dialog title="回放设置" :visible.sync="playV" width="30%" >
          <span><playBack v-if="playV" :roomId="roomId" ref="playBack" ></playBack></span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="playV = false">取 消</el-button>
            <el-button type="primary" @click="addP()" :disabled="playType=='dis'">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>,

<script>
  import pagination from '../../share/pagination'
  import {getLiveList,deleteLive,upLive,downLive,oneKeyEndLive,getVideoUrl,queryReplayListByRoomId,stopReviewH} from "../../http/request";
  import { Base64 } from 'js-base64';
  import playBack from './playBack/playBack'
  export default {
        name: "liveList",
        data(){
          return{
            liveName:'',
            liveState:'',
            liveData:[],
            tableHeight:0,
            total:0,
            playV:false,
            roomId:'',
            playType:'edit'
          }
        },
      inject:['replace','reload'],
      components:{
          pagination,
          playBack
      },
    methods:{
          getLiveList(){
            let msg={
              pageSize:this.$route.query.limit||20,
              pageNum:this.$route.query.page||1,
              liveName:this.$route.query.word,
              liveState:this.$route.query.state
            }
            getLiveList(msg).then(v=>{
              this.total=v.data.total;
              this.liveData=v.data.items;
              this.liveData.map(v=>{
                v.imageUrl=`/static/${Base64.decode(v.liveCover)}`
              })
              //console.log(this.liveData,777)
            })
          },
          deleteLive(id){
              deleteLive(id).then(res=>{
                 this.getLiveList();
              })
          },
          changeLive(row){
              console.log(row)
            row.isOnShelf==1&&(()=>{
              this.$confirm('确认上架吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                upLive(row.id).then(res=>{
                  !res.code&&(()=>{
                    this.$message.success(res.msg)
                    this.getLiveList()
                  })();
                  res.code&&(()=>{
                    this.$message.error(res.msg)
                    this.getLiveList();
                  })();
                });
              }).catch(() => {
                this.getLiveList();
              });
            })();
            row.isOnShelf==2&&(()=>{
              this.$confirm('确认下架吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                downLive(row.id).then(res=>{
                  !res.code&&(()=>{
                    this.$message.success(res.msg)
                    this.getLiveList()
                  })();
                  res.code&&(()=>{
                    this.$message.error(res.msg)
                    this.getLiveList();
                  })();
                });
              }).catch(() => {
                this.getLiveList();
              });
            })();
          },
          oneKeyEndLive(id){
            this.$confirm('确认下播吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              center: true
            }).then(() => {
              console.log(111111111)
              oneKeyEndLive(id).then(res=>{
                res.code&&(()=>{
                  this.$message.error(res.msg)
                  this.getLiveList()
                })();
                !res.code&&(()=>{
                  this.$message.success(res.msg)
                  this.getLiveList();
                })();
              });
            }).catch(() => {
              console.log(2222)
              this.getLiveList();
            });
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
          let status =res.data.cameras[0].files[0].resolvingName
          // window.open(`${routes.href}?videoUrl=${videoUrl}&id=${id}`, "_blank","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
          window.open(`${routes.href}?videoUrl=${videoUrl}&roomId=${roomId}&status=${status}&first=1`, "win2","height=800,width=1000,toolbar =no, menubar=yes, scrollbars=no, resizable=no, location=no, status=no");
        }else{
          this.$message.error(res.msg)
        }
      })
      },
      stopReviewH(id){
            stopReviewH(id).then(res=>{
              res.code&&this.$message.error(res.msg)&&this.getLiveList();
              !res.code&&this.$message.success(res.msg)&&this.getLiveList();
            })
      }
    },
    watch:{
      liveName(){
        this.replace('word',this.liveName)
      },
      liveState(){
        this.replace('state',this.liveState)
      },
      $route(){
        this.getLiveList();
      }
    },
    created(){
          console.log(this.$route.query)
          this.liveName=this.$route.query.word||'';
          this.liveState=this.$route.query.state||'';
          this.getLiveList();
    },
      updated(){
          this.$nextTick(()=>{
            this.tableHeight = window.innerHeight - this.$refs.liveRef.$el.offsetTop - 110;
          })
      }
    }
</script>

<style scoped>

</style>
