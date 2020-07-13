import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/log/login'
import home from '@/components/home'
import firstPage from '../components/firstPage'
import liveList from  '../components/liveControl/liveList'
import live from '../components/liveControl/live'
import editLive from '../components/liveControl/editLive'
import addLive from  '../components/liveControl/addLive'
import logout from '../components/log/logout'
import revisePasswordHu from '../components/log/revisePasswordHu'
import version from  '../components/version'
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
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
          path: '/channelsList',
          name: 'channelsList',
          component: () => { return import('@/components/vrLiving/channels/channelsList') },
          children:[
            {
              path: '/channelsList/channelsListInfo',
              name: 'channelsListInfo',
              component: () => { return import('@/components/vrLiving/channels/channelsListInfo') }
            },
            {
              path: '/channelsList/channelsCreate',
              name: 'channelsCreate',
              component: () => { return import('@/components/vrLiving/channels/channelsCreate') }
            }
          ]
        },
        {
          path:'/vrPlayback',
          name:'vrPlayback',
          component: () => { return import('@/components/vrPlayback/vrPlayback') }
        },
        {
          path:'/equipmentList',
          name:'equipmentList',
          component: () => { return import('@/components/equipmentManage/equipmentList')}
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
          path: '/positionList',
          name: 'positionList',
          component: () => import('@/components/position/positionList')
        },
        {path:'/live',
          name:'live',
          component:live,
          children:[
            {
              path:'/live/liveList',
              name:'liveList',
              component:liveList
            },
            {
              path:'/live/editLive',
              name:'editLive',
              component:editLive
            },
            {
              path:'/live/addLive',
              name:'addLive',
              component:addLive
            }
          ]
        }
      ]
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path: '/aliplayer',
      name: 'aliplayer',
      component: () => { return import('@/components/VueAliplayer') }

      },
      {
        path: '/playAliplayer2',
        name: 'playAliplayer2',
        component: () => { return import('@/components/playAliplayer2') }

        },
    {
      path:'/logout',
      name:'logout',
      component:logout
    },
    {
      path:'/revisePasswordHu',
      name:'revisePasswordHu',
      component:revisePasswordHu
    },
    {
      path:'/version',
      name:'version',
      component:version
    }
  ]
})
