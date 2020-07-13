<template>
    <div>
      欢迎使用VR直播后台管理
    </div>
</template>

<script>
  import timeSwitch from '../share/timeSwitch'
export default {
  name: 'firstPage',
  created () {

  },
  components:{
    timeSwitch
  },
  inject: ['reload'],
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
   height: 450px;
  }
  .h-span{
    display: inline-block;
    width: 70px;
  }
  .h-div{
    width: 200px;
    height: 200px;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
    border-radius: 2px;
    text-align: center;
    padding-top: 20px;
  }
</style>
