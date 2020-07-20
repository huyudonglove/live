<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">位置设置</span>
    </div>
    <el-container>
      <div class="asideTree">
        <el-button type="primary" @click="createDialog(true)">添加一级位置</el-button>
        <div :style="{'overflow':'auto','height':treeHeight+'px'}">
          <el-tree ref="bigTree" highlight-current lazy :load="loadNode" @node-click="showTable" :props="defaultProps">
            <span class="span-ellipsis" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <el-main>
        <div>
          <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding-bottom:15px;">
            <el-button v-if="clickInfo" :disabled="clickInfo.deep==2" type="primary" @click="createDialog(false)">新增</el-button>
            <el-button v-if="clickInfo" type="primary" @click="editParent">编辑</el-button>
            <el-button v-if="clickInfo" :disabled="!!clickInfo.parentId" type="danger" @click="del(clickInfo.id,true)">删除一级位置</el-button>
          </el-row>
        </div>
        <div>
          <el-table ref="positionRef" :data="positionTable" border tooltip-effect="dark" :max-height="tableHeight">
            <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
            <el-table-column label="位置名称" prop="parentPositionName" align="center"></el-table-column>
            <el-table-column label="子级位置名称名称" prop="positionName" align="center"></el-table-column>
            <el-table-column fixed="right" label="操作" width="200" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editChildren(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="del(scope.row.id,false)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <pagination :totalNum="totalNum"></pagination>
        </div>
        <el-dialog :title="(isEdit?'编辑':'添加')+(firstLevel?'一级位置':'子级位置')" :close-on-click-modal="false" :visible.sync="showAssetsDialog" destroy-on-close @close="closeDialog" width="450px" center>
          <el-form ref="form" :model="form" label-width="150px" :rules="rules">
            <el-form-item v-if="!firstLevel" label="上级位置名称" required>
              <el-input disabled v-model="form.parentPositionName" style="width:200px;" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="firstLevel?'一级位置名称':'子级位置名称'" prop="positionName" required>
              <el-input v-model.trim="form.positionName" style="width:200px;" maxlength="20"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button :disabled="isConfirm" type="primary" @click="createAssets">{{isConfirm?isEdit?'修改中...':'创建中...':'确 定'}}</el-button>
            <el-button @click="showAssetsDialog=false">取消</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getPositionTree,getPositionList,createPosition,editPosition,delPosition} from '../../http/request'
