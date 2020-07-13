<template>
  <div style="position:relative;background:#000;color:#fff;overflow:hidden">
    <div v-show="first !==1" style="min-width:1000px;height:770px">
        <el-row >
          <el-col :span="20"><span style="font-size:28px;padding-right:30px;line-height:40px;display:inline-block">{{liveName?liveName:''}}</span><span style="font-size:20px;line-height:40px;display:inline-block">{{liveViceTopic?liveViceTopic:''}}</span></el-col>
          <el-col :span="4"><span style="float:right;padding-right:30px;line-height:40px;display:inline-block">在线人数：{{onlineViewing}}人</span></el-col>
      </el-row>
      <div>
        <el-row :gutter="22">
        <el-col :span="21">
           <div v-if="showLoading" style="color:#fff;font-size:24px;position:absolute;z-index:999;text-align:center;width:85%;top:150px;">
            无记录回放
          </div>
          <!-- <video controls  style="width:100%;height:90%" :src="videoUrl" autoplay ref="player" muted >
          </video> -->
          <video class="demo-video" ref="player" muted controls  style="width:100%;height:90%" crossOrigin = "Anonymous">
          </video>    
        </el-col>
        <el-col :span="3">
          <div class="imgD">
            <pics :similarImages="similarImages"></pics>
            <!-- <div>图片1</div><div>图片1</div><div>图片1</div><div>图片1</div><div>图片1</div><div>图片1</div> -->
          </div>
        </el-col>
        </el-row>
        <el-row >
          <el-col :span="20"><div> 简介:</div></el-col>
          <el-col :span="4">
            <select v-model="status"  style="width:80px;float:right;" @change="changeState(status)" v-if="status">
              <option  v-for="(item,index) in codeData" :key="index" :label="item.resolvingName" :value="item.resolvingName"></option>
            </select></el-col>
        </el-row>
        <el-input
        style="background:#000;color:#fff"
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="liveBrief"
        :disabled="true"
        >
      </el-input>
      </div>
    </div>
  <el-dialog
  :visible.sync="dialogVisible" width="30%" :show-close="false" v-if="first ==1">
    <el-form ref="formSize" :model="formSize" label-width="100px" :rules="rules" onsubmit="return false;">
    <el-form-item label="请输入密码" prop="roomPwd">
    <el-input v-model="formSize.roomPwd"></el-input>
    </el-form-item>
    <div style="width:80px;margin:0px auto">
    <el-button type="primary" @click.enter="submitForm('formSize')">确 定</el-button>
    </div>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
  import flvjs from "flv.js";
  import {roomInfo,videoQueryPlaybackSettingDetail,queryReplayList,queryReplayListByRoomId} from '../http/request'
  import pics from '../share/pics'
  import { eventBus } from '../main'
  import md5 from 'js-md5';
  export default {
    components: {
      pics
    },
    inject:['replace','reload'],
      /**
     * @returns {{player: flvjs.Player}}
     */
    data() {
      return {
        liveName:'',
        liveViceTopic:'',
        showLoading:false  , 
        mySetIntervalPower:null,
        liveBrief:'',
        first:1,
        status:'',
        videoUrl:'',
        onlineViewing:0,
        codeData:[],
        resolveCode:'',
        positionCode:'',
        title:'',
        index:0,
        codePwd:'',
        idx:0,
        dialogVisible:false,
        similarImages:[
        ],
       formSize:{
        roomPwd:''
      },
       rules: {
        roomPwd: [
          { required: true, message: '请输入房间密码', trigger: 'change' },
        ],
      },
       player: null
      }
      },
    computed:{
    },
    methods:{
      close(){

      },
      getPower(){
        roomInfo({"id":parseInt(this.$route.query.roomId)}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{

              this.liveBrief= res.data.liveBrief
              this.liveName=res.data.liveName
              this.liveViceTopic=res.data.liveViceTopic
          }
        })
      },
      getRoomPwd(){
        videoQueryPlaybackSettingDetail({roomId:this.$route.query.roomId}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            if(res.data.needPassword==1){
              this.dialogVisible=true
            }else if(res.data.needPassword==2||res.data.needPassword==null){
              this.first=2
              this.dialogVisible=false
            }else{
              this.dialogVisible=false
            }
            this.codePwd=res.data.password
          }
        })
      },
    getRoomInfo(){
      if(this.$route.query.playbackId){
        queryReplayList({replayId:this.$route.query.playbackId}).then(res=>{
         if(res.data.cameras){
          this.similarImages= res.data.cameras
          this.index=this.similarImages.map(v=>v.camareId).indexOf(parseInt(this.$route.query.camareId)) !==-1?this.similarImages.map(v=>v.camareId).indexOf(parseInt(this.$route.query.camareId)):0
          if(res.data.cameras[this.index].files.length){
            this.videoUrl =this.$route.query.idx?`${this.similarImages[this.index].files[this.$route.query.idx].fileId}`:`${this.similarImages[this.index].files[0].fileId}`
          }else{
            this.videoUrl =''
            this.showLoading=true
          }
          
          this.codeData=this.similarImages[this.index].files
         }

       })
      }else{
        queryReplayListByRoomId({roomId:this.$route.query.roomId}).then(res=>{
          this.similarImages= res.data.cameras
          this.similarImages= res.data.cameras
          this.index=this.similarImages.map(v=>v.camareId).indexOf(parseInt(this.$route.query.camareId)) !==-1?this.similarImages.map(v=>v.camareId).indexOf(parseInt(this.$route.query.camareId)):0
           if(res.data.cameras[this.index].files.length){
            this.videoUrl =this.$route.query.idx?`${this.similarImages[this.index].files[this.$route.query.idx].fileId}`:`${this.similarImages[this.index].files[0].fileId}`
          }else{
            this.videoUrl =''
            this.showLoading=true
          }
         
          this.codeData=this.similarImages[this.index].files

       })

      }
       
    },
    changeState(state){
      this.idx=this.codeData.map(v=>v.resolvingName).indexOf(state)
       if(this.similarImages[this.index].files.length){
          this.videoUrl=this.similarImages[this.index].files[this.idx].fileId
       }else{
         this.videoUrl=''
         this.showLoading=true
       }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(md5(this.formSize.roomPwd)===this.codePwd){
             this.dialogVisible=false
             this.first=2;
          }else{
             this.dialogVisible=true
             this.$message.error('密码错误');
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
    },
    watch:{
      first(){
      this.replace('first',this.first);
    },
      videoUrl(){
        this.replace('videoUrl',this.videoUrl);
      },
      idx(){
        this.replace('idx',this.idx);
      },
      status(){
        this.replace('status',this.status);
      },
      $route(){//判断路由query变化执行请求
      if(this.$route.name=='playAliplayer2'){
        // this.reload()
        this.$nextTick(() => {
         if (flvjs.isSupported()) {
            let video = this.$refs.player;
            if (video&&this.videoUrl) {
                this.player = flvjs.createPlayer({
                    type: "flv",
                    isLive: true,
                    url: this.videoUrl
                });
                this.player.attachMediaElement(video);
                // try {
                //     this.player.load();
                //     this.player.play();
                // } catch (error) {
                //     console.log(error);
                // };
                this.player.load()
                let playPromise = this.player.play()
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                       this. player.play()
                    }).catch((error)=> {
                        console.log(error);
                    })
                }
            }
        }
       })
      }
    },
    },
   async created(){
      this.first=parseInt(this.$route.query.first)
      this.videoUrl=this.$route.query.videoUrl
      this.status= this.$route.query.status
     if(!this.$route.query.playbackId){
       await this.getRoomPwd()
     }
      this.getRoomInfo()
      this.getPower()
    },
    mounted(){
       this.$nextTick(() => {
         if (flvjs.isSupported()) {
            let video = this.$refs.player;
            if (video&&this.videoUrl) {
                this.showLoading=false
                this.player = flvjs.createPlayer({
                    type: "flv",
                    isLive: true,
                    url: this.videoUrl
                });
                this.player.attachMediaElement(video);
                // try {
                //     this.player.load();
                //     this.player.play();
                // } catch (error) {
                //     console.log(error);
                // };
                this.player.load()
                let playPromise = this.player.play()
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                       this. player.play()
                    }).catch((error)=> {
                        console.log(error);
                    })
                }
            }else{
              this.showLoading=true
            }
        }
       })

      eventBus.$on('pic', (message,index) => {
      this.videoUrl=message.files[0].fileId
      this.replace('status',this.codeData[0].resolvingName);
    })

    },
    destroyed(){
      clearInterval(this.mySetIntervalPower);
    },
    // beforeDestroy () {
    //     this.player.destory();
    // }
  }
</script>

<style scoped>
  .video-js .vjs-icon-placeholder {
    width: 99%;
    height: 80%;
    display: block;
  }
  .imgD{
    height: 630px;
    overflow: hidden;
  }
  .imgD div{
  }
</style>
