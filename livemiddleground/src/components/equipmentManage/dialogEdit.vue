<template>
  <div>
    <el-dialog
    :title="titleDig"
    :visible.sync="dialogVisible"
    width="30%"
    @closed="close"
    >
    <el-form ref="formSize" :model="formSize" label-width="110px" :rules="rules">
    <el-form-item label="设备名称：" prop="name">
      <el-input v-model.trim="formSize.name"  maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="推流地址：">
      <el-input v-model="address" :disabled="true"></el-input>
    </el-form-item>
    <el-form-item label="服务器：" prop="serverId">
      <el-select v-model="formSize.serverId" style="width:100%" :disabled="disable">
        <el-option v-for="(item,i) in serverList" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="分辨率：" prop="resolvingId" >
      <el-select v-model="formSize.resolvingId" style="width:100%" :disabled="disable">
        <el-option v-for="(item,i) in listResolving" :key="i" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="投放位置：">
      <span v-if="!isCreate||tagShow">
      <el-tag
      :key="item.name"
      v-for="item in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(item.name)"
      >
      {{item.pathName||item.detailPositionName}}
    </el-tag>
      </span>
      <el-button  @click="innerVisible = true" v-if="btnShow">选择位置</el-button>
    </el-form-item>
    </el-form>
   <div style="width:180px;margin:0px auto;margin-top:40px">
    <el-button type="primary" @click="submitForm('formSize');">确认</el-button>
    <el-button @click="close">取 消</el-button>
  </div>
  <el-dialog
  width="70%"
  title="位置"
  :visible.sync="innerVisible"
  append-to-body
  @closed="innerClose"
  >
  <el-row>
  <el-col :span="6">
    <el-tree ref="bigTree" lazy highlight-current :load="loadNode" @node-click="showTable" :props="defaultProps">
    <span class="span-ellipsis" slot-scope="{ node }">
      <span :title="node.label">{{ node.label }}</span>
    </span>
  </el-tree>
  </el-col>
  <el-col :span="18">
    <el-table ref="multipleTable" :data="positionTable" border style="width: 100%" class="mt15 mb15 el-table"  v-cloak>
    <el-table-column  prop="id" label="ID" width="100" align="center"></el-table-column>
    <el-table-column  prop="parentPositionName" label="位置名称" align="center"></el-table-column>
    <el-table-column  prop="positionName" label="子级位置名称" align="center"></el-table-column>
    <el-table-column  align="center" width="120 " label="操作" >
     <template slot-scope="scope">
       <el-button type="primary" @click="selectOne(scope.row)" size="small">选择</el-button>
     </template>
    </el-table-column>
  </el-table>
  </el-col>
  </el-row>
    
  
</el-dialog>
  </el-dialog>
  </div>
</template>

<script>
import {
  queryDeviceInfo,queryDeviceAdd,queryDeviceEdit,serverDropDown,listResolvingDropDown,getPositionTree,getPositionList,deviceBinding
} from "../../http/request";
export default {
  props: ["fSee","id"],
  name: "equipmentList",
  inject: ["replace", "reload"],
  data() {
    return {
      dialogVisible:false,
      isCreate:true,
      formSize:{
        name:'',
        serverId:'',
        positionId:'',
        resolvingId:'',
      },
      tagShow:false,//tag
      dynamicTags: [],
      // oldDynamicTags:[],
      serverList:[
        {id:1,name:1}
      ],
      address:'自动生成',
      listResolving:[
         {id:1,name:1}
      ],
      checkId:false,
      innerVisible:false,
      btnShow:true,
      title:'',
      titleDig:'创建设备',
      rules: {
       name: [
          { required: true, message: '请输入设备名称', trigger: 'change' },
          { min: 1, max: 28, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ],
       serverId: [
          { required: true, message: '请选择服务器', trigger: 'change' }
        ],
       resolvingId: [
          { required: true, message: '请选择分辨率', trigger: 'change' }
        ],
      },
      treedata:[],//树形列表
      defaultProps:{label: 'positionName',isLeaf:'leaf'},
      positionTable:[
      ],
      mySetTimeout:null,
      disable:false
    };
  },
  computed: {

  },
  watch: {
    fSee(){
    this.fSee&&this.id?this.infoData():null 
    this.dialogVisible = this.fSee;
        },
  },
  methods: {
    async loadNode(node, resolve,isUpdateClickInfo) {
      this.myNode = node;
      this.myResolve = resolve;
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
      if (node.level > 3) return resolve([]);
      let childData;
      try{
        childData = await this.getTree(node.data.id);
      }catch(err){
        childData = err;
      }
      resolve(childData)  
    },
    showTable(arr,node){
      this.clickNode = node;
      this.clickInfo = arr;
      this.getTable(arr.id);
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
    listData() {
      queryDeviceManageList(this.$route.query).then(res => {
        this.gridData = res.data.items;
      });
    },
    //服务器下拉
    dropServerData() {
      serverDropDown({}).then(res => {
        this.serverList = res.data;
      });
    },
    //分辨率下拉
    dropListResolvingData() {
      listResolvingDropDown({status:1}).then(res => {
        this.listResolving = res.data.items;
      });
    },
    close() {
      this.dialogVisible = false;
      this.dynamicTags=[];
      this.isCreate=true;
      this.tagShow=false;
      this.btnShow=true;
      // this.formSize={
      // name:'',
      // serverId:'',
      // positionId:'',
      // resolvingId:'',
      //     }
      this.reload()
      this.$emit("dialogEditClose");
    },
    innerClose(){
      this.innerVisible=false;
      // if(!this.checkId){
      //    this.dynamicTags=JSON.parse(JSON.stringify(this.oldDynamicTags))
      //    this.btnShow=false
      // }
    },
    //选择单行
    selectOne(row){
      this.checkId=true
      this.tagShow=true,//tag
      this.dynamicTags.length?this.dynamicTags.push({...row}).unshift():this.dynamicTags.push({...row})
      // this.oldDynamicTags=JSON.parse(JSON.stringify(this.dynamicTags))
      this.innerVisible=false
      this.btnShow=false;
      this.formSize.positionId=row.id
    },
    infoData () {
      this.titleDig="编辑设备"
      deviceBinding({deviceId:this.id}).then(res => {
       res.data.length?this.disable=true:this.disable=false
      });
      queryDeviceInfo({id:this.id}).then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          if(res.data.detailPositionName){
          this.isCreate=false;
          this.btnShow=false;
          }else{
          this.isCreate=true;
          this.btnShow=true;
          }
          this.formSize = res.data
          this.dynamicTags=[];
          if(res.data.positionId){
            this.dynamicTags.push({...this.formSize})
          }
         
          // console.log(this.dynamicTags,'this.dynamicTags')
        }
      })
    },
  submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            queryDeviceAdd({...this.formSize}).then(res => {
            if (res.code) {
              this.$message.error(res.msg)
            } else {
              this.reload()
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleClose(tag) {
      console.log(tag,1111)
      this.formSize.positionId=''
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.btnShow=true
      this.checkId=false
      },
  },
  created() {
   this.dropServerData()
   this.dropListResolvingData()
  },
  updated() {
    
  },
   destroyed(){
    clearTimeout(this.mySetTimeout);
  },
  components: {
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
