import { el } from './element'
import { diff } from './diff2'

let ul = el('ul', { id: 'list' }, [
  el('li', { key: 1 }, ['Item 1']),
  el('li', {}, ['Item']),
  el('li', { key: 2 }, ['Item 2']),
  el('li', { key: 3 }, ['Item 3'])
])
let ul1 = el('ul', { id: 'list1' }, [
  el('li', { key: 3 }, ['Item 3']),
  el('li', { key: 1 }, ['Item 1']),
  el('li', {}, ['Item']),
  el('li', { key: 4 }, ['Item 4']),
  el('a', { class: 'item2', href: '#' }, ['Item 6'])
])
let patches = diff(ul.children, ul1.children)
console.log(patches)
// let ulRoot = ul.render()
// document.body.appendChild(ulRoot)
