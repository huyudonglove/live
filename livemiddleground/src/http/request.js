import http from '../http'
import {loadRequest} from '../util' //loading遮罩层
import { Message,Loading } from 'element-ui';
const login=(msg)=>{
   return  http.post('/api/live/web/access/login',msg)
}
/* 获取验证码h */
const getCode = () => {
    return http.get('/api/recorded/access/getIdentifyCode')
  }
/** 频道管理 -  列表 w */
export function channelsList (params) {
  let pageNum = parseInt(params.page) || 1
  let pageSize = parseInt(params.limit) || 20
  let orderBy = params.orderBy || ''
  return new Promise((resolve, reject) => {
    http.post('/api/live/web/middleground/utopaChannel/page', {pageNum, pageSize, orderBy}).then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/** 频道 -详细信息  w */
export function channelsInfo (params) {
  return http.get('/api/live/web/middleground/utopaChannel/info', params)
}

/** 频道-新增w */
export function channelsAdd (params) {
  return loadRequest('/api/live/web/middleground/utopaChannel/add', params, '保存', http, 'post')
}
/** 频道-编辑 w */
export function channelsEdit (params) {
  return loadRequest('/api/live/web/middleground/utopaChannel/update', params, '保存', http, 'post')
}

/** 频道-删除 w */
export function channelsDel (params) {
  return loadRequest('/api/live/web/middleground/utopaChannel/delete', params, '删除', http, 'get')
}

/** 频道-上架 w */
export function channelsUpper (params) {
  return new Promise((resolve, reject) => {
    loadRequest('/api/live/web/middleground/utopaChannel/batchUpper', [params.id], '上架', http, 'post').then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(params.state)
    })
  })
}
/** 频道-下架 w */
export function channelsLower (params) {
  return new Promise((resolve, reject) => {
    loadRequest('/api/live/web/middleground/utopaChannel/batchLower', [params.id], '下架', http, 'post').then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(params.state)
    })
  })
}

/** 直播间分页 -  列表 w */
export function roomsList (params) {
  let pageNum = parseInt(params.page) || 1
  let pageSize = parseInt(params.limit) || 20
  let orderBy = params.orderBy || ''
  let channelId= params.channelId || ''
  return new Promise((resolve, reject) => {
    http.post('/api/live/web/middleground/utopaLive/page', {pageNum, pageSize, orderBy,channelId}).then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/** 直播间-上架 w */
export function roomsUpper (params) {
  return new Promise((resolve, reject) => {
    loadRequest('/api/live/web/middleground/utopaLive/batchUpper', [params.id], '上架', http, 'post').then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(params.state)
    })
  })
}
/** 直播间-下架 w */
export function roomsLower (params) {
  return new Promise((resolve, reject) => {
    loadRequest('/api/live/web/middleground/utopaLive/batchLower', [params.id], '下架', http, 'post').then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(params.state)
    })
  })
}