export default {
  name:'positionList',
  inject:['reload'],
  components:{
    pagination
  },
  data(){
    return{
      isConfirm:false,
      isEdit:false,
      treedata:[],//树形列表
      defaultProps:{label: 'positionName',isLeaf:'leaf'},
      positionTable:[],//资产位置列表
      showAssetsDialog:false,//显示创建资产弹窗
      firstLevel:false,//是否创建一级位置
      clickInfo:'',//点击的树节点数据
      clickNode:null,//当前点击节点
      editId:'',
      form:{
        positionName:'',
        parentPositionName:'',
        parentId:''
      },
      rules:{
        positionName:[{required: true, message: '请输入位置名称', trigger: 'change'},{required: true, message: '请输入位置名称', trigger: 'blur'}],
      },
      tableHeight:500,
      treeHeight:500,
      totalNum:0,
      myNode0:null,
      myResolve0:null,
      nodeObject:{},
      isEditRow:false
    }
  },
  watch:{
    $route(){
      this.clickInfo?this.getTable(this.clickInfo.id):null;
    }
  },
  methods:{
    async loadNode(node, resolve,isUpdateClickInfo) {
      if (node.level === 0) {
        this.myNode0 = node;
        this.myResolve0 = resolve;
        let firstData;
        try{
          firstData = await this.getTree(0);
        }catch(err){
          firstData = err;
        }
        if(isUpdateClickInfo){
          this.clickInfo=firstData.find(v=>v.id===this.clickInfo.id);
        }
        return resolve(firstData);    
      }
      this.nodeObject[node.data.id+'']={node,resolve};
      if (node.level > 3) return resolve([]);
      let childData;
      try{
        childData = await this.getTree(node.data.id);
      }catch(err){
        childData = err;
      }
      console.log(childData,1515)
      resolve(childData)  
    },
    async append(node,isUpdateClickInfo){
      let childData;
      try{
        childData = await this.getTree(node.data.id);
      }catch(err){
        childData = err;
      }
      if(isUpdateClickInfo){
        this.clickInfo=childData.find(v=>v.id===this.clickInfo.id);
      }
      childData.forEach(v=>{
        this.$refs.bigTree.append(v,node);
      })
      node.expanded=true;
    },
    showTable(arr,node){
      this.clickNode = node;
      this.clickInfo = arr;
      this.getTable(arr.id);
    },
    del(id,first){
      if(first){
        delPosition({id,"actionType":3}).then(res=>{
          this.reload();
        })
      }else{
        delPosition({id,"actionType":3}).then(res=>{
          this.loadNode(this.nodeObject[this.clickInfo.id+''].node,this.nodeObject[this.clickInfo.id+''].resolve);
          this.getTable(this.clickInfo.id);
        })
      }
    },
    getTree(parentId){//查询位置树状结构
      return new Promise((resolve,reject)=>{
        getPositionTree({parentId}).then(res=>{
          // this.treedata = res.data.items;
          let treedata = res.data.items
          // .map(v=>{if(v.deep==2){v.leaf=true};return v;});
          resolve(treedata);
        }).catch(err=>{
          reject([])
        })
      })
    },
    getTable(parentId){
      getPositionList({parentId,...this.$route.query}).then(res=>{
        this.positionTable = res.data.items;
        this.totalNum = res.data.total;
      });    
    },
    editParent(){
      this.isEditRow = false;
      this.isEdit=true;
      this.editId = this.clickInfo.id;
      this.clickInfo.parentId==0?this.createDialog(true):this.createDialog(false);  
      this.form.positionName = this.clickInfo.positionName;
      this.form.parentPositionName = this.clickInfo.parentPositionName;
      this.form.parentId = this.clickInfo.parentId?this.clickInfo.parentId:'';
    },
    editChildren(row){
      this.isEditRow = true;
      this.isEdit=true;
      this.editId = row.id;
      this.createDialog(false);
      this.form.positionName = row.positionName;
      this.form.parentPositionName = row.parentPositionName;
      this.form.parentId = row.parentId?row.parentId:'';
    },
    createDialog(isTrue){//创建窗口
      this.showAssetsDialog=true;
      this.firstLevel = isTrue;
      if(!isTrue){
        this.form.parentPositionName = this.clickInfo.positionName;
        this.form.parentId = this.clickInfo.id;
      }
    },
    closeDialog(){
      this.showAssetsDialog=false;
      this.isEdit=false;
      this.editId='';
      this.form.positionName = '';
      this.form.parentPositionName = '';
      this.form.parentId = '';
    },
    createAssets(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isConfirm=true;
          if(this.isEdit){
            editPosition({"id":this.editId,"positionName":this.form.positionName,"parentId":this.firstLevel?this.clickInfo.parentId:this.form.parentId}).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message.success(res.msg);
                           
                if(this.isEditRow){
                  this.clickNode.childNodes = [];
                  this.append(this.clickNode);
                }else{
                  this.clickNode.parent.childNodes=[];
                  if(this.clickNode.level===1){
                    this.loadNode(this.myNode0,this.myResolve0,true)
                  }else{
                    this.append(this.clickNode.parent,true);
                  }
                }
                this.getTable(this.clickInfo.id); 
                this.closeDialog();
                this.isEdit=false;
              }
            }).catch(err=>{
              this.isConfirm = false;
            })
          }else{
            createPosition({"positionName":this.form.positionName,"parentId":this.firstLevel?this.clickInfo.parentId:this.form.parentId}).then(res=>{
              this.isConfirm = false;
              if(res.code){
                this.$message.error(res.msg);
              }else{
                this.$message({
                  message: res.msg,
                  center: true,
                  type: 'success'
                })
                if(this.firstLevel){
                  this.myNode0.childNodes = [];
                  this.loadNode(this.myNode0,this.myResolve0);
                }else{
                  if(this.clickInfo){
                    this.nodeObject[this.clickInfo.id+''].node.childNodes = [];
                  }
                  this.loadNode(this.nodeObject[this.clickInfo.id+''].node,this.nodeObject[this.clickInfo.id+''].resolve);
                  this.getTable(this.clickInfo.id);
                }          
                this.closeDialog();
              }
            }).catch(err=>{
              this.isConfirm = false;
            });
          }           
        } else {
          console.log('error submit!!');
          return false;
        }
      });   
    },
  },
  created(){
    // this.getTree();//获取外边的树
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.positionRef.$el.offsetTop - 110;
      this.treeHeight = window.innerHeight - this.$refs.bigTree.$el.offsetTop - 110;
      console.log(this.tableHeight)
    })
  }
}
</script>

<style scoped>
.asideTree {
  width: 25%;
  height: 100%;
}
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
