import axios from 'axios'
import {API, token} from '../config'

export function getUserProfile (callBack, errorCallback) {
  axios.get(API.user, {
    params: {
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
