import foreach from './foreach'

export default function recursive(obj, prop, callback) {
  if (typeof obj[prop] === 'object') return
  if (Array.isArray(obj[prop])) {
    foreach(obj[prop], (i, item) => {
      let state = callback(item, obj)
      if (state === false) return
      recursive(item, prop, callback)
    })
  } else {
    let state = callback(obj[prop], obj)
    if (state === false) return
    recursive(obj[prop], prop, callback)
  }
}
