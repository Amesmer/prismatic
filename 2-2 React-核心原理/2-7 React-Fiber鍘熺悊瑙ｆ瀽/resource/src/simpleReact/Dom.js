function appendChildren(node, children) {  // 多节点和单节点的兼容
    if (Array.isArray(children)) {
        children.forEach((child) => node.appendChild(child))
    } else {
        node.appendChild(children);
    }
}

function empty(node) {
    [].slice.call(node.childNodes).forEach((child) => {
        node.removeChild(child);
    });
}


export default {
    appendChildren,
    empty
}