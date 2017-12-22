import { el } from './element'

const move = (list, from, to) => {
  var item = list.splice(from, 1)
  if (from > to) list.splice(to, 0, item[0])
  else list.splice(to - 1, 0, item[0])
}
const getUniqueKey = () => {}

export const diff = (oldList, newList) => {
  console.log(oldList, newList)
  var changes = []
  // 镜像，模拟位置
  var _oldList = oldList.slice(0)
  // 遍历旧的，找出 删
  oldList.forEach(function(item, i) {
    if (newList.indexOf(item) === -1) {
      changes.push({
        type: 'remove',
        index: i
      })
      _oldList.splice(i, 1)
    }
  })

  // 遍历新的，找出 增/移
  newList.forEach(function(item, i) {
    var index = _oldList.indexOf(item)
    if (index === -1) {
      // 增
      changes.push({
        type: 'insert',
        index: i,
        item: item
      })
      _oldList.splice(i, 0, item)
    } else {
      // 位置是否一样
      if (index === i) {
        // 检查要不要改
        changes.push({
          type: 'check',
          index: i
        })
      } else {
        // 移
        var step = {
          type: 'move',
          from: index,
          to: i
        }
        changes.push(step)
        move(_oldList, step.from, step.to)
      }
    }
  })

  return changes
}

// test
var showSteps = function(changes) {
  changes.forEach(function(change) {
    switch (change.type) {
      case 'insert':
        console.log(
          'insert ' + change.item + ' before ' + oldList[change.index]
        )
        oldList.splice(change.index, 0, change.item)
        break
      case 'remove':
        console.log('remove ' + oldList[change.index])
        oldList.splice(change.index, 1)
        break
      case 'check':
        console.log('check ' + oldList[change.index] + ' for update')
        break
      case 'move':
        console.log(
          'move ' + oldList[change.from] + ' to ' + oldList[change.to]
        )
        move(oldList, change.from, change.to)
        break
      default:
        cosole.error('not here')
        break
    }
  })
  if (JSON.stringify(oldList) === JSON.stringify(newList)) console.info(oldList)
  else console.error('diff出错')
}
