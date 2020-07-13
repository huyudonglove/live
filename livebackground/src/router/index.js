import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/log/login'
import logout from '../components/log/logout'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
import home from '@/components/home'
import firstPage from '../components/firstPage'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      children:[
        {
          path:'/firstPage',
          name:'firstPage',
          component:firstPage
        },
        {
          path: '/userInfo',
          name: 'userInfo',
          component: () => import('@/components/system/userInfo'),
        },
        {
          path: '/modifyPassword',
          name: 'modifyPassword',
          component: () => import('@/components/system/modifyPassword')
        },
        {
          path: '/userList',
          name: 'userList',
          component: () => import('@/components/userManager/userList')
        },
        {
          path: '/createUser',
          name: 'createUser',
          component: () => import('@/components/userManager/createUser')
        },
        {
          path: '/groupList',
          name: 'groupList',
          component: () => import('@/components/userManager/groupList')
        },
        {
          path: '/createGroup',
          name: 'createGroup',
          component: () => import('@/components/userManager/createGroup')
        },
        {
          path: '/userTable',
          name: 'userTable',
          component: () => import('@/components/system/userTable')
        },
        {
          path: '/addUser',
          name: 'addUser',
          component: () => import('@/components/system/addUser')
        },
        {
          path: '/roleList',
          name: 'roleList',
          component: () => import('@/components/system/roleList')
        },
        {
          path: '/createRole',
          name: 'createRole',
          component: () => import('@/components/system/createRole')
        },
        {
          path: '/channelList',
          name: 'channelList',
          component: () => import('@/components/channelManager/channelList')
        },
        {
          path: '/channelInfo',
          name: 'channelInfo',
          component: () => import('@/components/channelManager/channelInfo')
        },
        {
          path: '/serverList',
          name: 'serverList',
          component: () => import('@/components/serverManager/serverList')
        },
        {
          path: '/cascadeList',
          name: 'cascadeList',
          component: () => import('@/components/serverManager/cascadeList')
        },
        {
          path: '/createCascade',
          name: 'createCascade',
          component: () => import('@/components/serverManager/createCascade')
        },
      {
          path: '/pushAddressManage',
          name: 'pushAddressManage',
          component: () => { return import('@/components/liveManage/pushAddressManage') }
        },
        {
          path: '/playbackVideoManage',
          name: 'playbackVideoManage',
          component: () => { return import('@/components/liveManage/playbackVideoManage') }
        },
        {
          path: '/livingList',
          name: 'livingList',
          component: () => { return import('@/components/appManage/livingList') }
        },
        ,
        {
          path: '/encodeSetting',
          name: 'encodeSetting',
          component: () => { return import('@/components/globalSetting/encodeSetting') }
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/version',
      name:'version',
      component:() => import('@/components/version')
    },
      {
      path: '/aliplayer',
      name: 'aliplayer',
      component: () => { return import('@/components/VueAliplayerV2') }
      }
  ]
})
