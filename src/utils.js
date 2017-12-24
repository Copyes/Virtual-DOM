export const type = obj => {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
}
export const isArray = arr => {
  return type(arr) === 'Array'
}
export const toArray = arrLike => {
  if (!arrLike) return
  let list = []
  for (let i = 0; i < arrLike.length; i++) {
    list.push(arrLike[i])
  }
  return list
}
export const isString = str => {
  return type(str) === 'String'
}
export const isElementNode = node => {
  return node.nodeType === 1
}
export const setAttr = (node, key, value) => {
  switch (key) {
    case 'style':
      node.style.cssText = value
      break
    case 'value':
      let tagName = node.tagName || ''
      tagName = tagName.toLowerCase()
      if (tagName === 'input' || tagName === 'textarea') {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    default:
      node.setAttribute(key, value)
  }
}
export const foreach = (obj, cb) => {
  if (typeof obj !== 'object') {
    return
  }
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; ++i) {
      let value = obj[i]
      let state = cb(i, value, obj)
      if (!state) {
        break
      }
    }
  } else {
    let keys = Object.keys(obj)
    for (let i = 0, l = keys.length; i < l; ++i) {
      let value = obj[keys[i]]
      let state = cb(i, value, obj)
      if (!state) {
        break
      }
    }
  }
}
export const hashCode = str => {
  var hash = 5381,
    i = str.length

  while (i) {
    hash = (hash * 33) ^ str.charCodeAt(--i)
  }

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
      * integers. Since we want the results to be always positive, convert the
      * signed int to an unsigned by doing an unsigned bitshift. */
  return hash >>> 0
}
export default {
  type,
  isArray,
  isString,
  isElementNode,
  setAttr,
  toArray,
  foreach,
  hashCode
}
