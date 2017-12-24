import { foreach } from './utils'
import { patch } from './patch'

export default function diff(oldTree, newTree, parentVNode) {
  let oldHashes = oldTree.map(vnode => vnode._hash)
  let newHashes = newTree.map(vnode => vnode._hash)
  console.log(oldHashes, newHashes, 1111)
  // to collect the patch
  let patches = []
  let recordHashes = []
  let recordNodes = []
  oldHashes.forEach((hash, i) => {
    let oldNode = oldTree[i]
    // if new hashes dont include the current hash, the old hashes must be removed
    if (newHashes.indexOf(hash) === -1) {
      patches.push({ type: 'remove', parent: parentVNode, vnode: oldNode })
    } else {
      recordHashes.push(hash)
      recordNodes.push(oldNode)
    }
  })

  let cursor = 0
  console.log(recordHashes, 2222)
  console.log(newHashes, 2222)

  newHashes.forEach((hash, i) => {
    let newNode = newTree[i]

    // all nodes are new
    if (oldHashes.length === 0) {
      patches.push({ type: 'append', parent: parentVNode, vnode: newNode })
      return
    }

    cursor = i
    let cursorHash = recordHashes[cursor]
    let cursorNode = recordNodes[cursor]

    let position = findHashIndex(hash, recordHashes, cursor)
    // diff the same level node
    if (hash === cursorHash) {
      patches = patches.concat(
        diffSameLevelNode(cursorNode, newNode, parentVNode)
      )
    } else if (position !== -1) {
      let oldNode = recordNodes[position]
      let oldHash = recordHashes[position]

      patches.push({
        type: 'move',
        parent: parentVNode,
        vnode: oldNode,
        target: cursorNode
      })
      //move oldNode in the recordNodes.
      //we should delete the node and insert it in the right position
      recordNodes.splice(position, 1)
      recordNodes.splice(cursor, 0, oldNode)

      recordHashes.splice(position, 1)
      recordHashes.splice(cursor, 0, oldHash)
    } else if (cursor < recordHashes.length) {
      patches.push({
        type: 'insert',
        parent: parentVNode,
        vnode: newNode,
        target: cursorNode
      })

      // not exists in the recordNodes and the cursor is not equal to recordHashes's length .
      // it means insert the node
      recordHashes.splice(cursor, 0, newNode)
      recordHashes.splice(cursor, 0, hash)
    } else {
      // not exists in the recordNodes
      patches.push({ type: 'append', parent: parentVNode, vnode: newNode })
      recordHashes.push(hash)
      recordNodes.push(newNode)
    }
  })

  for (let i = cursor + 1; i < recordNodes.length; ++i) {
    let oldNode = recordHashes[i]
    patches.push({ type: 'remove', parent: parentVNode, vnode: oldNode })
  }
  return patches
}

const diffSameLevelNode = (oldNode, newNode, parentVNode) => {
  let patches = []
  if (oldNode.text && newNode.text && oldNode.text !== newNode.text) {
    patches.push({
      type: 'changeText',
      parent: parentVNode,
      vnode: oldNode,
      text: newNode.text
    })
  }
  let attrsPatches = diffNodeAttrs(oldNode, newNode)
  if (attrsPatches.length) {
    patches.push({
      type: 'changeAttr',
      parent: parentVNode,
      vnode: oldNode,
      attrs: attrsPatches
    })
  }
  let oldChildren = oldNode.children || []
  let newChildren = newNode.children || []
  patches = patches.concat(diff(oldChildren, newChildren, oldNode))

  return patches
}
// compared the node attributions
const diffNodeAttrs = (oldNode, newNode) => {
  let patches = []
  let oldAttrs = oldNode.attrs
  let newAttrs = newNode.attrs

  foreach(newAttrs, key => {
    let newVal = newAttrs[key]
    let oldVal = oldAttrs[key]
    if (oldVal !== newVal) {
      patches.push({ key, value: newVal })
    }
  })
  return patches
}
// find the position in the hashes
const findHashIndex = (hash, hashes, cursor) => {
  for (let i = cursor, l = hashes.length; i < l; ++i) {
    if (hash === hashes[i]) {
      return i
    }
  }
  return -1
}
