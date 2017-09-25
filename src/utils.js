export const type = (obj) => {
    return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g,'')
}
export const isArray = (arr) => {
    return type(arr) === 'Array'
}
export const toArray = (arrLike) => {
    if(!arrLike) return
    let list = []
    for(let i = 0; i < arrLike.length; i++){
        list.push(arrLike[i])
    }
    return list
}
export const isString = (str) => {
    return type(str) === 'String'
}
export const isElementNode = (node) => {
    return node.nodeType === 1
}
export const setAttr = (node, key, value) => {
    switch(key){
        case 'style': 
            node.style.cssText = value
            break
        case 'value':
            let tagName = node.tagName || ''
            tagName = tagName.toLowerCase()
            if(tagName === 'input' || tagName === 'textarea'){
                node.value = value
            }else{
                node.setAttribute(key, value)
            }
            break
        default:
            node.setAttribute(key, value)
    }
}
export default {
    type,
    isArray,
    isString,
    isElementNode,
    setAttr,
    toArray
}