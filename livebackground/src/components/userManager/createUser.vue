<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">添加用户</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑用户</span>
    </div>
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="用户名称：" prop="userName" required>
          <el-input type="text" v-model.trim="form.userName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="用户组：" prop="userGroupId" required>
          <el-select v-model="form.userGroupId" style="width:200px;">
            <el-option v-for="(item,i) in userGroupList" :key=i :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属单位：" prop="departmentName" required>
          <el-input v-model="form.departmentName" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex" required>
          <span class="myWords">
            <el-select v-model="form.sex" style="width:150px;">
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </span>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone" required>
          <el-input type="text" :disabled="isEdit" v-model="form.phone" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <el-input type="text" :disabled="isEdit" v-model="form.email" style="width:200px;" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="">
          <span style="color:red">注：用户可使用邮箱作为登录帐号，默认密码为：邮箱+123</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addOrEdit">确定</el-button>
          <el-button @click="$router.go(-1);">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addUser,editUser,getUserInfo,userDropDown} from '../../http/request'
export default {
  name:'createUser',
  data(){
    return{
      isCreate:false,
      isEdit:false,
      userGroupList:[],
      form:{
        userName:'',
        departmentName:'',
        userGroupId:'',
        sex:1,
        phone:'',
        email:'',
      },
      rules:{
        userName:[{required: true, message: '请输入用户名称', trigger: 'change'},{required: true, message: '请输入用户名称', trigger: 'blur'}],
        departmentName:[{required: true, message: '请输入所属单位', trigger: 'change'},{required: true, message: '请输入所属单位', trigger: 'blur'}],
        userGroupId:[{required: true, message: '请选择用户组', trigger: 'change'},{required: true, message: '请选择用户组', trigger: 'blur'}],
        phone:[
          {required: true, message: '请输入手机号', trigger: 'change'},
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        email:[
          {required: true, message: '请输入邮箱', trigger: 'change'},
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '邮箱格式不正确', trigger: 'blur'}
        ],
      },
      departmentId:'',
    }
  },
  watch:{
    
  },
  methods:{
    dropDown(){//角色下拉框
      userDropDown().then(res=>{
        this.userGroupList = res.data; 
      })
    },
    userInfo(){
      getUserInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        this.form.userName = res.data.userName;
        this.form.departmentName = res.data.departmentName;
        this.form.userGroupId = res.data.userGroupId;
        this.form.sex = res.data.sex;
        this.form.phone = res.data.phone;
        this.form.email = res.data.email;
        this.departmentId = res.data.departmentId;      
      })
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addUser({...this.form}).then(res=>{
              this.$router.go(-1);
            })
          }else if(this.isEdit){
            editUser({
              "id":parseInt(this.$route.query.id),
              "userName":this.form.userName,
              "departmentId":this.departmentId,
              "departmentName":this.form.departmentName,
              "userGroupId":this.form.userGroupId,
              "sex":this.form.sex,
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
      this.userInfo();
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style scoped>

</style>