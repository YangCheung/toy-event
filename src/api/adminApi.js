import axios from 'axios'
import {API, token} from '../config'

export function adminFieldList (id, callBack, errorCallback) {
  axios.get(API.fields, {
    params: {
      id: id,
      token: token
    }
  })
  .then(function (response) {
    if (callBack) callBack(response.data.result)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
  })
}

export function adminGetUser (qq, userPhone, callBack, errorCallback) {
  axios.get(API.adminuser, {
    params: {
      qq: qq,
      phone: userPhone,
      token: token
    }
  })
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}

export function adminAddField (field, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.adminAddField,
    data: field,
    headers: {
      'token': token
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}

export function adminDeleteField (field, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.adminAddField,
    data: field,
    params: {'delete': true},
    headers: {
      'token': token
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}
