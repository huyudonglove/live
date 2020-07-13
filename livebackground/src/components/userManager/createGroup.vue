<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加用户组</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑用户组</span>
    </div>
    <div>
      <el-form ref="form" label-width="150px" :model="form" :rules="rules">
        <el-form-item label="用户组名称：" prop="name" required>
          <el-input type="text" v-model="form.name" style="width:200px;" oninput="this.value=this.value.replace(/^\s*|\s*$/g,'')" maxlength="50"></el-input>
        </el-form-item>
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>用户权限</span>
          </div>
          <el-form-item label="直播间总机位数：" prop="maxCapacity" required>
            <el-input v-model="form.maxCapacity" style="width:200px;" maxlength="10" oninput="this.value=this.value.replace(/\D/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="直播转码权限：" prop="liveConvertId" required>
            <el-select v-model="form.liveConvertId" placeholder="请选择">
              <el-option
                v-for="item in powerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="最大同时观看人数：" prop="maxViewer" required>
            <el-input type="text" v-model="form.maxViewer" style="width:200px;" maxlength="10" oninput="this.value=this.value.replace(/\D/g,'')"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="回放权限：" prop="replayPermission" required>
            <el-checkbox v-model="form.replayPermission" :true-label="1" :false-label="2">开启</el-checkbox>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="addOrEdit">确定</el-button>
            <el-button @click="$router.go(-1);">取消</el-button>
          </el-form-item>
        </el-card>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addGroup,editGroup,getGroupInfo,powerDropDown} from '../../http/request'
export default {
  name:'createGroup',
  data(){
    return{
      isCreate:false,
      isEdit:false,
      powerList:[
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '双皮奶1'
        }, {
          value: '选项5',
          label: '蚵仔煎2'
        }
      ],
      form:{
        name:'',
        maxCapacity:'',
        liveConvertId:'',
        // maxViewer:'',//最多观看人数
        // replayPermission:2,//回放权限
      },
      rules:{
        name:[{required: true, message: '请输入用户组名称', trigger: 'change'},{required: true, message: '请输入用户组名称', trigger: 'blur'}],
        maxCapacity:[{required: true, message: '请输入直播间总机位数', trigger: 'change'},{required: true, message: '请输入直播间总机位数', trigger: 'blur'}],
        liveConvertId:[{required: true, message: '请选择直播转码权限', trigger: 'change'},{required: true, message: '请选择直播转码权限', trigger: 'blur'}],
        // maxViewer:[
        //   {required: true, message: '请输入最大观看人数', trigger: 'change'},
        //   {required: true, message: '请输入最大观看人数', trigger: 'blur'},
        // ],
      },
    }
  },
  watch:{
    
  },
  methods:{
    dropDown(){//下拉框
      powerDropDown({"status":1}).then(res=>{
        this.powerList = res.data.items;   
      })
    },
    groupInfo(){
      getGroupInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        this.form.name = res.data.name;
        this.form.maxCapacity = res.data.maxCapacity;
        this.form.liveConvertId = res.data.liveConvertId?res.data.liveConvertId:'';
        // this.form.maxViewer = res.data.maxViewer;
        // this.form.replayPermission = res.data.replayPermission;
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addGroup({
              "name":this.form.name,
              "maxCapacity":this.form.maxCapacity,
              "liveConvertId":this.form.liveConvertId,
              // "maxViewer":this.form.maxViewer,
              // "replayPermission":this.form.replayPermission,
            }).then(res=>{
              this.$router.go(-1);
            })
          }else if(this.isEdit){
            editGroup({
              "id":parseInt(this.$route.query.id),
              "name":this.form.name,
              "maxCapacity":this.form.maxCapacity,
              "liveConvertId":this.form.liveConvertId,
              // "maxViewer":this.form.maxViewer,
              // "replayPermission":this.form.replayPermission,
            }).then(res=>{
              this.$router.go(-1);
            })
          } 
        } else {
          console.log('error submit!!');
          return false;
        }
      });   
    },
  },
  created(){
    this.dropDown();
    if(this.$route.query.id){
      this.isEdit=true;
      this.groupInfo();
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>

</style>