/* eslint-disable */
import axios from 'axios'

const apiHost = 'http://172.2.0.225:8090/'
const api_router_config = {
  qiniu_token: apiHost + 'qiniu',
  feed: apiHost + 'feed',
  post: apiHost + 'post/',

  user: apiHost + 'auth/user',

  fields: apiHost + 'admin/fields',

  adminuser: apiHost + 'admin/user',
  adminAddField: apiHost + 'admin/fields',


  events: apiHost + 'manage/events',

}

let guser 
export function setUser(user) {
  guser = user
}

export function getUser() {
  return guser
}

export const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MjY1MjY2OTQsImlhdCI6MTUxNzg4NjY5NCwic3ViIjoxfQ.qTEChgPYP3q-YXhJ5WVA4pFiYK8heuP5DyYT1uTe1NU'
export const API = api_router_config
export const DEBUG = false
export let gUser = {}