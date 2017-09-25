### Introduction

If you want to know the real MVVM, you must to write it.
This is the first step that writing a htmlstring-parser to learn MVVM. 

### Content

-   [x] 1、Learning htmlparser2
-   [x] 2、Writing element selector 
-   [x] 3、Render json into html
-   [x] 4、Generate the real dom
-   [x] 5、The diff  O(n)

### Usage

>1、Generating the json, parse html to json

```js
let parser = new HtmlParser(
    `<div>
        <a data-id="11" href="#"></a>
        <img src="http://m.test.com" alt="ceshi"/>
        <p id="test" class="test1" style="width:100px;">aaaaaa</p>
        <p id="a" class="test1" style="width:100px;">aaaaaa</p>
    </div>`
)
console.log(parser.elements)
```

>2、Getting some elements

```js
console.log(parser.getElementById('test'))
console.log(parser.getElementsByClassName('test1'))
console.log(parser.getElmentsByTagName('a'))
console.log(parser.getElementsByAttributes('data-id', '11'))
console.log(parser.getRootElement())
console.log(parser.querySelector('#test'))
console.log(parser.querySelectorAll('a'))
```

>3、 Rerendering the json into html

```js
import { renderToHtml } from './render'
let html = renderToHtml(parser.elements)
document.querySelector('body').innerHTML = html
```

>4、Diff two strcture, return patches

```js
let ul = el('ul', { id: 'list' }, [
    el('li', { class: 'item' }, ['Item 1']),
    el('li', { class: 'item' }, ['Item 2'])
  ])
let ul1 = el('ul', { id: 'list1' }, [
    el('li', { class: 'item1' }, ['Item 4']),
    el('li', { class: 'item2' }, ['Item 5'])
])
let patches = diff(ul, ul1);
console.log(patches);
```
