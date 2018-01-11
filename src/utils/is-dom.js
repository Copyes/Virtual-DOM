export function isNode(o) {
  return typeof Node === 'object'
    ? o instanceof Node
    : o &&
        typeof o === 'object' &&
        o.nodeType === 'number' &&
        typeof o.nodeName === 'string'
}

export function isElement() {
  typeof HTMLElement === 'object'
    ? o instanceof HTMLElement
    : o &&
      typeof o === 'object' &&
      o !== null &&
      o.nodeType === 1 &&
      typeof o.nodeName === 'string'
}
