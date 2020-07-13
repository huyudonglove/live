<template>
    <div>
      <p>
        <span class="h-span">回放名称: </span>
        <el-tag v-if="playRow.videoName">{{playRow.videoName}}</el-tag> <el-button @click="listPlaybackView();visible=true">+</el-button>
      </p>
      <p>
        <span class="h-span">回放时间设置:</span>
        <el-radio v-model="type" :label="1">设置时间</el-radio>
<!--        <el-radio v-model="type" :label="2">不限制</el-radio>-->
      </p>
      <p v-if="type==1">
        <span class="h-span">回放开始时间:</span>
        <el-date-picker type="datetime" placeholder="选择时间日期" v-model="startTime" style="width: 50%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </p>
      <p v-if="type==1">
        <span class="h-span">回放结束时间:</span>
        <el-date-picker type="datetime" placeholder="选择时间日期" v-model="endTime" style="width: 50%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
      </p>
      <p>
        <span class="h-span">回放密码：</span>
        <el-radio v-model="needPassword" :label="2">无</el-radio>
        <el-radio v-model="needPassword" :label="1">有</el-radio>
        <el-input v-model="password" v-if="needPassword==1" style="width: 150px"></el-input>
      </p>
      <div>
        <el-dialog title="选择回放" :visible.sync="visible" width="40%"  append-to-body>
          <el-table :data="playList" style="width: 100%">
            <el-table-column prop="roomName" label="直播间名称" width="180">
            </el-table-column>
            <el-table-column prop="videoName" label="回放名称" width="180">
            </el-table-column>
            <el-table-column prop="deviceCount" label="机位数量">
            </el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="pickPlay(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {listPlaybackView,savePlayback,getPlayBack} from "../../../http/request";

  export default {
        name: "playBack",
        props:['roomId'],
        inject:['reload'],
        data(){
          return{
            visible:false,
            playList:[],
            playRow:{},
            type:1,
            needPassword:2,
            password:'',
            startTime:'',
            endTime:'',
            replayId:'',
          }
        },
        methods:{
          listPlaybackView(){
            let msg={
              roomId:this.roomId,
              status:1
            }
            listPlaybackView(msg).then(res=>{
              this.playList=res.data.items;
              console.log(res,888)
            })
          },
          pickPlay(row){
            console.log(row,77777777)
              this.visible=false;
              this.playRow=row;
              this.replayId=row.id;
          },
          savePlayback(){
            let msg={
              roomId:this.roomId,
              replayId:this.replayId,
              password:this.password,
              needPassword: this.needPassword,
              type:this.type,
              startTime: this.startTime,
              endTime: this.endTime
            }
            msg.replayId?(()=>{
              msg.needPassword==1?(()=>{
                msg.password?(()=>{
                  msg.type==1?(()=>{
                    msg.startTime&&msg.endTime?(()=>{
                      new Date(msg.startTime)<new Date(msg.endTime)?(()=>{
                        console.log(msg,1);
                        savePlayback(msg).then(res=>{
                          res.code?this.$message.error(res.msg):this.$message.success(res.msg)&&this.reload();
                        })
                      })():this.$message.error('结束时间不能早于开始时间')
                    })():this.$message.error('请选择开始结束时间')
                  })():(()=>{
                    console.log(msg,2)
                    savePlayback(msg).then(res=>{
                      res.code?this.$message.error(res.msg):this.$message.success(res.msg)&&this.reload();
                    })
                  })();
                })():this.$message.error('请输入密码')
              })():(()=>{
                msg.type==1?(()=>{
                  msg.startTime&&msg.endTime?(()=>{
                    new Date(msg.startTime)<new Date(msg.endTime)?(()=>{
                      savePlayback(msg).then(res=>{
                        res.code?this.$message.error(res.msg):this.$message.success(res.msg)&&this.reload();
                      })
                    })():this.$message.error('结束时间不能早于开始时间')
                  })():this.$message.error('请选择开始结束时间')
                })():(()=>{
                  console.log(msg,4)
                  savePlayback(msg).then(res=>{
                    res.code?this.$message.error(res.msg):this.$message.success(res.msg)&&this.reload();
                  })
                })();
              })();
            })():this.$message.error('请选择回放')
          },
          getPlayBack(){
            getPlayBack(this.roomId).then(v=>{
              console.log(v);
              v.code?this.$message.error(v.msg):(()=>{
                this.type=v.data.type;
                this.startTime=v.data.startTime;
                this.endTime=v.data.endTime;
                this.replayId=v.data.replayId;
                this.needPassword=v.data.needPassword||2;
                this.playRow.videoName=v.data.playVideoName;
                this.password=v.data.originalPassword;
              })();
            })
          }
        },
        created() {
          console.log(this.roomId,777);
          this.getPlayBack();

        }
    }
</script>

<style scoped>
  .h-span {
    display: inline-block;
    width: 120px;
    height: 30px;
  }
  .h-span:before{
    content: '*';
    color: red;
    padding: 5px;
  }
</style>
