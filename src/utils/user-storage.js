
let localUser = null

export function saveUserInfo (userInfo) {
  localUser = userInfo
  // const localStorage = window.localStorage
  // try {
  //   localStorage.setItem('userInfo', JSON.stringify(userInfo))
  //   logger('localStorage-save-userInfo', 'userInfo save in localStorage succeed')
  // } catch (error) {
  //   logger('localStorage-save-userInfo', error)
  // }
}

export const clearUserInfo = () => {
  localUser = null
  // const localStorage = window.localStorage
  // try {
  //   if (!localStorage.getItem('userInfo')) {
  //     localStorage.removeItem('userInfo')
  //     logger('localStorage-clear-userInfo', 'userInfo clear')
  //   }
  // } catch (error) {
  //   logger('localStorage-clear-userInfo', error)
  // }
}

export const getUser = () => {
  // if (localUser) {
  return localUser
  // }
  // const localStorage = window.localStorage
  // try {
  //   let userInfo = localStorage.getItem('userInfo')
  //   if (userInfo) {
  //     userInfo = JSON.parse(userInfo)
  //     if (userInfo) {
  //       localUser = userInfo
  //       return localUser
  //     }
  //   }
  //   return userInfo
  // } catch (error) {
  //   logger('localStorage-get-userInfo', error)
  //   return null
  // }
}
