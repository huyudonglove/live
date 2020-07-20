<template>
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" style="width: 50%">
        <el-form-item label="直播间名称" prop="liveName">
          <el-input v-model.trim="ruleForm.liveName"></el-input>
        </el-form-item>
        <el-form-item label="直播间副标题" prop="liveViceTopic">
          <el-input v-model="ruleForm.liveViceTopic"></el-input>
        </el-form-item>
        <el-form-item label="直播类型" prop="liveClassify">
          <el-select v-model="ruleForm.liveClassify" placeholder="请选择">
            <el-option label="全部" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直播间封面图" prop="liveCover">
          <el-upload
            class="avatar-uploader"
            action='/api/file/upload'
            :show-file-list="false"
            :headers="headers"
            :data="data"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div  class="el-upload__tip">建议采用jpg或png格式图片，宽：小于1920px，高：500px-900px, 小于1M</div>
        </el-form-item>
        <el-form-item label="直播间简介" prop="liveBrief">
          <el-input type="textarea" v-model="ruleForm.liveBrief" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="直播间状态" prop="isOnShelf">
          <el-select v-model="ruleForm.isOnShelf" placeholder="请选择">
            <el-option label="上架" :value="1"></el-option>
            <el-option label="下架" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addLiveBase('ruleForm')" :disabled="addLive">{{this.id?'保存':'创建'}}</el-button>
          <el-button  @click="$router.go(-1)" v-if="!this.id">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import {addLiveBase,getBaseDetail,updateLiveBase} from "../../http/request";
  import { Base64 } from 'js-base64';
  export default {
        name: "baseType",
        data(){
          return{
            ruleForm: {
              liveName: '',
              liveViceTopic:'',
              liveClassify:0,
              liveCover:'',
              liveBrief:'',
              isOnShelf:1,
              id:''
            },
            rules: {
              liveName: [
                { required: true, message: '请输入直播间名称', trigger: 'blur' },
                { min: 1, max: 28, message: '长度在28个字符以内', trigger: 'blur' }
              ],
              liveViceTopic: [
                { required: true, message: '请输入直播间副标题', trigger: 'blur' },
                { min: 1, max: 28, message: '长度在28个字符以内', trigger: 'blur' }
              ],
              liveClassify: [
                { required: true, message: '请选择直播类型', trigger: 'change' },
              ],
              liveCover: [
                { required: true, message: '请上传直播间封面图', trigger: 'change' }
              ],
              liveBrief: [
                { required: true, message: '请输入内容', trigger: 'blur' }
              ],
              isOnShelf: [
                { required: true, message: '请选择活动资源', trigger: 'blur' }
              ]
            },
            imageUrl:'',
            headers:{
              Authorization:this.$cookies.get('liveMIddlegroundToken')
            },
            data:{
              type:'image',
              moduleCode:'live'
            },
            channelId:'',
            addLive:false
          };
        },
        methods:{
          addLiveBase(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                this.addLive=true;
                console.log(valid,7777);
                this.channelId&&(()=>{
                  this.ruleForm.channelId=this.channelId;
                })();
                !this.id&&addLiveBase(this.ruleForm).then(res=>{
                  this.addLive=false;
                  res.code?this.$message.error(res.msg):this.$message.success(res.msg)&&this.$router.go(-1);
                })
                this.id&&updateLiveBase(this.ruleForm).then(res=>{
                  this.addLive=false;
                  res.code?this.$message.error(res.msg):this.$message.success(res.msg);
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          beforeAvatarUpload(file){
            console.log(file,777777)
            const isJPG = file.type === 'image/jpeg'||file.type === "image/png";
            const isLt2M = file.size / 1024 / 1024 < 1;

            if (!isJPG) {
              this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传图片大小不能超过 1MB!');
            }
            const isSize = new Promise(function(resolve, reject) {
              let width = 1920;
              let minHeight = 500;
              let maxHeight = 900
              let _URL = window.URL || window.webkitURL;
              let img = new Image();
              img.onload = function() {
                let valid = img.width <= 1920 && img.height <= maxHeight&& img.height >= minHeight;
                valid ? resolve() : reject();
              }
              img.src = _URL.createObjectURL(file);
            }).then(() => {
              return file;
            }, () => {
              this.$message.error('上传的图片宽:不能大于1920px，高：500px-900px,');
              return Promise.reject();
            });
            return  isSize;
          },
          handleAvatarSuccess(res,file){
            console.log(file,111)
            this.imageUrl = URL.createObjectURL(file.raw);
            this.ruleForm.liveCover=res.data.fileId;
          },
          getBaseDetail(){
            getBaseDetail(this.id).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                console.log(res);
                this.ruleForm.liveName=res.data.liveName;
                this.ruleForm.liveBrief=res.data.liveBrief;
                this.ruleForm.liveViceTopic=res.data.liveViceTopic;
                this.ruleForm.liveClassify=res.data.liveClassify;
                this.ruleForm.liveCover=res.data.liveCover;
                this.ruleForm.isOnShelf=res.data.isOnShelf;
                this.imageUrl = `/static/${Base64.decode(res.data.liveCover)}`;
              })();
            })
          }
        },
        mounted(){
          console.log(778)
        },
        created(){
          console.log(this.$route);
          this.$route.query.id&&(()=>{
            this.id=this.$route.query.id;
            this.ruleForm.id=this.id;
            this.getBaseDetail();
          })();
          !this.$route.query.id&&(()=>{
            this.id='';
            this.$route.query.roomId?(()=>{
              this.channelId=this.$route.query.roomId;
            })():(()=>{
              this.channelId='';
            })();
          })();
        },
        watch:{
        }
    }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
