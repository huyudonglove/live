webpackJsonp([0],{"+63v":function(t,e,i){"use strict";i("NYxO");var a={name:"pagination",computed:{},props:["totalNum"],inject:["reload","replace"],methods:{pageChange:function(t){console.log(1111),this.replace("page",t)},limitChange:function(t){console.log(2222),this.replace("limit",t),this.replace("page",1)}},data:function(){return{page:1,limit:20}},created:function(){this.page=this.$route.query.page||1,this.limit=this.$route.query.limit||20},mounted:function(){},watch:{$route:function(){this.page=this.$route.query.page||1,this.limit=this.$route.query.limit||20}}},n={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"block",staticStyle:{position:"fixed",left:"250px",bottom:"0px","z-index":"2000","padding-bottom":"10px","background-color":"#ffffff",width:"100%"}},[e("el-pagination",{attrs:{background:"","current-page":parseInt(this.page),"page-sizes":[20,40,60,80],"page-size":parseInt(this.limit),layout:"total,sizes, prev, pager, next,jumper",total:this.totalNum},on:{"size-change":this.limitChange,"current-change":this.pageChange}})],1)},staticRenderFns:[]};var o=i("VU/8")(a,n,!1,function(t){i("746H")},"data-v-1d3c9c25",null);e.a=o.exports},"746H":function(t,e){}});