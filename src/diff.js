import _ from './utils'
import listDiff from './list-diff'
const REPLACE = 0
const ATTRS = 1
const TEXT = 2
const REORDER = 3

const diffAttrs = (oldNode, newNode) => {
  let count = 0
  let attrsPatches = {}
  let oldAttrs = oldNode.attrs
  let newAttrs = newNode.attrs
  let oldAttrsKeys = Object.keys(oldAttrs)
  oldAttrsKeys.forEach(key => {
    let value = oldAttrs[key]
    if (newAttrs[key] !== value) {
      count++
      attrsPatches[key] = newAttrs[key]
    }
  })
  let newAttrsKeys = Object.keys(newAttrs)
  newAttrsKeys.forEach(key => {
    let value = newAttrs[key]
    if (!oldAttrs.hasOwnProperty(key)) {
      count++
      attrsPatches[key] = newAttrs[key]
    }
  })
  if (count === 0) {
    return null
  }
  return attrsPatches
}
let keyId = 0
const diffChildren = (
  oldChildren,
  newChildren,
  index,
  patches,
  currentPatch
) => {
  let diffs = listDiff(oldChildren, newChildren, 'key')
  newChildren = diffs.children

  if (diffs.moves.length) {
    let reorderPatch = { type: REORDER, moves: diffs.moves }
    currentPatch.push(reorderPatch)
  }

  let curNodeIndex = index
  oldChildren.forEach((child, i) => {
    keyId++
    let newChild = newChildren[i]
    curNodeIndex = keyId
    walk(child, newChild, curNodeIndex, patches)
  })
  //return childrenPatches
}

const walk = (oldNode, newNode, index, patches) => {
  let curPatch = []
  if (newNode === null || newNode === undefined) {
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (oldNode !== newNode) {
      curPatch.push({
        type: TEXT,
        content: newNode
      })
    }
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    let attrsPatches = diffAttrs(oldNode, newNode)
    if (attrsPatches) {
      curPatch.push({
        type: ATTRS,
        attrs: attrsPatches
      })
    }
    diffChildren(oldNode.children, newNode.children, index, patches, curPatch)
  } else {
    curPatch.push({
      type: REPLACE,
      node: newNode
    })
  }

  if (curPatch.length) {
    patches[index] = curPatch
  }
}
export const diff = (oldNodes, newNodes) => {
  let index = 0
  let patches = {}
  walk(oldNodes, newNodes, index, patches)
  return patches
}
