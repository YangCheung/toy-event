export function requestFullScreen (document) {
  if (document.requestFullScreen) {
    document.requestFullScreen()
  } else if (document.mozRequestFullScreen) {
    document.mozRequestFullScreen()
  } else if (document.webkitRequestFullScreen) {
    document.webkitRequestFullScreen()
  }
}
