<template>
  <div>
    <div v-if="$route.name=='channelsList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">频道管理</span>
        <el-button  style="float:right;" type="primary" @click="$router.push({path:'/channelsList/channelsCreate',query:{msg:JSON.stringify($route.query)}})">新建频道</el-button>
      </div>
      <el-table ref="groundRef" :data="tableData" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
        <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
        <el-table-column prop="channelCover" label="封面图" align="center" width="140">
           <template slot-scope="scope">
            <img :src="scope.row.channelCover?`${scope.row.channelCover}`:null" alt=""  style="width:70px;height:70px;" v-focus>
          </template>

        </el-table-column>

        <el-table-column prop="channelName" label="频道名称" align="center">
          <template slot-scope="scope">
            <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="channelViceTopic" label="频道副标题" align="center" width="150">
           <template slot-scope="scope">
           <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelViceTopic}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="channelClassify" label="频道类型" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.channelClassify==1">全部</span>
          </template>
        </el-table-column>
        <el-table-column prop="channelBrief" label="频道简介" align="center" width="">
          <template slot-scope="scope">
           <div style="overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;">{{scope.row.channelBrief}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="liveNum" label="直播间数量" align="center" width="">
        </el-table-column>
        <el-table-column prop="onlineViewing" label="在线观看人数" align="center" width="100">
        </el-table-column>
        <el-table-column prop="state" label="状态" align="center" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">上架</span>
            <span v-if="scope.row.state==2" style="color:#FF644E">下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" align="center" width="110"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="110"></el-table-column>
         <el-table-column prop="state" label="上架/下架" align="center" width="120">
            <template slot-scope="scope">
            <el-switch
            v-model="scope.row.state"
            :active-value='1'
            :inactive-value='2'
            @change="upState(scope.row.state,scope.row.id)"
          >
          </el-switch>
           </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template slot-scope="scope">
            <el-button  type="primary" size="mini" @click="$router.push({path:'/live/addLive',query:{roomId:scope.row.id}})">创建直播间</el-button>
            <el-button type="success"  size="mini"  @click="$router.push({path:'/channelsList/channelsListInfo',query:{id:scope.row.id,msg:JSON.stringify($route.query)}})">管理频道</el-button>
            <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination :totalNum="total"></pagination>
      </div>
    </div>
     <router-view></router-view>
    <div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import pagination from '../../../share/pagination'
import { Base64 } from 'js-base64'
import {channelsList, channelsDel, channelsUpper, channelsLower} from '../../../http/request'
export default {
  name: 'channelsList',
  inject: ['replace', 'reload'],
  components: {
    pagination
  },
  data () {
    return {
      tableData: [],
      tableHeight: 200,
      imgId: '',
      total:0
    }
  },
  computed: {
  },
  watch: {
    $route () { // 判断路由query变化执行请求
      if (this.$route.name === 'channelsList') {
        this.listData()
      }
    }
  },
  methods: {
    listData () {
      channelsList({...this.$route.query, orderBy: 1}).then(res => {
        this.tableData = res.data.items
        this.tableData = this.tableData.map(v => {
          if (v.channelCover) {
            v.channelCover = `/static/${Base64.decode(v.channelCover)}`
          }
          return v
        })
        this.total= res.data.total
      })
    },
    upState (state, id) {
      if (state === 2) {
        channelsLower({id, state}).then(res => {
          if (res.code) {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.tableData = this.tableData.map(item => {
            if (item.id == id) {
              item.state = 1
            }
            return item
          })
        })
      } else {
        channelsUpper({id, state}).then(res => {
          if (res.code) {
            this.$message.error(res.msg)
          }
        }).catch(err => {
          this.tableData = this.tableData.map(item => {
            if (item.id == id) {
              item.state = 2
            }
            return item
          })
        })
      }
    },
    del (id) {
      channelsDel({id: id}).then(res => {
        if (res.code) {
          this.$message.error(res.msg)
        } else {
          this.reload()
        }
      })
    }
  },
  created () {
    this.listData()
  },
  updated () {
    if (this.$route.name === 'channelsList') {
      this.$nextTick(() => {
        this.tableHeight = window.innerHeight - this.$refs.groundRef.$el.offsetTop - 110
      })
    }
  }
}
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
