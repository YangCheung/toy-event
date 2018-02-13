import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'

FastClick.attach(document.body)
Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(VueLazyload)

new Vue({
  el: '#app-box',
  router,
  template: '<App/>',
  components: { App }
})
