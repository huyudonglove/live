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
/** 用户管理-用户列表 Author:minggui*/
export function getUserList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let status = params.status||'';
  let phone = params.phone||'';
  let userGroupId = params.userGroupId||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/middleground/admin/page',{pageNum,pageSize,status,phone,userGroupId}).then(res=>{
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
/** 用户管理-用户组下拉 Author:minggui*/
export function userDropDown(){
  return new Promise((resolve,reject)=>{
    http.get('/api/live/web/user/group/list').then(res=>{
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
/** 用户管理-启用禁用 Author:minggui*/
export function setStatus(params){
  return http.get('/api/live/web/middleground/admin/setStatus',params)
}
/** 用户管理-重置密码 Author:minggui*/
export function resetPassword(params){
  return loadRequest('/api/live/web/middleground/admin/resetPassword',params,'重置密码',http,'get')
}
/** 用户管理-添加用户 Author:minggui*/
export function addUser(params){
    return loadRequest('/api/live/web/middleground/admin/add',params,'添加',http,'post')
}
/** 用户管理-编辑用户 Author:minggui*/
export function editUser(params){
  return loadRequest('/api/live/web/middleground/admin/update',params,'修改',http,'post')
}
/** 用户管理-获取用户信息 Author:minggui*/
export function getUserInfo(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/live/web/middleground/admin/info',params).then(res=>{
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
/** 用户管理-用户组列表 Author:minggui*/
export function getGroupList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let status = params.status||'';
  let name = params.name||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/user/group/page',{pageNum,pageSize,status,name}).then(res=>{
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
/** 用户组管理-启用禁用 Author:minggui*/
export function setGroupStatus(params){
  return http.get('/api/live/web/user/group/setStatus',params)
}
/** 用户组管理-删除用户组 Author:minggui*/
export function delGroup(params){
  return loadRequest('/api/live/web/user/group/delete',params,'删除',http,'get')
}
/** 用户组管理-添加用户组 Author:minggui*/
export function addGroup(params){
  return loadRequest('/api/live/web/user/group/add',params,'添加',http,'post')
}
/** 用户组管理-编辑用户组 Author:minggui*/
export function editGroup(params){
  return loadRequest('/api/live/web/user/group/update',params,'修改',http,'post')
}
/** 用户组管理-获取用户组信息 Author:minggui*/
export function getGroupInfo(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/live/web/user/group/info',params).then(res=>{
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
/** 用户组管理-转码权限下拉 Author:minggui*/
export function powerDropDown(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/listTranCodeSetting',params).then(res=>{
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
/** 系统管理-用户管理-用户列表 Author:minggui*/
export function getUserTable(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let userName = params.userName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/user/page',{pageNum,pageSize,userName}).then(res=>{
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
/** 系统管理-用户管理-重置密码 Author:minggui*/
export function resetSystemPassword(params){
  return loadRequest('/api/live/web/user/resetPassword',params,'重置密码',http,'get')
}
/** 系统管理-用户管理-删除用户 Author:minggui*/
export function delSystemUser(params){
  return loadRequest('/api/live/web/user/delete',params,'删除',http,'get')
}
/** 系统管理-用户管理-添加用户 Author:minggui*/
export function addSystemUser(params){
  return loadRequest('/api/live/web/user/add',params,'添加',http,'post')
}
/** 系统管理-用户管理-编辑用户 Author:minggui*/
export function editSystemUser(params){
  return loadRequest('/api/live/web/user/update',params,'修改',http,'post')
}
/** 系统管理-用户管理-获取用户信息 Author:minggui*/
export function getSystemUserInfo(params){
  return new Promise((resolve,reject)=>{
    http.get('/api/live/web/user/info',params).then(res=>{
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
/** 系统管理-用户管理-角色下拉 Author:minggui*/
export function roleDropDown(){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/role/page').then(res=>{
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
/** 系统管理-角色管理-角色列表 Author:minggui*/
export function getRoleList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let roleName = params.roleName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/role/page',{pageNum,pageSize,roleName}).then(res=>{
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
/** 系统管理-角色管理-删除角色 Author:minggui*/
export function delRole(params){
  return loadRequest('/api/live/web/role/delete',params,'删除',http,'get')
}
/** 系统管理-角色管理-添加角色 Author:minggui*/
export function addRole(params){
  return loadRequest('/api/live/web/role/add',params,'添加',http,'post')
}
/** 系统管理-角色管理-编辑角色 Author:minggui*/
export function editRole(params){
  return loadRequest('/api/live/web/role/update',params,'修改',http,'post')
}
/** 系统管理-角色管理-获取角色信息 Author:minggui*/
export function getRoleInfo(params){
  return http.get('/api/live/web/role/info',params)
}
/** 系统管理-角色管理-获取权限树 Author:minggui*/
export function getRoleTree(){
  return http.post('/api/live/web/role/treeMenuPermission')
}
/** 频道页面管理-频道列表 Author:minggui*/
export function getChannelList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let state = params.state||'';
  let channelName = params.channelName||'';
  let channelClassify = params.channelClassify||'';
  let orderBy = params.sortType||'';
  let orderByName = params.sortName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/channel/page',{pageNum,pageSize,state,channelName,channelClassify,orderBy,orderByName}).then(res=>{
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
/** 频道页面管理-批量上架频道 Author:minggui*/
export function batchUpper(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/channel/batchUpper',params.ids,'上架所选频道',http,'post')
  }else{
    return http.post('/api/live/web/background/channel/batchUpper',params.ids)
  }
}
/** 频道页面管理-批量下架频道 Author:minggui*/
export function batchLower(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/channel/batchLower',params.ids,'下架所选频道',http,'post')
  }else{
    return http.post('/api/live/web/background/channel/batchLower',params.ids)
  }
}
/** 频道页面管理-频道信息 Author:minggui*/
export function getChannelInfo(params){
  return http.get('/api/live/web/background/channel/info',params)
}
/** 频道页面管理-直播间列表 Author:minggui*/
export function getLiveList(params){
  let channelId = params.channelId;
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let isOnShelf = params.isOnShelf||'';
  let liveName = params.liveName||'';
  let orderBy = params.sortType||'';
  let orderByName = params.sortName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/live/page',{channelId,pageNum,pageSize,isOnShelf,liveName,orderBy,orderByName}).then(res=>{
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
/** 频道页面管理-批量上架直播间 Author:minggui*/
export function liveUpper(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/live/batchUpper',params.ids,'上架所选直播间',http,'post')
  }else{
    return http.post('/api/live/web/background/live/batchUpper',params.ids)
  }
}
/** 频道页面管理-批量下架直播间 Author:minggui*/
export function liveLower(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/live/batchLower',params.ids,'下架所选直播间',http,'post')
  }else{
    return http.post('/api/live/web/background/live/batchLower',params.ids)
  }
}
/** 频道页面管理-删除直播间 Author:minggui*/
export function liveDel(params){
  return loadRequest('/api/live/web/background/live/batchDeleteByIds',params,'删除',http,'post')
}
/** 服务器管理-服务器列表 Author:minggui*/
export function getServerList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/listServer',{pageNum,pageSize}).then(res=>{
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
/** 服务器管理-添加服务器 Author:minggui*/
export function addServer(params){
  return http.post('/api/live/web/background/saveServer',params)
}
/** 服务器管理-编辑服务器 Author:minggui*/
export function editServer(params){
  return http.post('/api/live/web/background/saveServer',params)
}
/** 查看服务器管理-级联列表 Author:minggui*/
export function getCascadeList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let containName = params.containName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/queryRouteList',{pageNum,pageSize,containName}).then(res=>{
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
/** 查看服务器管理-添加级联 Author:minggui*/
export function addCascade(params){
  return loadRequest('/api/live/web/background/saveRoute',params,'新建',http,'post')
}
/** 查看服务器管理-编辑级联 Author:minggui*/
export function editCascade(params){
  return loadRequest('/api/live/web/background/saveRoute',params,'编辑',http,'post')
}
/** 查看服务器管理-添加级联 Author:minggui*/
export function getCascadeInfo(params){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/queryRouteDetail',params).then(res=>{
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
/** 查看服务器管理-级联服务下拉框 Author:minggui*/
export function getServerDropdown(){
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/listServer').then(res=>{
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

 /** 直播管理-推流地址管理-列表 w*/
export function pushAddressManageList(params){
  let serverId=params.serverStatus||'';
  let status=params.status||'';
  let onlineStatus=params.liveStatus||'';
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  let needUserInfo=params.needUserInfo||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/queryDevice',{pageNum,pageSize,serverId,status,onlineStatus,needUserInfo}).then(res=>{
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

 /** 直播管理-推流地址管理-服务器下拉列表 w*/
  export function serverDropDown(){
    return http.post('/api/live/web/background/listServer')
  }

// /** 播管理-推流地址管理-删除 w */
// export function pushAddressManageDel (params) {
//   return loadRequest('/api/recorded/collection/delete', params, '删除', http, 'get')
// }

 /** 直播管理-回放视频管理-列表 w*/
 export function playbackVideoManageList(params){
  let likeVideoName=params.wd||'';
  let pageNum = parseInt(params.page)||1;
  let pageSize = parseInt(params.limit)||20;
  let likeUserName=params.q||'';
  let userGroup=params.userGroup||'';
  let playStatus=params.liveStatus||'';
  let uploadTimeFrom=params.time&&params.time !=='null'?JSON.parse(params.time)[0]:'';
  let uploadTimeTo=params.time&&params.time !=='null'?JSON.parse(params.time)[1]:'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/listPlaybackView',{pageNum,pageSize,likeVideoName,likeUserName,userGroup,playStatus,uploadTimeFrom,uploadTimeTo}).then(res=>{
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

/** 播管理-回放视频管理-修改回放视频状态 w */
export function  playbackStatus (params) {
  if(params.serverActionType==1){
    return new Promise((resolve,reject)=>{
       loadRequest('/api/live/web/background/changeReplayBackgroundStatus',params,'上架',http,'post').then(res=>{
        if(res.code){
          Message.error(res.msg);
        }else{
          resolve(res);
        }
      }).catch(err=>{
        reject(params.serverActionType);
      })
    })
    
  }else if(params.serverActionType==2){
    return new Promise((resolve,reject)=>{
      loadRequest('/api/live/web/background/changeReplayBackgroundStatus',params,'下架',http,'post').then(res=>{
        if(res.code){
          Message.error(res.msg);
        }else{
          resolve(res);
        }
      }).catch(err=>{
        reject(params.serverActionType);
      })
    })
  }else{
    {
      return new Promise((resolve,reject)=>{
        loadRequest('/api/live/web/background/changeReplayBackgroundStatus',params,'删除',http,'post').then(res=>{
          if(res.code){
            Message.error(res.msg);
          }else{
            resolve(res);
          }
        }).catch(err=>{
          reject(params.serverActionType);
        })
      })
    }
  }
}


/** VR直播管理-直播页面管理-列表 w*/
export function livingList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let liveState = params.state||'';
  let isOnShelf=parseInt(params.roomStatus)||'';
  let liveName = params.liveName||'';
  let liveClassify = params.liveClassify||'';
  let orderBy = params.orderBy||'';
  let orderByName = params.orderByName||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/live/page',{pageNum,pageSize,liveState,liveName,liveClassify,orderBy,orderByName,isOnShelf}).then(res=>{
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
/** VR直播管理-直播页面管理-批量上架 w*/
export function livingBatchUpper(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/live/batchUpper',params.ids,'上架所选直播间',http,'post')
  }else{
    return http.post('/api/live/web/background/live/batchUpper',params.ids)
  }
}
/** VR直播管理-直播页面管理-批量下架 w*/
export function livingBatchLower(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/live/batchLower',params.ids,'下架所选直播间',http,'post')
  }else{
    return http.post('/api/live/web/background/live/batchLower',params.ids)
  }
}

/** VR直播管理-直播页面管理-批量删除 w*/
export function livingBatchDel(params){
  let isBatch = params.isBatch;
  if(isBatch){
    return loadRequest('/api/live/web/background/live/batchDeleteByIds',params.ids,'删除所选直播间',http,'post')
  }else{
    return http.post('/api/live/web/background/live/batchDeleteByIds',[params.ids])
  }
}
/** 全局设置-转码设置 w*/
export function encodeList(params){
  let pageNum = params.page||1;
  let pageSize = params.limit||20;
  let status = params.status||'';
  let resolvingContainerName = params.wd||'';
  return new Promise((resolve,reject)=>{
    http.post('/api/live/web/background/listTranCodeSetting',{pageNum,pageSize,status,resolvingContainerName}).then(res=>{
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


//用户组下拉
export function groupList(params){
  return http.get('/api/live/web/user/group/list',params)
}
export {
    login,
    getCode
}
