<template>
  <div>
    <el-dialog
    title="删除设备"
    :visible.sync="dialogVisible"
    width="50%"
    @closed="close">
    <h3>删除设备，需先解绑设备所在直播间的机位，此设备绑定的机位如下：</h3>
    <el-table :data="gridData" border style="width: 100%" class="mt15 mb15" >
    <el-table-column property="liveName" label="直播间名称" width="150" align="center"></el-table-column>
    <el-table-column property="deviceName" label="设备名称" width="200" align="center"></el-table-column>
    <el-table-column property="cameraName" label="机位名称" align="center"></el-table-column>
  </el-table>
  <div style="width:250px;margin:0px auto;margin-top:40px">
    <!-- <el-button type="primary" @click="del()" >全部解绑并删除</el-button>
    <el-button @click="close">取 消</el-button>
    -->
  </div>
  </el-dialog>
  </div>
</template>

<script>
import {
  deviceBinding,deleteDeviceBinding
} from "../../http/request";
export default {
  props: ["fSee","id"],
  name: "equipmentList",
  inject: ["replace", "reload"],
  data() {
    return {
      dialogVisible:false,
      gridData: [
      ],
      ids:''
    };
  },
  computed: {

  },
  watch: {
    fSee(){
    // console.log(this.fSee,'fSee')
    this.fSee&&this.id?this.listData():null
    this.dialogVisible = this.fSee;

        }
  },
  methods: {
    handleClose(){

    },
    listData() {
      deviceBinding({deviceId:this.id}).then(res => {
        this.gridData = res.data||[];
        // this.ids=this.gridData.map(v=>v.cameraId).toString()
      });
    },
    close() {
          this.dialogVisible = false;
          this.$emit("dialogDelClose");
    },
    del(){
      deleteDeviceBinding({deviceId:this.id}).then(res=>{
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.reload()
        }
      })
    }
  },
  created() {
    // console.log(11,22)
    // this.listData();
  },
  updated() {

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
