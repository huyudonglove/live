<template>
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px" style="width: 50%">
        <el-form-item label="直播开始时间" prop="startTime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.startTime" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="直播结束时间" prop="endTime">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.endTime" style="width: 100%;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
        <el-form-item label="网络规则" prop="liveNetRule">
          <el-radio-group v-model="form.liveNetRule">
            <el-radio :label="1">公网+内网</el-radio>
            <el-radio :label="0">仅内网</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直播间密码" prop="isNeedPassword">
          <el-radio-group v-model="form.isNeedPassword">
            <el-radio :label="1">无</el-radio>
            <el-radio :label="0">有</el-radio>
          </el-radio-group>
          <span v-if="form.isNeedPassword==0"><el-input v-model.trim="form.livePassword" placeholder="请输入6个字符长度密码" style="width: 180px;margin-left: 10px" maxlength="6"></el-input></span>
        </el-form-item>
<!--        <el-form-item label="是否录制回放" prop="isPlayBack">-->
<!--          <el-radio-group v-model="form.isPlayBack">-->
<!--&lt;!&ndash;            <el-radio :label="1">否</el-radio>&ndash;&gt;-->
<!--            <el-radio :label="0">是</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="updateLiveType('form')">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import {getLiveType,updateLiveType} from "../../http/request";

  export default {
        name: "liveType",
        data() {
          return {
            form: {
              startTime:'',
              endTime:'',
              liveNetRule:1,
              isNeedPassword:1,
              livePassword:'',
              isPlayBack:1,
              id:''
            },
            rules:{
              startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
              endTime:[{ required: true, message: '请选择结束时间', trigger: 'blur' }],
              liveNetRule:[{ required: true, message: '请选择直播规则', trigger: 'blur' }],
              isNeedPassword:[{ required: true, message: '请选择是否需要密码', trigger: 'blur' }],
              isPlayBack:[{ required: true, message: '请选择是否回放', trigger: 'blur' }]
            },
            id:''
          }
        },
        methods: {
          updateLiveType(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                //console.log(this.form)
                new Date(this.form.startTime)<new Date(this.form.endTime)?(()=>{
                  !this.form.isNeedPassword&&(()=>{
                    !this.form.livePassword&&this.$message.error('请输入密码');
                    this.form.livePassword.length==6&&(()=>{
                      this.form.livePassword&&updateLiveType(this.form).then(res=>{
                        console.log(res,777777)
                        res.code?this.$message.error(res.msg):this.$message.success(res.msg)
                      })
                    })();
                    this.form.livePassword.length!=6&&this.$message.error('密码长度限制为6个字符')
                  })();
                  this.form.isNeedPassword&&(()=>{
                    updateLiveType(this.form).then(res=>{
                      console.log(res,777777)
                      res.code?this.$message.error(res.msg):this.$message.success(res.msg)
                    })
                  })();
                })():this.$message.error('结束时间不能早于开始时间')
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          },
          getLiveType(){
            getLiveType(this.id).then(res=>{
              res.code?this.$message.error(res.msg):(()=>{
                this.form.id=res.data.id;
                this.form.startTime=res.data.startTime;
                this.form.endTime=res.data.endTime;
                this.form.isNeedPassword=res.data.isNeedPassword ;
                this.form.isPlayBack=res.data.isPlayBack;
                this.form.liveNetRule=res.data.liveNetRule;
                this.form.livePassword=res.data.livePassword;
              })();
              console.log(res,777)
            })
          }
        },
        created() {
          console.log(11111)
          this.$route.query.id&&(()=>{
            this.id=this.$route.query.id;
            this.getLiveType();
          })();
        },
      mounted() {

      }
  }
</script>

<style scoped>

</style>
