<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">观看服务器管理</span>
      <el-button style="float:right;" type="primary" @click="$router.push({path:'/createCascade'})">新建</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        级联名称
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入级联名称" @change="replace('page',1);"></el-input>
      </span>
    </el-row>
    <el-table ref="userRef" :data="cascadeTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="routeName" label="级联名称" align="center"></el-table-column>
      <el-table-column prop="statu" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.statu==1" style="color:339900;">在线</span>
          <span v-if="scope.row.statu==2" style="color:ff9900;">离线</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="$router.push({path:'/createCascade',query:{id:scope.row.id}})">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="totalNum"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '../../share/pagination'
import {getCascadeList} from '../../http/request'
export default {
  name:'cascadeList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      cascadeTable:[],
      tableHeight:0,
      totalNum:0
    }
  },
  watch:{
    inputX(){
      this.replace('containName',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='cascadeList'){
        this.listData();
      }
    }
  },
  methods:{
    listData(){
      getCascadeList(this.$route.query).then(res=>{
        this.cascadeTable=res.data.items;
        this.totalNum = res.data.total;
      })
    },
  },
  created(){
    this.listData();
  },
  updated(){
    if(this.$route.name=='cascadeList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>