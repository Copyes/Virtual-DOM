export default function foreach(objs, callback) {
  if (typeof objs !== 'object') return

  if (Array.isArray(objs)) {
    for (let i = 0, l = objs.length; i < l; ++i) {
      let value = objs[i]
      let state = callback(i, value, objs)
      if (state === false) break
    }
  } else {
    let keys = Object.keys(objs)
    for (let i = 0, l = keys.length; i < l; ++i) {
      let value = objs[keys[i]]
      let state = callback(keys[i], value, objs)
      if (state === false) break
    }
  }
}
