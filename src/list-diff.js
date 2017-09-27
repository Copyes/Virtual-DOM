/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function listDiff(oldList, newList, key) {
  let oldMap = getKeyIndexAndFree(oldList, key);
  let newMap = getKeyIndexAndFree(newList, key);
  // 没有key的节点
  let newFree = newMap.free;
  // 有key的新旧节点
  let oldKeyIndex = oldMap.keyIndex;
  let newKeyIndex = newMap.keyIndex;
  // 收集变动
  let moves = [];
  // a simulate list to manipulate 
  let children = [];
  let i = 0;
  let item;
  let itemKey;
  let freeIndex = 0;

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i];
    // 获取节点上的key
    itemKey = getItemKey(item, key);
    // 处理节点上有key的
    if (itemKey) {
      // 判断新的节点树是不是有当前旧节点，没有当前旧节点那么就将当前位置置为null
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null);
      } else {
          // 有当前旧节点的话就将该新节点push到构建的模拟数组中
        let newItemIndex = newKeyIndex[itemKey];
        children.push(newList[newItemIndex]);
      }
    } else {
        // 处理节点上没有key的节点
      let freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }
    i++
  }
  // 得到模拟数组
  let simulateList = children.slice(0)
  // remove items no longer exist
  i = 0
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
        // 清除模拟数组中为null的
      remove(i);
      removeSimulate(i);
    } else {
      i++;
    }
  }
  console.log(simulateList, newList)
  
  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  let j = (i = 0);
  while (i < newList.length) {
    item = newList[i];
    itemKey = getItemKey(item, key);

    let simulateItem = simulateList[j];
    let simulateItemKey = getItemKey(simulateItem, key);
    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++;
      } else {
        // if remove current simulateItem make item in right place
        // then just remove it
        let nextItemKey = getItemKey(simulateList[j + 1], key);
        if (nextItemKey === itemKey) {
          remove(i);
          removeSimulate(j);
          j++; // after removing, current j is right, just jump to next one
        } else {
          // else insert item
          insert(i, item);
        }
      }
      // new item, just inesrt it
    } else {
      insert(i, item);
    }

    i++;
  }

  //if j is not remove to the end, remove all the rest item
  let k = 0;
  while (j++ < simulateList.length) {
    remove(k + i);
    k++;
  }

  function remove(index) {
    let move = { index: index, type: 0 };
    moves.push(move);
  }

  function insert(index, item) {
    let move = { index: index, item: item, type: 1 };
    moves.push(move);
  }

  function removeSimulate(index) {
    simulateList.splice(index, 1);
  }

  return {
    moves: moves,
    children: children
  };
}

/**
   * 生成每个节点的key-value对象，如果该节点上面没有key的话那么加入free中。
   * 有的话那么就用key作为键，所在children数组的索引为值
   * @param {Array} list
   * @param {String|Function} key
   */
function getKeyIndexAndFree(list, key) {
  let keyIndex = {};
  let free = [];
  for (let i = 0, len = list.length; i < len; i++) {
    let item = list[i];
    let itemKey = getItemKey(item, key);
    if (itemKey) {
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  };
}

function getItemKey(item, key) {
  if (!item || !key) return void 0;
  return typeof key === "string" ? item[key] : key(item);
}

export default listDiff;
