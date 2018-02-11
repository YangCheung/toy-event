import axios from 'axios'
import {API} from '../config'
import { getToken } from '../utils/token-storage'
import { getUser, saveUserInfo } from '../utils/user-storage'

export function getUserProfile (callBack, errorCallback) {
  let token = getToken()
  if (!token) {
    if (errorCallback) errorCallback()
    return
  }
  let user = getUser()
  if (user && callBack) {
    callBack(user)
    return
  }
  axios.get(API.user, {
    params: {
      token: getToken()
    }
  })
  .then(function (response) {
    saveUserInfo(response)
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function getCurrentEvent (callBack, errorCallback) {
  axios.get(API.current_event, {
    params: {
      token: getToken()
    }
  })
  .then(
    (response) => { if (callBack) callBack(response.data.result) })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function editUserProfile (user, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.user,
    data: user,
    headers: {
      'token': getToken()
    }
  }
  axios(config).then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function sendSmsCode (phone, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.sms,
    data: {phone: phone}
  }
  axios(config).then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function verifyCode (phone, code, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.sms,
    data: { phone: phone, code: code }
  }
  axios(config).then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function sendPost (feed, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.feed,
    data: feed,
    headers: {
      'token': getToken()
    }
  }
  axios(config).then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function getPostByEvent (eventId, callBack, errorCallback) {
  var config = {
    method: 'get',
    url: API.feed,
    params: { event_id: eventId },
    headers: {
      'token': getToken()
    }
  }
  axios(config).then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}
