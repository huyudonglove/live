<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span v-if="isCreate" style="font-size:24px;font-weight:bold;color:#614a4d;">新建级联</span>
      <span v-if="isEdit" style="font-size:24px;font-weight:bold;color:#614a4d;">编辑级联</span>
    </div>
    <div class="myCascade">
      <el-form ref="form" label-width="150px" :model="form" :rules="rules">
        <el-form-item label="级联名称：" prop="name" required>
          <el-input type="text" v-model.trim="form.name" style="width:200px;" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="级联链路" prop="treeData" required>
          <el-tree
            :data="form.treeData"
            node-key="id"
            default-expand-all
            :props="defaultProps"
            :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <el-select v-model="data.serverId" placeholder="请选择" @change="changeSelect(data)">
                <el-option
                  v-for="item in dropList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
              <span>
                <el-button
                  v-if="data.serverId"
                  type="text"
                  size="mini"
                  style="color:#339900;font-size:20px;"
                  class="el-icon-circle-plus-outline"
                  @click="() => append(data)">
                </el-button>
                <el-button
                  v-if="data.deep!==0"
                  type="text"
                  size="mini"
                  style="color:red;font-size:20px;"
                  class="el-icon-circle-close"
                  @click="() => remove(node, data)">
                </el-button>
              </span>
            </span>
          </el-tree>
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
import {addCascade,editCascade,getCascadeInfo,getServerDropdown} from '../../http/request'
export default {
  name:'createCascade',
  inject:['reload'],
  data(){
    return{
      isCreate:false,
      isEdit:false,
      form:{
        name:'', 
        treeData:[{deep:0}]
      },
      rules:{
        name:[{required: true, message: '请输入级联名称', trigger: 'change'},{required: true, message: '请输入级联名称', trigger: 'blur'}],
        treeData: [{ validator: this.checkTreeData, trigger: 'change' },{ validator: this.checkTreeData, trigger: 'blur' }]
      },
      defaultProps:{
        label:'name'
      },
      dropList:[],
      treeId:1000,
      appendArr:[]
    }
  },
  watch:{
    
  },
  methods:{
    dropdown(){
      getServerDropdown().then(res=>{
        this.dropList = res.data.items;
      })
    },
    cascadeInfo(){
      getCascadeInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        this.form.name = res.data.routeDto.routeName;
        this.form.treeData = [res.data.treeDto];
      })
    },
    traverse(arr,newArr){
      for(let i=0;i<arr.length;i++){
        newArr.push(arr[i].serverId);
        if(arr[i].children.length){
          this.traverse(arr[i].children,newArr);
        }
      }
    },
    checkTreeData(rule, value, callback){
      let newArr=[];
      if(this.isEdit){ 
        this.traverse(this.form.treeData,newArr);
      }else{
        newArr = JSON.parse(JSON.stringify(this.appendArr)).map(server=>server.serverId);
        newArr.push(this.form.treeData[0].serverId)
      }
      console.log(newArr,1212)
      if (this.appendArr.some(v=>!v.serverId)||!this.form.treeData[0].serverId) {
        callback(new Error('请选择节点'));
      } else if(Array.from(new Set(newArr)).length<newArr.length){
        callback(new Error('节点不能重复'));
      } else {
        callback();
      } 
    },
    changeSelect(data){
      data.name = this.dropList.find(v=>v.id===data.serverId).name;
    },
    append(data) {
      const newChild = { id:this.treeId++,serverId: '', name: '', children: [] };
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
      this.appendArr.push(newChild);
    },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      const appendIndex = this.appendArr.findIndex(d => d.id === data.id);
      this.appendArr.splice(appendIndex, 1);
      this.checkNow();
    },
    checkNow(){//查询当前repeat
      let newArr=[];
      this.traverse(this.form.treeData,newArr);
      if(Array.from(new Set(newArr)).length==newArr.length){
        this.$refs.form.clearValidate();
      }
    },
    addOrEdit(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.isCreate){
            addCascade({
              "routeName":this.form.name,
              "treeDto":this.form.treeData[0]
            }).then(res=>{
              this.$router.go(-1);
            })
          }else if(this.isEdit){
            editCascade({
              "id":parseInt(this.$route.query.id),
              "routeName":this.form.name,
              "treeDto":this.form.treeData[0]
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
    this.dropdown();
    if(this.$route.query.id){
      this.isEdit=true;
      this.cascadeInfo();
    }else{
      this.isCreate=true;
    }
  }
}
</script>

<style>
.myCascade .el-tree-node__content{
  height:50px;
}
</style>