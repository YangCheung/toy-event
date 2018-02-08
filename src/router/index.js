import Vue from 'vue'
import Router from 'vue-router'
// import HelloFromVux from '@/components/HelloFromVux'
import Home from '@/pages/Home'

import Uploader from '@/components/Uploader'
import preview from '@/pages/preview'
import Login from '@/pages/Login'
import EditProfile from '@/pages/user/EditProfile'
import CurrentEvent from '@/pages/CurrentEvent'

import FieldsList from '@/admin/FieldsList'
import FieldAdmins from '@/admin/fields/FieldAdmins'
import FieldQQGroups from '@/admin/fields/FieldQQGroups'

import AddField from '@/admin/AddField'
import EventList from '@/admin/EventList'
import MAevent from '@/admin/MAevent'
import { setUser, getUser } from '../config'
import { getToken } from '../utils/token-storage'
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
      path: '/login',
      name: 'login',
      meta: {
        NoAuth: true
      },
      component: Login
    },
    {
      path: '/edituser',
      name: 'edituser',
      component: EditProfile
    },
    {
      path: '/current-event',
      name: 'current-event',
      component: CurrentEvent
    },
    {
      path: '/fields/:fieldid/events',
      name: 'eventslist',
      component: EventList
    },
    {
      path: '/fields/:fieldid/events/:id',
      name: 'mevent',
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
      path: '/fields/:id',
      name: 'mfield',
      component: AddField
    },
    {
      path: '/fields/:id/admins',
      name: 'field-admins',
      component: FieldAdmins
    },
    {
      path: '/fields/:id/qq-groups',
      name: 'field-qq-groups',
      component: FieldQQGroups
    }
  ]
})

function checkUserInfo (user, next, to) {
  if (user.fields.length > 0) {
    next()
    return
  }
  if (user.admin) {
    next()
    return
  }

  if (!user.qq && to.name !== 'edituser') {
    next({
      path: '/edituser'
    })
  }
  next()
}

router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.meta.NoAuth) {
    next()
    return
  }

  let user = getUser()
  if (!user) {
    let ltoken = getToken()
    if (!ltoken) {
      next({path: '/login'})
      return
    }

    getUserProfile(
      (response) => {
        setUser(response)
        checkUserInfo(response, next, to)
        console.log(response)
      },
       (error) => {
         next({path: '/login'})
         console.log(error)
       })
    return
  }

  checkUserInfo(user, next, to)
})

export default router
