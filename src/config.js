/* eslint-disable */
import axios from 'axios'

// const apiHost = 'http://172.2.0.225:8090/api/'
// const apiHost = 'http://192.168.1.14:8090/api/'
const apiHost = 'http://pk.moboo.ly/api/'

const api_router_config = {
  qiniu_token: apiHost + 'qiniu',
  feed: apiHost + 'feed',
  pk: apiHost + 'vote',
  post: apiHost + 'post/',

  user: apiHost + 'auth/user',

  fields: apiHost + 'fields',

  adminuser: apiHost + 'admin/user',
  adminAddField: apiHost + 'admin/fields',
  field_admins: apiHost + 'admin/fields/admins',
  field_qq_groups: apiHost + 'admin/fields/qq-groups',

  events: apiHost + 'manage/events',
  event_status: apiHost + 'manage/events/status',
  event_finish: apiHost + 'manage/events/finish',
  current_event:apiHost + 'current-event',
  user_event_list: apiHost + 'user-events',
  event_statistics:apiHost + 'event-statistics',

  sms: apiHost + 'sms'
}

export const API = api_router_config
export const DEBUG = false