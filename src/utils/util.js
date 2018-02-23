export function requestFullScreen (document) {
  if (document.requestFullScreen) {
    document.requestFullScreen()
  } else if (document.mozRequestFullScreen) {
    document.mozRequestFullScreen()
  } else if (document.webkitRequestFullScreen) {
    document.webkitRequestFullScreen()
  }
}

export function isiOS (document) {
  var u = navigator.userAgent
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
}

export function hasDuplicates (array) {
  var valuesSoFar = []
  for (var i = 0; i < array.length; ++i) {
    var value = array[i]
    if (valuesSoFar.indexOf(value) !== -1) {
      return true
    }
    valuesSoFar.push(value)
  }
  return false
}
