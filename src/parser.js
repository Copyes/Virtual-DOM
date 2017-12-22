import { Parser } from 'htmlparser2'
import { renderToHtml } from './render'
import { diff } from './diff'
import _, { hashCode } from './utils'

export default class HtmlParser {
  constructor(html) {
    let self = this
    let nodes = []
    let depth = []

    let parser = new Parser(
      {
        onopentag(name, attrs) {
          let node = {
            name,
            attrs,
            children: [],
            parent: null,
            events: {}
          }
          let parent = depth.length ? depth[depth.length - 1] : null

          if (parent) {
            node.parent = parent
            if (!parent.hasOwnProperty('children')) {
              parent.children = []
            }
            parent.children.push(node)
          }
          nodes.push(node)
          depth.push(node)
        },
        onclosetag(name) {
          depth.pop()
        },
        ontext(text) {
          if (!text.trim()) {
            return
          }
          let parent = depth.length ? depth[depth.length - 1] : null
          let node = {
            text: text.replace(/\s+/g, ''),
            parent
          }
          if (parent) {
            node.parent = parent
            parent.children.push(node)
          }
          nodes.push(node)
        }
      },
      {
        recognizeSelfClosing: true,
        lowerCaseTags: false,
        lowerCaseAttributeNames: false
      }
    )

    parser.parseChunk(html)
    parser.done()

    nodes.forEach(node => {
      let hashStr = ''
      if (node.key) {
        hashStr = node.key
      } else if (node.text !== undefined) {
        hashStr = '[[text hash code]]'
      } else {
        hashStr += node.name + ':'
        hashStr += JSON.stringify(node.attrs)
      }
      node._hash = _.hashCode(hashStr)
    })

    this.nodes = nodes.filter(node => !node.parent)
  }

  //   static get VNodePrototype() {
  //     let self = this
  //     return {
  //       parent: null,
  //       children: [],
  //       text: null,
  //       getElements() {
  //         let elements = []
  //         this.children.forEach(item => {
  //           elements.push(item)
  //           if (item.children.length) {
  //             elements = elements.concat(this.getElements(item))
  //           }
  //         })
  //         return elements
  //       },
  //       getElementById() {
  //         return self.getElementById.call(this, selector)
  //       },
  //       getElmentsByTagName() {
  //         return self.getElmentsByTagName.call(this, selector)
  //       },
  //       getElementsByClassName() {
  //         return self.getElementsByClassName.call(this, selector)
  //       },
  //       getElementsByAttributes(attrName, attrValue) {
  //         return self.getElementsByAttributes.call(this, attrName, attrValue)
  //       },
  //       querySelector() {
  //         return self.querySelector.call(this, selector)
  //       },
  //       querySelectorAll(selector) {
  //         return self.querySelectorAll.call(this, selector)
  //       }
  //     }
  //   }
  //   createVNode(name, attrs) {
  //     let nodeObj = Object.create(HtmlParser.VNodePrototype)
  //     nodeObj.name = name
  //     nodeObj.id = attrs.id
  //     nodeObj.class = attrs.class ? attrs.class.split(' ') : []
  //     nodeObj.attrs = attrs
  //     return nodeObj
  //   }
  //   getRootElement() {
  //     return this.elements.filter(item => !item.parent)
  //   }
  //   getElements() {
  //     return this.elements
  //   }
  //   getElementById(id) {
  //     let elements = this.getElements().filter(item => item.id === id)
  //     if (elements.length) {
  //       return elements[0]
  //     }
  //     return null
  //   }
  //   getElmentsByTagName(tagName) {
  //     return this.getElements().filter(item => item.name === tagName)
  //   }
  //   getElementsByClassName(className) {
  //     return this.getElements().filter(item => item.class.indexOf(className) > -1)
  //   }
  //   getElementsByAttributes(attrName, attrValue) {
  //     return this.getElements().filter(
  //       item => item.attrs[attrName] && item.attrs[attrName] === attrValue
  //     )
  //   }
  //   querySelectorAll(selector) {
  //     let type = selector.substring(0, 1)
  //     let typeValue = selector.substring(1)
  //     switch (type) {
  //       case '#':
  //         return this.getElements().filter(item => item.id === typeValue)
  //         break
  //       case '.':
  //         return this.getElementsByClassName(typeValue)
  //         break
  //       case '[':
  //         let formatte = typeValue.substring(0, typeValue.length - 1)
  //         let [attrName, attrValue] = formatte.split('=')
  //         return this.getElementsByAttributes(attrName, attrValue)
  //         break
  //       default:
  //         return this.getElmentsByTagName(selector)
  //     }
  //   }
  //   querySelector(selector) {
  //     let result = this.querySelectorAll(selector)
  //     if (result) {
  //       return result[0]
  //     }
  //   }
}

let parser = new HtmlParser(`
<div>
aaaaaa
<div>
    <div class="a"></div>
</div>
<p id="test" class="test1" style="width:100px;">aaaaaa</p>
<p id="a" class="test1" style="width:100px;">aaaaaa</p>
</div>
<div>2222</div>`)
// let parser2 = new HtmlParser(`
// <div>
// <p id="a" class="test1" style="width:100px;">aaaaaa</p>
// <p id="test" class="test1" style="width:100px;">aaaaaa</p>
// <a>333</a>
// </div>`)
console.log(parser.nodes)
// console.log(parser2.elements)
// console.log(diff(parser.elements, parser2.elements))
// console.log(parser.getElementById('test'))
// console.log(parser.getElementsByClassName('test1'))
// console.log(parser.getElmentsByTagName('a'))
// console.log(parser.getElementsByAttributes('data-id', '11'))
// console.log(parser.getRootElement())
// console.log(parser.querySelector('#test'))
// console.log(parser.querySelectorAll('a'))
// render json into html
// let html = renderToHtml(parser.elements)
// document.querySelector('body').innerHTML = html
