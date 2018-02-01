import Vue from 'vue'
import Router from 'vue-router'
// import HelloFromVux from '@/components/HelloFromVux'
import Uploader from '@/components/Uploader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: Uploader
    },
    {
      path: '/up',
      name: 'HelloWorld',
      component: Uploader
    }
  ]
})
