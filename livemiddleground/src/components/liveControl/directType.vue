<template>
    <div>
      <div>
        <el-button type="primary" size="small" :disabled="cameraInUseNum>=maxCameraNum" @click="dialogVisible=true;">新增机位</el-button>
        <span class="myWords" style="margin-left: 20px">累计已用机位数/总机位数: {{cameraInUseNum}} / {{maxCameraNum}}</span>
      </div>
      <div style="margin-top: 20px">
        <el-table :data="cameraList" border style="width:90%">
          <el-table-column prop="id" label="ID" width="180">
          </el-table-column>
          <el-table-column prop="cameraName" label="机位名称" width="180">
          </el-table-column>
          <el-table-column prop="name" label="设备名称">
          </el-table-column>
          <el-table-column prop="resolvingName" label="分辨率">
          </el-table-column>
          <el-table-column prop="serverName" label="服务器">
          </el-table-column>
          <el-table-column prop="detailPositionName" label="投放位置">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCamera(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <p class="myWords">直播观看地址 <span style="color: red">（仅内网观看生效）</span></p>
        <div>
          <p v-for="item in nodeDOList">
            <span><el-checkbox v-model="item.checked">{{item.name}}</el-checkbox></span>
          </p>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="saveDirectSetting()">保存</el-button>
      </div>
      <div>
        <el-dialog :title="camera.id?'编辑机位':'新增机位'" :visible.sync="dialogVisible" width="30%" @close="cancel()">
            <div><i style="color: red;padding: 5px">*</i>机位名称 <el-input v-model="camera.cameraName" style="width: 300px;margin-left: 10px" maxlength="20"></el-input></div>
            <div style="margin-top: 10px"><i style="color: red;padding: 5px">*</i>添加设备 <el-tag v-if="pickDevice.name" style="margin-left: 10px">{{pickDevice.name}}</el-tag><el-button @click="deviceList=true;getDeviceList();" style="margin-left: 10px">+</el-button> </div>
            <div style="margin-top: 10px"><i style="color: red;padding: 5px">*</i>投放位置 <span style="margin-left: 10px">{{pickDevice.detailPositionName}}</span></div>
            <p style="color: red;margin-left: 12px;">注：编辑后需要重新选择观看地址</p>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false;cancel()">取 消</el-button>
            <el-button type="primary" @click="addDevice()" v-if="!camera.id">确 定</el-button>
            <el-button type="primary" @click="updateCamera()" v-if="camera.id">确定</el-button>
          </span>
        </el-dialog>
      </div>
      <div>
        <el-dialog title="选择设备" :visible.sync="deviceList" width="80%">
          <el-table :data="deviceData" style="width: 100%">
            <el-table-column prop="name" label="设备名称" width="180">
            </el-table-column>

            <el-table-column prop="serverName" label="服务器">
            </el-table-column>
            <el-table-column prop="detailPositionName" label="投放位置">
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="deviceList=false;pickDevice=scope.row;">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {getDirectType,getDeviceList,addDevice,getCameraInfo,updateCamera,deleteCamera,saveDirectSetting} from "../../http/request";

  export default {
        name: "directType",
        data() {
          return {
            tableData: [],
            id:'',
            maxCameraNum:0,
            cameraInUseNum:0,
            dialogVisible:false,
            camera:{
              id:'',
              cameraName:'',
            },
            deviceList:false,
            deviceData:[],
            pickDevice:[],
            directId:'',
            cameraList:[],
            nodeDOList:[]
          }
        },
        methods:{
          getDirectType(){
            getDirectType(this.id).then(res=>{
                  console.log(res)
              this.nodeDOList=[];
              res.code?this.$message.error(res.msg):(()=>{
                this.maxCameraNum=res.data.maxCameraNum;
                this.cameraInUseNum=res.data.cameraInUseNum;
                this.directId=res.data.id;
                this.cameraList=res.data.cameraList;
                res.data.nodeDOList&&res.data.nodeDOList.map(v=>{v.checked=false;this.nodeDOList.push(v)});
                let serverItems=[];
                res.data.serverItems.map(v=>{serverItems.push(v.serverId)});
                serverItems.length&& this.nodeDOList.map(v=>{
                  serverItems.includes(v.id)&&(()=>{v.checked=true})()
                })

              })();
            })
          },
          getDeviceList(){
            getDeviceList().then(v=>{
              console.log(v)
              this.deviceData=v.data.items;
            })
          },
          addDevice(){
            let msg={
              cameraName:this.camera.cameraName,
              directId:this.directId,
              deviceId: this.pickDevice.id
            };
            msg.cameraName?(()=>{
              msg.deviceId?(()=>{
                this.dialogVisible=false;
                addDevice(msg).then(v=>{
                  v.code?this.$message.error(v.msg)&&this.getDirectType()&&this.cancel():this.$message.success(v.msg)&&this.getDirectType()&&this.cancel();
                })


              })():this.$message.error('设备不能为空')
            })():this.$message.error('设备名称不能为空')
          },
          cancel(){
            this.camera={
              id:'',
              cameraName:'',
            };
            this.pickDevice=[]
          },
          edit(row){
            console.log(row);
            this.dialogVisible=true;
            this.camera.id=row.id;
            this.getCameraInfo();
          },
          getCameraInfo(){
              getCameraInfo(this.camera.id).then(res=>{
                  console.log(res,777)
                this.camera.cameraName=res.data.cameraName;
                this.pickDevice={
                  name:res.data.name,
                  detailPositionName:res.data.detailPositionName,
                  deviceId:res.data.deviceId
                }
              })
          },
          updateCamera(){
            let msg={
              id:this.camera.id,
              cameraName:this.camera.cameraName,
              deviceId:this.pickDevice.id
            }
            msg.cameraName?(()=>{
              this.dialogVisible=false;
              updateCamera(msg).then(res=>{
                res.code?this.$message.error(res.msg)&&this.getDirectType()&&this.cancel():this.$message.success(res.msg)&&this.getDirectType()&&this.cancel();
              })
            })():this.$message.error('设备名称不能为空')

          },
          deleteCamera(id){
            // deleteCamera(id).then(res=>{
            //   this.getDirectType();
            // })
            const h = this.$createElement;
            this.$msgbox({
              title: '提示',
              message: h('p', null, [
                h('h4', null, '确认删除吗 '),
                h('p', { style: 'color: red' }, '注：删除后需要重新选择观看地址')
              ]),
              showCancelButton: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消',
            }).then(action => {
              deleteCamera(id).then(res=>{
                res.code&&this.$message.error(res.msg);
                !res.code&&this.$message.success(res.msg);
                this.getDirectType();
              })
            }).catch(r=>{

            });
          },
          saveDirectSetting(){
            let msg={
              id:this.directId,
              serverIds:[]
            };
            this.nodeDOList.map(v=>{
              v.checked&&msg.serverIds.push(v.id)
            })
            // msg.serverIds.length&&(()=>{
            //
            // })();
            // !msg.serverIds.length&&this.$message.error('观看地址不能为空！')
            saveDirectSetting(msg).then(res=>{
              res.code?this.$message.error(res.msg):this.$message.success(res.msg)
            })
            console.log(msg)
          }
        },
        created() {
          this.id=this.$route.query.id;
          this.getDirectType();
        },
        watch:{
          pickDevice(){
            console.log(this.pickDevice)
          }
        }
  }
</script>

<style scoped>

</style>
