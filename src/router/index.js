import Vue from 'vue'
import Router from 'vue-router'
// import HelloFromVux from '@/components/HelloFromVux'
import Home from '@/pages/Home'

import Uploader from '@/components/Uploader'
import preview from '@/pages/preview'

import FieldsList from '@/admin/FieldsList'
import AddField from '@/admin/AddField'
import EventList from '@/admin/EventList'
import MAevent from '@/admin/MAevent'
import { setUser, getUser, token } from '../config'
import { getToken, saveToken } from '../utils/token-storage'
import { getUserProfile } from '../api/api'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/events',
      name: 'events',
      component: EventList
    },
    {
      path: '/event/:id',
      name: 'event',
      component: MAevent
    },
    {
      path: '/preview',
      name: 'preview',
      component: preview
    },
    {
      path: '/up',
      name: 'Uploader',
      component: Uploader
    },
    {
      path: '/fields',
      name: 'FieldsList',
      component: FieldsList
    },
    {
      path: '/field/:id',
      name: 'field',
      component: AddField
    }
  ]
})
router.beforeEach((to, from, next) => {
  let user = getUser()
  if (!user) {
    let ltoken = getToken()
    if (!ltoken) {
      ltoken = token
      saveToken(token)
    }

    getUserProfile(
      (response) => {
        setUser(response)
        next()
        console.log(response)
      },
       (error) => {
        //  next()
         console.w(error)
       })
  } else {
    next()
  }
})
export default router
