<template>
  <div>
    <div v-if="$route.name=='encodeSetting'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">转码设置</span>
      </div>
      <el-row
        class="tac"
        style="padding:15px 0;"
      >
        <span class="myWords">
          转码分辨率名称：
          <el-input
            v-model="wd"
            style="width: 220px"
            suffix-icon="el-icon-search"
            maxlength="50"
            placeholder=""
            @change="replace('page',1);"
          ></el-input>
        </span>
        <span class="myWords">
          状态：
           <el-select
            v-model="status"
            @change="replace('page',1)"
            style="width: 220px"
          >
            <el-option
              label="全部"
              value=""
            ></el-option>
            <el-option
              label="启用"
              value='1'
            ></el-option>
            <el-option
              label="禁用"
              value='2'
            ></el-option>
          </el-select>
        </span>
      </el-row>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="mt15 mb15 el-table"
        :max-height="tableHeight"
        v-cloak
      >
        <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="转码分辨率名称"
          align="center"
        ></el-table-column>
          <el-table-column
          prop="level"
          label="级别"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="code"
          label="转码分辨率"
          align="center"
        >
        <template slot-scope="scope">
          {{scope.row.width}}*{{scope.row.height}}
        </template>

        </el-table-column>
        <!-- <el-table-column
          prop="equipmentSpecName"
          label="算力消耗"
          align="center"
        >
        </el-table-column> -->
        <el-table-column
          prop="uploadMaxBit"
          label="上传码率最大值/Kbps"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="transcodingRate"
          label="转码码率/Kbps"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.status==1"
              style="color:#339900;"
            >启用</span>
            <span
              v-if="scope.row.status==2"
              style="color:red;"
            >禁用</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "../../share/pagination";
import {
  encodeList
} from "../../http/request";
export default {
  name: "encodeSetting",
  inject: ["replace", "reload"],
  data() {
    return {
      wd: "",
      tableData: [],
      tableHeight: 250,
      status: "",
      total: 0
    };
  },
  computed: {},
  watch: {
    wd() {
      this.replace("wd", this.wd);
    },
    status() {
      this.replace("status", this.status)
    },
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "encodeSetting") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      encodeList(this.$route.query).then(res => {
        this.tableData = res.data.items;
        this.total = res.data.total;
      });
    },
  },
  created() {
    this.wd = this.$route.query.wd || "";
    this.q = this.$route.query.q || "";
    this.status = this.$route.query.status || "";
    this.GroupStatus = this.$route.query.GroupStatus || "";
    this.serverStatus = this.$route.query.serverStatus || "";
    this.liveStatus = this.$route.query.liveStatus || "";
    this.listData();
  },
  updated() {
    if (this.$route.name == "encodeSetting") {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      });
    }
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
