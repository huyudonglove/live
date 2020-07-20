<template>
  <div style="position:relative;background:#000;color:#fff;overflow:hidden;">
    <div v-if="isLive&&first !==1" style="min-width:1000px;min-height:1200px">
        <el-row >
          <el-col :span="20"><span style="font-size:28px;padding-right:30px;line-height:40px;display:inline-block">{{liveName?liveName:''}}</span><span style="font-size:20px;line-height:40px;display:inline-block">{{liveViceTopic?liveViceTopic:''}}</span></el-col>
          <el-col :span="4"><span style="float:right;padding-right:30px;line-height:40px;display:inline-block">在线人数：{{onlineViewing}}人</span></el-col>
      </el-row>
      <div>
        <el-row :gutter="22">
        <el-col :span="21">
          <videoPlayer class="vjs-custom-skin videoPlayer" :options="playerOptions" @loadeddata="onPlayerLoadeddata($event)"   @canplaythrough="onPlayerCanplaythrough($event)" @waiting="onPlayerWaiting($event)"
          ></videoPlayer>
          <div v-if="showLoading" class="el-loading-mask" style="background-color: rgba(0, 0, 0, 0.8);">
            <div class="el-loading-spinner"><i class="el-icon-loading"></i><p class="el-loading-text">拼命加载中</p>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="imgD">
            <pics :similarImages="similarImages" :streamId='this.$route.query.streamId||streamId'></pics>
          </div>
        </el-col>
        </el-row>
        <el-row >
          <el-col :span="20"><div> 简介:</div></el-col>
          <el-col :span="4">
            <select v-model="status"  style="width:80px;float:right;" @change="changeState(status)">
              <option  v-for="(item,index) in codeData" :key="index" :label="item.name" :value="item.name"></option>
            </select></el-col>
        </el-row>
        <el-input
        style="background:#000;color:#fff"
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="liveBrief"
        :disabled="true"
        resize="none"
        >
      </el-input>
      </div>
    </div>
    <div v-if="!isLive" style="width:100%;height:100%"><h3 style="color:#fff">{{title}}</h3></div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="30%"
      :show-close="false"
      v-if="first ==1"
      >
      <el-form ref="formSize" :model="formSize" label-width="100px" :rules="rules" onsubmit="return false;">
      <el-form-item label="请输入密码" prop="roomPwd">
        <el-input v-model="formSize.roomPwd" oninput="this.value=this.value.replace(/^\s*|\s*$/g,'')"></el-input>
      </el-form-item>
      <div style="width:80px;margin:0px auto">
      <el-button type="primary" @click.enter="submitForm('formSize')">确 定</el-button>
      </div>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
  import 'video.js/dist/video-js.css'
  import {videoPlayer} from 'vue-video-player'
  import md5 from 'js-md5';
  import 'videojs-flash'
  import {getVideoUrl,encodeList} from '../http/request'
  import pics from '../share/pics'
  import { eventBus } from '../main'
  export default {
    components: {
      videoPlayer,
      pics
    },
    inject:['replace','reload'],
    data() {
      return {
        liveName:'',
        liveViceTopic:'',
        showLoading:false  , //显示加载中
        mySetIntervalPower:null,
        liveBrief:'',
        status:'',
        rtmpUrl:'',
        onlineViewing:0,
        codeData:[],
        resolveCode:'',
        ipUrl:'',
        streamId:'',
        positionCode:'',
        first:1,
        title:'',
        isLive:false,
        dialogVisible:false,
        codePwd:'',
        idx:0,
        startTime:0,
        endTime:0,
        serverTime:0,
        dValue:0,
        token:this.$route.query.token,
        formSize:{
        roomPwd:'',
        allData:{}
      },
      rules: {
        roomPwd: [
          { required: true, message: '请输入房间密码', trigger: 'change' },
        ],
      },
        similarImages:[
          // {id:1,name:'1111xxxxx',url:'rtmp://58.200.131.2:1935/livetv/hunantv'},
          // {id:3,name:'3333xxxxx',url:'rtmp://202.69.69.180:443/webcast/bshdlive-pc'},
        ],
      }
    },
    computed:{
      playerOptions(){
        return {
          sources: [{
            type: "rtmp/mp4",
            // src: this.$route.query.rtmpUrl
            src:`${this.$route.query.rtmpUrl}?token=${this.$route.query.token}`
          }],
          techOrder: ['flash'],
          autoplay: true,
          fluid: true,
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true  //全屏按钮
          }
        }
      }
    },
    methods:{
      getPower(){
        getVideoUrl({"id":parseInt(this.$route.query.id)}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
              this.allData=res.data
              this.startTime=new Date(res.data.startTime).getTime()
              this.endTime=new Date(res.data.endTime).getTime()
              this.serverTime=new Date(res.data.now).getTime()
              // this.rtmpUrl = res.data.cameraList[0].deviceDto.address;
              this.positionCode= this.$route.query.positionCode||res.data.cameraList[0].deviceDto.positionCode
              this.replace('positionCode',this.positionCode);
              this.streamId=this.$route.query.streamId||res.data.cameraList[0].deviceDto.streamId
              this.replace('streamId',this.streamId);
              this.ipUrl=res.data.publicPrefix
              this.token=res.data.cameraList[0].deviceDto.token
              this.onlineViewing=res.data.onlineViewing||0
              this.codeData=this.$route.query.idx?res.data.cameraList[this.$route.query.idx].trancodeSettingDtoList:res.data.cameraList[0].trancodeSettingDtoList
              if(this.codeData.length){
                this.status=this.$route.query.status||this.codeData[this.codeData.length-1].name
                // console.log(this.status,'this.status')
              }
              this.liveBrief= res.data.liveBrief
              this.liveName=res.data.liveName
              this.liveViceTopic=res.data.liveViceTopic
              this.similarImages= res.data.cameraList
            if(res.data.isNeedPassword==0){
              this.dialogVisible=true
            }else if(res.data.isNeedPassword==1){
              this.first=2
              this.dialogVisible=false
            }else{
              this.dialogVisible=false
            }
            this.codePwd=res.data.password
          }
        })
      },
      onPlayerLoadeddata(player){
        const _this = this;
        player.on('loadedmetadata',function(){
          console.log('loadedmetadata',)
          //加载到元数据后开始播放视频
          // this.width=640;
          // this.height=360;
          // _this.showLoading = false;
        })

      },
      //canplaythrough表示可以流畅播放了
      onPlayerCanplaythrough(player) {
        // console.log(111,22,'33')
        console.log('onPlayerCanplaythrough')
        // this.showLoading = false;
      },
      onPlayerWaiting(player) {
      // this.showLoading = true;
      console.log('player Waiting!')
    },



    changeState(state){
      this.resolveCode=this.codeData.filter(v=>v.name==state)[0].resolveCode
      let name=this.codeData.filter(v=>v.name==state)[0].name
      this.replace('status',name);
      this.rtmpUrl=`${this.ipUrl}/${this.positionCode}${this.resolveCode}/${this.streamId}`
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
    },
    getTimeM(){
      let now =now||new Date().getTime()
      if(now !==this.serverTime ){
       this.dValue=Math.abs(now-this.serverTime)
       now=this.serverTime>now?now+this.dValue:now-this.dValue
       if(this.endTime > now){
          this.serverTime=this.serverTime+1000
          now=now+1000
       }else if(this.endTime <= now&&this.$route.query.liveState =='1'){
        clearInterval(this.mySetIntervalPower);
        this.replace('liveState',3);
       }
      }else{
       if(this.endTime > now){
           this.serverTime=this.serverTime+1000
           now=now+1000
       }else if(this.endTime >= now&&this.$route.query.liveState =='1'){
        clearInterval(this.mySetIntervalPower);
        this.replace('liveState',3);
        this.rtmpUrl=''
       }
      }
    }
    },
    watch:{
      rtmpUrl(){
        this.replace('rtmpUrl',this.rtmpUrl);
      },
      token(){
        this.replace('token',this.token);
      },
      $route(){//判断路由query变化执行请求
      if(this.$route.name=='aliplayer'){
      if(this.$route.query.state==1&&this.$route.query.liveState==1){
        // this.rtmpUrl=this.$route.query.rtmpUrl
        this.playerOptions.sources[0].src=`${this.$route.query.rtmpUrl}?token=${this.$route.query.token}`
        this.first=parseInt(this.$route.query.first)
        this.isLive=true;
        this.formSize.roomPwd=''
        if(this.first==1){
          this.getPower()
        }else{
        getVideoUrl({"id":parseInt(this.$route.query.id)}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
              this.allData=res.data
              this.startTime=new Date(res.data.startTime).getTime()
              this.endTime=new Date(res.data.endTime).getTime()
              this.serverTime=new Date(res.data.now).getTime()
          }
        })
        }
        }else if(this.$route.query.state==1&&this.$route.query.liveState==0){
          this.isLive=false
          this.title='未开播'
          this.first=2
        }else if(this.$route.query.state==1&&this.$route.query.liveState==3){
          this.isLive=false
          this.title='您观看的直播已结束'
          this.first=2
        }else if(this.$route.query.state==1&&this.$route.query.liveState==2){
          this.isLive=false
          this.title='轮播中'
          this.first=2
        }
        else if(this.$route.query.state==1&&this.$route.query.liveState==-1){
          this.isLive=false
          this.title='未添加机位'
          this.first=2
        }else if(this.$route.query.state==2){
          this.isLive=false
          this.title='直播间已被下架'
          this.first=2
        }
          // this.playerOptions
        }
    },
    first(){
      this.replace('first',this.first);
    }
    },
    created(){
      if(this.$route.query.state==1&&this.$route.query.liveState==1){
      this.rtmpUrl=this.$route.query.rtmpUrl
      this.playerOptions.sources[0].src=`${this.$route.query.rtmpUrl}?token=${this.$route.query.token}`
      this.first=parseInt(this.$route.query.first)
      this.isLive=true;
      this.getPower()
      this.mySetIntervalPower = setInterval(this.getTimeM,1000);
      // this.getCode()
      }else if(this.$route.query.state==1&&this.$route.query.liveState==0){
        this.isLive=false
        this.title='未开播'
      }else if(this.$route.query.state==1&&this.$route.query.liveState==3){
        this.isLive=false
        this.title='您观看的直播已结束'
      }else if(this.$route.query.state==1&&this.$route.query.liveState==2){
        this.isLive=false
        this.title='轮播中'
      }
      else if(this.$route.query.state==1&&this.$route.query.liveState==-1){
        this.isLive=false
        this.title='未添加机位'
      }else if(this.$route.query.state==2){
        this.isLive=false
        this.title='直播间已被下架'
      }

    },
    mounted(){

      eventBus.$on('pic', (message,index) => {
      this.rtmpUrl=message.deviceDto.address
      this.streamId=message.deviceDto.streamId
      this.positionCode=message.deviceDto.positionCode
      this.token=message.deviceDto.token
      let idex=this.allData.cameraList.map(v=>v.id).indexOf(message.id)
      idex?this.replace('idx',idex):this.replace('idx',0);
      this.replace('positionCode',this.positionCode);
      this.replace('streamId',this.streamId);
      this.codeData=this.$route.query.idx?this.allData.cameraList[this.$route.query.idx].trancodeSettingDtoList:this.allData.cameraList[0].trancodeSettingDtoList
      if(this.codeData.length){
        this.status=this.codeData[this.codeData.length-1].name||this.$route.query.status
        // console.log(this.status,'this.status')
      }
      this.replace('status',this.codeData[this.codeData.length-1].name);
      // console.log(this.status,'this.codeData[this.codeData.length-1].name')
    })
    },
    destroyed(){
      clearInterval(this.mySetIntervalPower);
    },
  }
</script>

<style scoped>
  .video-js .vjs-icon-placeholder {
    /* width: 100%;
    height: 80%; */
    display: block;
  }
  .imgD{
    height: 630px;
    overflow: hidden;
  }
  .imgD div{
  }
</style>
