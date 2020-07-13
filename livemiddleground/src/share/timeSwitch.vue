<template>
  <div style="display: inline-block">
    <el-date-picker
      v-model="timeValue"
      type="datetimerange"
      format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"
      @change="time"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
  </div>
</template>

<script>
  /*<timeSwitch></timeSwitch>*/
    export default {
        name: "timeSwitch",
        data(){
          return{
              timeValue:[]
          }
        },
        inject:['replace'],
        methods:{
          time(){
            this.replace('page',1);
            this.replace('time',JSON.stringify(this.timeValue))
          }
        },
      created() {
          this.timeValue=this.$route.query.time?JSON.parse(this.$route.query.time):[];
      }
    }
</script>

<style scoped>

</style>
