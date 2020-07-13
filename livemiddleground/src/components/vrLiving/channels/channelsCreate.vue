<template>
  <div>
    <div v-if="$route.name=='channelsCreate'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="$router.go(-1)" content="新增频道" style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="isCreate">
        </el-page-header >
        <el-page-header @back="$router.go(-1)" content="编辑频道" style="font-size:24px;font-weight:bold;color:#614a4d;" v-else>
        </el-page-header >
      </div>
       <div  style="margin-top:20px;width:50%">
        <el-form ref="formSize" :model="formSize" label-width="160px" :rules="rules">
          <el-form-item label="频道名称：" prop="channelName">
            <el-input v-model="formSize.channelName"  maxlength="28" show-word-limit oninput="this.value=this.value.replace(/^\s*|\s*$/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="副标题：" prop="channelViceTopic">
            <el-input v-model="formSize.channelViceTopic" maxlength="28" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="频道分类：" prop="channelClassify">
            <el-select v-model="formSize.channelClassify" placeholder="请选择" style="width:100%">
              <el-option label="全部" value='1'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="频道封面图：" prop="channelCover" ref="uploadImage">
            <uploadImage :size="1" type="image" @getImg="getImg" :id="imgId" :limit="1" moduleCode="vr" ></uploadImage>
            <span style="font-size:12px;color:#909399">建议采用jpg或png格式图片，宽：不能大于1920px，高：500px-900px, 大小小于1M</span>
          </el-form-item>
          <el-form-item label="频道简介：" prop="channelBrief">
            <el-input type="textarea" v-model="formSize.channelBrief" rows="2" maxlength="100" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="频道上架状态：" prop="state">
            <el-select v-model="formSize.state" placeholder="请选择" style="width:100%">
              <el-option label="上架" value='1'></el-option>
              <el-option label="下架" value='2'></el-option>
            </el-select>
          </el-form-item>
          </el-form>
          <div style="width:170px;margin:0px auto">
          <el-button type="primary" @click="submitForm('formSize')">确 定</el-button>
          <el-button @click="$router.go(-1)">取 消</el-button>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64'
import uploadImage from '../../../share/uploadImage'
import {channelsAdd,channelsInfo,channelsEdit} from '../../../http/request'
export default {
  name: 'channelsCreate',
  inject: ['replace', 'reload'],
  components: {
    uploadImage
  },
  data () {
    return {
      imgId: '',
      isCreate:true,
      formSize: {
       channelName: '',
       channelClassify: '',
       channelBrief: '',
       channelCover: '',
       channelImg:'',
       channelViceTopic: '',
       state:'1'
      },
      rules: {
       channelName: [
          { required: true, message: '请输入频道名称', trigger: 'change' },
          { min: 1, max: 28, message: '长度在 1 到 28 个字符', trigger: 'change' }
        ],
       channelViceTopic: [
          { required: true, message: '请输入频道副标题', trigger: 'change' },
          { min: 1, max: 28, message: '长度在 1 到 28 个字符', trigger: 'change' }
        ],
       channelClassify: [
          { required: true, message: '请选择频道分类', trigger: ['change'] }
        ],
       channelBrief: [
          { required: true, message: '请输入频道简介', trigger: 'change' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'change' }
        ],
       channelCover: [
          { required: true, message: '请上传频道封面', trigger: 'change' }
        ],
        state: [
          { required: true, message: '频道上架状态', trigger: 'change' }
        ],
      },
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
   getImg (fileId, originFileName, size, type) {
      this.formSize.channelCover = fileId
      this.$nextTick(() => {
        this.$refs.uploadImage.clearValidate()
      })
    },
    infoData () {
      channelsInfo({id: JSON.parse(this.$route.query.msg).id}).then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.loading.close();
          this.formSize = res.data
          this.formSize.state=JSON.stringify(res.data.state)
          this.formSize.channelClassify=JSON.stringify(res.data.channelClassify)
          this.formSize.channelImg = `/static/${Base64.decode(this.formSize.channelCover)}`
          this.imgId = `/static/${Base64.decode(this.formSize.channelCover)}`
        }
      }).catch(err=>{
        this.loading.close();
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isCreate){
            channelsAdd({...this.formSize}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.$router.go(-1)
            }
          })
          }else{
            channelsEdit({...this.formSize,updateTime:null}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.$router.go(-1)
            }
          })
          }
          
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  created () {
    let id=JSON.parse(this.$route.query.msg).id
    if(id){
    this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
     this.isCreate=false
     this.infoData()
    }
   
  }
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
