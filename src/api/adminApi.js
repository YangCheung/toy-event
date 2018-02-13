import axios from 'axios'
import { API } from '../config'
import { getToken } from '../utils/token-storage'

export function adminFieldList (id, callBack, errorCallback) {
  axios.get(API.fields, {
    params: {
      id: id,
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

export function adminGetUser (qq, userPhone, callBack, errorCallback) {
  axios.get(API.adminuser, {
    params: {
      qq: qq,
      phone: userPhone,
      token: getToken()
    }
  })
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}

export function adminAddField (field, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.adminAddField,
    data: field,
    headers: {
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
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
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}

export function deleteFieldAdmin (fieldId, adminId, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.field_admins,
    data: {field_id: fieldId, adminId: adminId},
    params: {'delete': true},
    headers: {
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}

export function addFieldAdmin (fieldId, adminId, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.field_admins,
    data: {field_id: fieldId, adminId: adminId},
    headers: {
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}

export function deleteFieldQQGroup (fieldId, qq, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.field_qq_groups,
    data: {field_id: fieldId, qq_group: qq},
    params: {'delete': true},
    headers: {
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}

export function addFieldQQGroup (fieldId, qq, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.field_qq_groups,
    data: {field_id: fieldId, qq_group: qq},
    headers: {
      'token': getToken()
    }
  }
  axios(config)
  .then(function (response) {
    if (callBack) callBack(response.data.result)
    console.log(response)
  })
  .catch(function (error) {
    if (errorCallback) errorCallback(error)
    console.log(error)
  })
}
