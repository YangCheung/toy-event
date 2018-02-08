import axios from 'axios'
import {API} from '../config'
import { getToken } from '../utils/token-storage'

export function getUserProfile (callBack, errorCallback) {
  axios.get(API.user, {
    params: {
      token: getToken()
    }
  })
  .then(function (response) {
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
  .then(function (response) {
    if (callBack) callBack(response.data.result)
  })
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
