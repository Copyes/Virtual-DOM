import _ from './utils'
const REPLACE = 0
const ATTRS = 1
const TEXT = 2
const REORDER = 3

const walk = (node, walker, patches) => {
    let curPatches = patches[walker.index]
    let len = node.childrenNodes ? node.childrenNodes.length : 0
    for(let i = 0; i < len; i++){
        let child = node.childrenNodes[i]
        walker.index++
        walk(child, walker, patches)
    }

    if(curPatches){
        dealPatch(node, curPatches)
    }
}

const dealPatch = (node, patches) => {
    patches.forEach(patch => {
        switch(patch.type){
            case REPLACE:
                let newNode = (typeof patch.node === 'string')
                ? document.createTextNode(patch.node)
                : patch.node.render()
                break
            case TEXT:
                if(node.textContent){
                    node.textContent = patch.content
                }else{
                    node.nodeValue = patch.nodeValue
                }
                break
            case ATTRS:
                break
            case REORDER:
                break
            default:
                throw new Error('')
        }
    })
}

export const patch = (rootNode, patches) => {
    let walker = { index: 0 }
    walk(rootNode, walker, patches)
}