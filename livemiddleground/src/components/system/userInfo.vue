<template>
  <div>
    <div v-if="$route.name=='userInfo'">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
          <el-button style="float: right;" type="primary" size="mini" @click="showDialog">编辑基本信息</el-button>
        </div>
        <div class="text item">
          <el-avatar style="margin-left:30px;" :size="150" :src="require('../../assets/headPhoto.jpg')"></el-avatar>
          <div style="margin-left:20px;display:inline-block;vertical-align:top;">
            <el-form :inline="true" label-width="140px">
              <el-form-item label="用户名称：">
                <div style="width:200px;">{{form.userName}}</div>
              </el-form-item>
              <el-form-item label="性别：">
                <div v-if="form.sex==1" style="width:200px;">男</div>
                <div v-if="form.sex==2" style="width:200px;">女</div>
              </el-form-item>
            </el-form>
            <el-form :inline="true" label-width="140px">
              <el-form-item label="角色组：">
                <div style="width:200px;">{{form.userGroupName}}</div>
              </el-form-item>
              <el-form-item label="所属单位：">
                <div style="width:200px;">{{form.departmentName}}</div>
              </el-form-item>
            </el-form>
            <el-form :inline="true" label-width="140px">
              <el-form-item label="手机号：">
                <div style="width:200px;">{{form.phone}}</div>
              </el-form-item>
              <el-form-item label="邮箱：">
                <div style="width:250px;">{{form.email}}</div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-card>
      <el-dialog title="编辑资料" :visible.sync="showEdit" destroy-on-close @close="closeDialog" width="700px" center>
        <el-form ref="form" label-width="100px" :model="formEdit" :rules="rules" :inline="true">
          <el-form-item label="用户名称：" prop="userName" required>
            <el-input v-model="formEdit.userName" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="所属单位：" required>
            <el-input disabled v-model="formEdit.departmentName" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="角色组：" prop="userGroupName" required>
            <el-input disabled v-model="formEdit.userGroupName" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex" required>
            <el-select v-model="formEdit.sex" style="width:150px;">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="手机号：" prop="phone" required>
            <el-input disabled v-model="formEdit.phone" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email" required>
            <el-input disabled v-model="formEdit.email" style="width:200px;" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isConfirm" type="primary" @click="edit">{{isConfirm?'编辑中...':'确 定'}}</el-button>
          <el-button @click="showEdit = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {getBasicInfo,editInfomation} from '../../http/request'
export default {
  name:'userInfo',
  inject:['reload'],
  data(){
    return{
      form:{
        id:'',
        userName:'',
        userGroupName:'',
        phone:'',
        email:'',
        sex:'',
        departmentName:''
      }, 
      showEdit:false,
      formEdit:{
        id:'',
        userName:'',
        userGroupName:'',
        sex:'',
        departmentName:'',
        phone:'',
        email:''
      },
      rules:{
        userName:[{required: true, message: '请输入用户名称', trigger: 'change'},{required: true, message: '请输入用户名称', trigger: 'blur'}],
        sex:[{required: true, message: '请选择性别', trigger: 'change'},{required: true, message: '请选择性别', trigger: 'blur'}],
      },
      isConfirm:false,
    }
  },
  methods: {
    showDialog(){
      this.showEdit = true;
      this.formEdit.id=this.form.id;
      this.formEdit.userName=this.form.userName;
      this.formEdit.userGroupName=this.form.userGroupName;
      this.formEdit.phone=this.form.phone;
      this.formEdit.email=this.form.email;
      this.formEdit.sex=this.form.sex;
      this.formEdit.departmentName=this.form.departmentName;
      this.formEdit.departmentId=this.form.departmentId;
    },
    closeDialog(){
      this.formEdit.id='';
      this.formEdit.userName='';
      this.formEdit.userGroupName='';
      this.formEdit.phone='';
      this.formEdit.email='';
      this.formEdit.sex='';
      this.formEdit.departmentName='';
      this.formEdit.departmentId='';
    },
    getInfo () {
      getBasicInfo().then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.form.id = res.data.id
          this.form.userName = res.data.userName
          this.form.userGroupName = res.data.userGroupName
          this.form.phone = res.data.phone
          this.form.email = res.data.email
          this.form.sex=res.data.sex;
          this.form.departmentName=res.data.departmentName?res.data.departmentName:'';
          this.form.departmentId=res.data.departmentId;
        }
      })
    },
    edit(){//创建型号
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isConfirm=true;
          editInfomation({"id":this.formEdit.id,"userName":this.formEdit.userName,"sex":this.formEdit.sex}).then(res=>{
            this.isConfirm = false;
            if(res.code){
              this.$message.error(res.msg);
            }else{
              this.$message.success(res.msg);
              this.showEdit = false;
              this.reload();
            }
          }).catch(err=>{
            this.isConfirm = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    },
  },
  created () {
    this.getInfo()
  }
}
</script>
<style scoped>

</style>
