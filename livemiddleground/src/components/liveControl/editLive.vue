<template>
    <div>
      <el-page-header @back="goBack" content="编辑直播" style="margin-bottom: 20px">
      </el-page-header>

      <el-tabs tab-position="left" style="height: 800px;"  @tab-click="handleClick">
        <el-tab-pane label="基础设置">
          <baseType  v-if="index==0"></baseType>
        </el-tab-pane>
        <el-tab-pane label="导播设置">
          <directType v-if="index==1"></directType>
        </el-tab-pane>
        <el-tab-pane label="直播设置">
          <liveType v-if="index==2" ref="liveType"></liveType>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import baseType from './baseType'
  import directType from './directType'
  import liveType from './liveType'

  export default {
        name: "editLive",
        components:{
          baseType,liveType,directType
        },
        data(){
          return{
            index:''
          }
        },
        methods:{
          handleClick(tab, event) {
             this.index=tab.index;
          },
          getLiveList(){

          },
          goBack() {
            this.$router.go(-1)
          }
        },
    // beforeRouteLeave(to, from, next){
    //   console.log(123);
    //   console.log(this.$refs.liveType,7777)
    //   next(true)
    // },
    }
</script>

<style scoped>

</style>
