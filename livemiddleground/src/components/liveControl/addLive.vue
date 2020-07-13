<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
        <el-page-header @back="goBack" content="创建直播" style="margin-bottom: 20px">
        </el-page-header>
      </div>
      <baseType></baseType>
    </div>
</template>

<script>
  import baseType from './baseType'
    export default {
        name: "addLive",
        components:{
          baseType
        },
        methods:{
          goBack() {
            this.$router.go(-1)
          }
        }
    }
</script>

<style scoped>

</style>
