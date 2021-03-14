
// 入口文件

import element from './element';
import mount from './mount';
import Component from './Component';
console.log(element)
export default {
    createElement: element.createElement,
    render: mount.render,
    Component: Component
}