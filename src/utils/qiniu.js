let counter = 0

function guid (prefix) {
  let guid = new Date().getTime().toString(32)
  let i

  for (i = 0; i < 5; i++) {
    guid += Math.floor(Math.random() * 65535).toString(32)
  }

  return (prefix || 'o_') + guid + (counter++).toString(32)
}

function getFileExtension (filename) {
  var tempArr = filename.split('.')
  var ext
  if (tempArr.length === 1 || (tempArr[0] === '' && tempArr.length === 2)) {
    ext = ''
  } else {
    ext = tempArr.pop().toLowerCase()
  }
  return ext
};

function getMimeType (type) {
  var tempArr = type.split('/')
  var ext
  if (tempArr.length === 2) {
    ext = tempArr[0]
  } else {
    ext = ''
  }
  return ext
};

function getFileKey (filename) {
  let ext = getFileExtension(filename)
  return guid(ext) + '.' + ext
}

export { getMimeType, guid, getFileExtension, getFileKey }
