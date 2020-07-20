<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">服务器管理</span>
      <el-button style="float:right;" type="primary" @click="showCreateServer=true;">新建</el-button>
    </div>
    <el-table ref="userRef" :data="serverTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @selection-change="handleSelectionChange" row-key="id">
      <el-table-column type="selection" width="50" :reserve-selection="true"></el-table-column>
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="name" label="服务器名称" align="center"></el-table-column>
      <el-table-column prop="address" label="服务器IP" align="center"></el-table-column>
      <el-table-column prop="positionCode" label="地址编码" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1" style="color:339900;">在线</span>
          <span v-if="scope.row.status==2" style="color:ff9900;">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editDialog(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="totalNum"></pagination>
    </div>
    <el-dialog :title="`${editId?'编辑':'创建'}服务器`" :visible.sync="showCreateServer" destroy-on-close @close="closeDialog" width="550px" center>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="服务器名称：" prop="serverName" required>
          <el-input v-model.trim="form.serverName" style="width:200px;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="服务器IP：" prop="serverIP" required>
          <el-input v-model="form.serverIP" style="width:200px;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="地址编码：" prop="positionCode" required>
          <el-input v-model="form.positionCode" style="width:200px;" maxlength="20"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isConfirm" type="primary" @click="createServer">{{isConfirm&&editId?'编辑中...':isConfirm&&!editId?'新建中...':'确 定'}}</el-button>
        <el-button @click="showCreateServer = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getServerList,addServer,editServer} from '../../http/request'
export default {
  name:'serverList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      serverTable:[],
      tableHeight:0,
      appIdList:[],
      showCreateServer:false,
      form:{
        serverName:'',
        serverIP:'',
        positionCode:''
      },
      rules:{
        serverName:[{required: true, message: '请输入服务器名称', trigger: 'change'},{required: true, message: '请输入服务器名称', trigger: 'blur'}],
        serverIP:[{required: true, message: '请输入服务器IP', trigger: 'change'},{required: true, message: '请输入服务器IP', trigger: 'blur'}],
        positionCode:[{required: true, message: '请输入地址编码', trigger: 'change'},{required: true, message: '请输入地址编码', trigger: 'blur'}]
      },
      isConfirm:false,
      editId:'',
      totalNum:0
    }
  },
  watch:{
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='serverList'){
        this.listData();
      }
    }
  },
  methods:{
    handleSelectionChange(val) {
      this.appIdList=val.map(v=>v.id)
    },
    closeDialog(){
      this.form.serverName='';
      this.form.serverIP = '';
      this.form.positionCode = '';
      this.editId='';
    },
    editDialog(row){
      this.showCreateServer=true;
      this.editId=row.id;
      this.form.serverName=row.name;
      this.form.serverIP=row.address;
      this.form.positionCode=row.positionCode;
    },
    createServer(){//创建型号
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.editId){
            this.$confirm('确认编辑吗？').then(()=>{
              this.isConfirm = true;
              editServer({
                'id':this.editId,
                'name':this.form.serverName,
                'address':this.form.serverIP,
                'positionCode':this.form.positionCode
              }).then(res=>{
                this.isConfirm = false;
                if(res.code){
                  this.$message.error(res.msg);
                }else{
                  this.$message.success(res.msg);
                  this.showCreateServer = false;
                  this.reload();
                }
              }).catch(err=>{
                this.isConfirm = false;
              })
            })
          }else{
            this.$confirm('确认新建吗？').then(()=>{
              this.isConfirm=true;
              addServer({
                'name':this.form.serverName,
                'address':this.form.serverIP,
                'positionCode':this.form.positionCode
              }).then(res=>{
                this.isConfirm = false;
                if(res.code){
                  this.$message.error(res.msg);
                }else{
                  this.$message.success(res.msg);
                  this.showCreateServer = false;
                  this.reload();
                }
              }).catch(err=>{
                this.isConfirm = false;
              })
            })
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    },
    listData(){
      getServerList(this.$route.query).then(res=>{
        this.serverTable=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
  },
  updated(){
    if(this.$route.name=='serverList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>