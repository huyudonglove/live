<template>
  <div class="big" >
    <div align="center"><img class="input1"  src="../assets/left.png" @click="pre()" /></div>
    <ul ref="ul">
      <li v-for="(item, index) in similarImages" :key="index" @click="show(item,index)" style="cursor:pointer" :class="{border:item.deviceDto.streamId==streamId}">
        <span :class="{red:item.deviceDto.streamId==streamId}">{{item.cameraName}}</span>
        <!-- <img width="100" height="100" :src="`/download/file/get/${item.fileId}`"> -->
      </li>
    </ul>
    <div align="center"> <img class="input2"  src="../assets/right.png" @click="next()" /></div>
  </div>
</template>

<script>
import { eventBus } from '../main'
export default {
  name: "pics",
  props: ["similarImages","streamId"],
  data(){
    return {
      total:0,
      n:0
    }
  },
  created(){
    
  },
  mounted(){
   this.$nextTick(()=>{
      this.total=this.similarImages.length;
    })
    this.n=Math.ceil((parseInt(this.$refs['ul'].clientWidth)-160)/150)
  },
  methods:{
    pre(){
      this.$nextTick(()=>{
      let ul=this.$refs['ul']
      // if(this.total<=this.n){
      //   return;
      // }else{
        this.similarImages.push(this.similarImages[0]);  // 将数组的第一个元素添加到数组的
        this.similarImages.shift();  //删除数组的第一个元素  
        ul.style.top ="0px"
      // }
        })
    },
    next(){
     this.$nextTick(()=>{
      let ul=this.$refs['ul']
      // if(this.total<=this.n){
      //   return;
      // }else{
       this.similarImages.unshift(this.similarImages[this.similarImages.length-1]);  // 将数组的最后一个元素添加到数组的头部
       this.similarImages.pop();  //删除数组的最后一个元素  
        ul.style.top ="0px"
      // }
     })
    },
   show(item,index){
     eventBus.$emit('pic',item,index)
   }
  }
  }

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
/* .big {
  padding:20px 40px;
  height:100px;
} */
ul {
  /* /* width: 100%; */
  position: relative;
  overflow: hidden;
  left:0px;
  max-height: 510px;
}
li {
  min-height: 150px;
  line-height: 150px;
  overflow: hidden;
  color: #fff;
  /* line-height: 170px; */
  margin-bottom: 20px;
  text-align: center;
  border: 1px solid #fff;
}
span{display: inline-block;vertical-align: middle;line-height: 22px;}
.input1 {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.input2 {
  width: 40px;
  height: 40px;
  cursor: pointer;
  z-index: 9999;
  position: relative;
}
.border{
  border: 1px solid #FF644E;
}
.red{
  color: #FF644E;
}
</style>
