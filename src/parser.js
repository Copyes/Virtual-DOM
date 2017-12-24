import { Parser } from 'htmlparser2'
import { renderToHtml } from './render'
import diff from './diff-hash.js'
import _, { hashCode } from './utils'
export default function HtmlParser(html) {
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
    // if there is a `key` attribute for current node, use this key for hash code
    if (node.key) {
      hashStr = node.key
    } else if (node.text !== undefined) {
      // text node are same node type, so they use same node hash code
      hashStr = '[[text node]]'
    } else {
      // normal tag nodes, use tag name and attributes for hash code
      hashStr += node.name + ':'
      hashStr += JSON.stringify(node.attrs)
    }
    node._hash = _.hashCode(hashStr)
  })

  let tree = nodes.filter(node => !node.parent)

  // create vtree
  let vtree = vnodes.filter(item => !item.parent)

  return {
    vtree
  }
}

let parser = HtmlParser(`
<div>
aaaaaa
<div>
    <div class="a"></div>
</div>
<p id="test" class="test1" style="width:100px;">bbbbbb</p>
<p id="a" class="test1" style="width:100px;">aaaaaa</p>
</div>`)
let parser2 = HtmlParser(`
<div>
<p id="a" class="test1" style="width:100px;">ccccc</p>
<p id="test" class="test1" style="width:100px;">aaaaaa</p>
<a>333</a>
</div>`)
// console.log(parser.nodes)
// console.log(parser2.nodes)
console.log(parser.vnodes)
console.log(diff(parser.vtree, parser2.vtree))
// patch()
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
