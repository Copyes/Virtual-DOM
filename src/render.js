export const renderToHtml = (json) => {
    let html = ''

    if (Array.isArray(json)){
        json.forEach((node) => {
            html += renderToHtml(node)
        })

        return html
    }

    html += createNode(json)

    return html
}
/**
 * create node
 */
const createNode = ({name, attrs, text, children}) => {
    const singleNode = ['br', 'hr', 'input', 'img', 'link', 'meta', 'area', 'base', 'col', 'command', 'embed', 'keygen', 'param', 'source', 'track', 'wbr']
    let html = `<${name}`
    let keys = Object.keys(attrs)
    // deal the attributes
    if (keys && keys.length > 0){
        keys.forEach((key) => {
            let value = attrs[key]

            if (value === '' || value === true){
                html += ` ${key}`
            } else {
                html += ` ${key}=${value}`
            }
        })
    }
    // if the node is single element
    if(singleNode.indexOf(name) > -1){
        html += ' />'
        return html
    }

    html += '>'
    
    // deal the text
    if(text){
        html += text + `</${name}>`
        return html
    }

    // deal the children elements
    if(children && children.length > 0){
        html += renderToHtml(children)
    }

    html += `</${name}>`

    return html
}