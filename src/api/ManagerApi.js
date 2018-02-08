import axios from 'axios'
import { API } from '../config'
import { getToken } from '../utils/token-storage'

/* eslint-disable */

export function eventList (event_id, field_id, callBack, errorCallback) {
  axios.get(API.events, {
    params: {
      event_id: event_id,
      field_id: field_id,
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

export function putEvent (event, field_id, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.events,
    data: event,
    params: {
      field_id: field_id,
    },
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
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}

export function deleteEvent (event, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.events,
    data: event,
    params: {field_id: event.field_id, 'delete': true},
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
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}

export function activateEvent (event, callBack, errorCallback) {
  console.log(event)
  var config = {
    method: 'post',
    url: API.event_status,
    data: event,
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
    if (errorCallback) errorCallback(errorCallback)
    console.log(error)
  })
}