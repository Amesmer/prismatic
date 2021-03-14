import instantiateComponent from './instantiateComponent.js';

// 1. element 2. node
// 把dom渲染进  node
function render(element, node) {

    // element 最终会转换成真实的节点
    // 转换过程
    // component componentDidMount  返回一个真实的节点 

    // element => component => componentDidMount

    // 将element生成一个组件类，然后实例化这个组件，调用didMount方法，得到一个真实节点
    // debugger;
    var component = instantiateComponent(element);
    var renderDom = component.mountComponent();

    // var dom = document.createElement('div')
    node.append(renderDom);
}

export default {
    render
}