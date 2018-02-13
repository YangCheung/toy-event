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