/** VR直播回放 -  列表 w */
export function vrPlaybackList (params) {
  let pageNum = parseInt(params.page) || 1
  let pageSize = parseInt(params.limit) || 20
  let playStatus=params.status||''
  let likeRoomName=params.roomName||''
  let beDelete = false
  return new Promise((resolve, reject) => {
    http.post('/api/live/web/middleground/listPlaybackView', {pageNum, pageSize,beDelete,playStatus,likeRoomName}).then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/** VR直播回放-删除 w */
export function vrPlaybackDel (params) {
  return loadRequest('/api/live/web/middleground/changeReplayStatus', params, '删除', http, 'post')
}

/** VR直播回放 -  回放机位列表查询 w */
export function vrPlaybackCamera (params) {
  return new Promise((resolve, reject) => {
    http.post('/api/live/web/middleground/queryReplayCamera',params).then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}


/** VR直播回放  直播间基础信息详情 w */
export function roomInfo (params) {
  return http.get('/api/live/web/middleground/utopaLive/info', params)
}

/** 资产管理-查询设备列表-列表 w*/
export function queryDeviceManageList(params){
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground/queryDevice',{pageNum,pageSize}).then(res=>{
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
/** 用户基本信息-获取当前基本信息 Author:minggui */
export function getBasicInfo () {
  return http.get('/api/live/web/user/current')
}
/** 用户基本信息-编辑资料 Author:minggui */
export function editInfomation (params) {
  return http.post('/api/live/web/user/updateCurrent', params)
}
/** 用户基本信息-修改密码 Author:minggui */
export function editPassword (params) {
  return loadRequest('/api/live/web/user/modifyPassword', params, '修改密码', http, 'post')
}
/** 资产管理-位置设置-树 Author:minggui*/
export function getPositionTree(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground/queryPosition',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/** 资产管理-位置设置-列表 Author:minggui*/
export function getPositionList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let parentId = params.parentId||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground/queryPosition',{pageNum,pageSize,parentId}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

/** 资产管理 -设备管理-详细信息  w */
export function queryDeviceInfo (params) {
  return http.post('/api/live/web/middleground/getDeviceDetail', params)
}


/** 资产管理-设备管理-新增保存 w */
export function queryDeviceAdd (params) {
  return loadRequest('/api/live/web/middleground/saveDevice', params, '保存', http, 'post')
}


// /** 资产管理-设备管理-更新修改 w */
export function queryDeviceEdit (params) {
  return loadRequest('/api/live/web/middleground/changeStatusDevice', params, '保存', http, 'post')
}


 /** 资产管理-设备管理-服务器下拉列表 w*/
 export function serverDropDown(params){
  return http.post('/api/live/web/middleground/queryRootServer',params)
}

 /** 资产管理-设备管理-分辨率下拉列表 w*/
 export function listResolvingDropDown(params){
  return http.post('/api/live/web/middleground/listTranCodeSetting',params)
}


/** 查询设备机位绑定列表 w*/
export function deviceBinding(params){
  return new Promise((resolve, reject) => {
    http.post('/api/live/web/middleground//queryDeviceBinding', params).then(res => {
      if (res.code) {
        Message.error(res.msg)
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}


/** 获取录播设置详情 w*/
export function videoQueryPlaybackSettingDetail(params){
  return http.post('/api/live/web/middleground/queryPlaybackSettingDetail',params)
}


/** //设备解绑 w */
export function deleteDeviceBinding (params) {
  return loadRequest('/api/live/web/middleground/deleteDeviceBinding', params, '删除', http, 'post')
}
/** //一键下播 　 w */
export function oneKeyEndLive2 (params) {
  return loadRequest('/api/live/web/middleground/utopaLive/oneKeyEndLive', params, '一键下播', http, 'post')
}
/** //停止回放 　 w */
export function stopReview (params) {
  return loadRequest('/api/live/web/middleground/utopaLive/stopReview', params, '停止回放', http, 'post')
}


 /** 通过直播间ID，查询播放列表 w*/
 export function queryReplayListByRoomId(params){
  return http.post('/api/live/web/middleground//queryReplayListByRoomId',params)
}

/** 资产管理-位置设置-添加位置 Author:minggui*/
export function createPosition(params){
  return http.post('/api/live/web/middleground/savePosition',params)
}
/** 资产管理-位置设置-编辑位置 Author:minggui*/
export function editPosition(params) {
  return http.post('/api/live/web/middleground/savePosition', params)
}
/** 资产管理-位置设置-编删除位置 Author:minggui*/
export function delPosition(params) {
  return loadRequest('/api/live/web/middleground/changeStatusPosition', params, '删除', http, 'post')
}
  /*直播管理接口*/
const getLiveList=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/page',msg)
}
/*新增直播间基础*/
const addLiveBase=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/add',msg)
}
/*获取直播基础信息*/
const  getBaseDetail=(id)=>{
    return http.get('/api/live/web/middleground/utopaLive/info',{id:id})
}
/*更新直播基础信息*/
const updateLiveBase=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/update',msg)
}
/*获取直播设置信息*/
const getLiveType=(id)=>{
  return http.post('/api/live/web/middleground/utopaLive/enterUpdateLiveSetting',{liveId:id})
}
/*更新直播设置信息*/
const updateLiveType=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/updateLiveSetting',msg)
}
/*获取导播详情*/
const getDirectType=(id)=>{
  return http.post('/api/live/web/middleground/utopaLive/enterUpdateDirectSetting',{liveId: id})
}
/*获取机位列表*/
const getDeviceList=()=>{
   return http.post('/api/live/web/middleground/utopaLive/queryUnuseDevice')
}
/*新增机位*/
const addDevice=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/addCamera',msg)
}
/*获取机位详情*/
const getCameraInfo=(id)=>{
  return http.get('/api/live/web/middleground/utopaLive/cameraInfo',{id:id})
}
/*更新机位*/
const updateCamera=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/updateCamera',msg)
}
/*删除机位*/
const deleteCamera=(id)=>{
  return http.get('/api/live/web/middleground/utopaLive/deleteCamera',{id:id})
}
/*保存导播设置*/
const saveDirectSetting=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/saveDirectSetting',msg)
}
/*删除直播间*/
const deleteLive=(id)=>{
  return loadRequest('/api/live/web/middleground/utopaLive/delete',{id:id},'删除',http,'get')
}
/*上架直播间*/
const  upLive=(id)=>{
  return  http.post('/api/live/web/middleground/utopaLive/batchUpper',[id])
}
/*下架直播间*/
const downLive=(id)=>{
  return  http.post('/api/live/web/middleground/utopaLive/batchLower',[id])
}
/*一键下播*/
const oneKeyEndLive=(id)=>{
  return http.post('/api/live/web/middleground/utopaLive/oneKeyEndLive',{id:id})
  //return loadRequest('/api/live/web/middleground/utopaLive/oneKeyEndLive',{id:id},http,'post')
}
/*获取回放视频列表*/
const listPlaybackView=(msg)=>{
  return http.post('/api/live/web/middleground/queryPlayBack',msg)
}
/*保存回放*/
const savePlayback=(msg)=>{
  return http.post('/api/live/web/middleground/utopaLive/savePlayback',msg)
}

/*获取回放*/
const getPlayBack=(id)=>{
  return http.post('/api/live/web/middleground//queryPlaybackSettingDetail',{roomId:id,needOriginalPassword:true})
}

/** 设备管理-获取拉流地址 w*/
export function getVideoUrl(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground/utopaLive/previewLive',params).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}

/** 全局设置-转码设置 w*/
export function encodeList(params){
  let pageIndex = params.page||1;
  let pageSize = params.limit||20;
  let status = params.status||'';
  let resolvingContainerName = params.wd||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground//listTranCodeSetting',{pageIndex,pageSize,status,resolvingContainerName}).then(res=>{
      if(res.code){
          Message.error(res.msg);
      }else{
          resolve(res);
      }
    }).catch(err=>{
      reject(err);
    })
  })
}
/*修改密码*/
const firstPass=(msg)=>{
  return http.post('/api/live/web/access/modifyPasswordByLogin',msg)
}
/*停止回放*/
const stopReviewH=(id)=>{
  return loadRequest('/api/live/web/middleground/utopaLive/stopReview',{id:id},'停止',http,'post')
}

/*通过回访ID查找回放记录 w*/


 /** 通过直播间ID，查询播放列表 w*/
 export function queryReplayList(params){
  return http.post('/api/live/web/middleground/queryReplayList',params)
}

export {
    login,
    getCode,
    getLiveList,
    addLiveBase,
    getBaseDetail,
    updateLiveBase,
    getLiveType,
    updateLiveType,
    getDirectType,
    getDeviceList,
    addDevice,
    getCameraInfo,
    updateCamera,
    deleteCamera,
    saveDirectSetting,
    deleteLive,
    upLive,
    downLive,
    oneKeyEndLive,
    listPlaybackView,
    savePlayback,
    getPlayBack,
    firstPass,
    stopReviewH
}
