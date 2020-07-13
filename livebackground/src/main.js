// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import VueCookies from 'vue-cookies';
import imgDirective from 'imgbig'
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(VueCookies);
Vue.use(imgDirective);
export const eventBus = new Vue()
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})