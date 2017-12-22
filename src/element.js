import _ from './utils'

class Element {
  constructor(tagName, attrs, children) {
    if (_.isArray(attrs)) {
      children = attrs
      attrs = {}
    }

    this.tagName = tagName
    this.attrs = attrs
    this.children = children

    this.key = attrs ? attrs.key : void 0
  }

  render() {
    let node = document.createElement(this.tagName)
    let attrs = this.attrs

    let keys = Object.keys(this.attrs)
    let l = keys.length
    for (let i = 0; i < l; i++) {
      let attrValue = attrs[keys[i]]
      _.setAttr(node, keys[i], attrValue)
    }

    let children = this.children || []
    children.forEach(child => {
      let childNode =
        child instanceof Element
          ? child.render()
          : document.createTextNode(child)
      node.appendChild(childNode)
    }, this)

    return node
  }
}

export const el = (tagName, attrs, children) => {
  return new Element(tagName, attrs, children)
}
