import axios from 'axios'
import {API, token} from '../config'
/* eslint-disable */

export function eventList (event_id, field_id, callBack, errorCallback) {
  axios.get(API.events, {
    params: {
      event_id: event_id,
      field_id: field_id,
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

export function putEvent (event, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.events,
    data: event,
    params: {
      field_id: event.field_id,
    },
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

export function deleteEvent (event, callBack, errorCallback) {
  var config = {
    method: 'post',
    url: API.events,
    data: event,
    params: {field_id: event.field_id, 'delete': true},
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
