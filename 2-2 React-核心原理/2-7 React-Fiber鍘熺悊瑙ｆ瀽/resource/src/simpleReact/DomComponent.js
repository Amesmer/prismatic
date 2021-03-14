
import DOM from './Dom.js';
import instantiateComponent from './instantiateComponent';



// 旧的
// class App extends SimpleReact.Component {
//     render() {
//         return (
//             <div>
//                 <h1>111</h1>
//                 <h2>2222</h2>
//                 <Cpp />
//                 {this.state.count}
//             </div>
//         )
//     }
// }

// 复合组件

// App 的第一次update一定会 对比 2 个render的element
// 第二次 update 将会在DomComponent触发  diff

// {
//     type: 'div',
//     props: {
//         children: [] // 对比children数组中的elemment对象
//     }
// }
// class App extends SimpleReact.Component {

//     render() {
//         return (
//             <div>
//                 <h1>00000000000</h1>
//                 <h2>2222</h2>
//                 <Cpp />
//                 {this.state.count}
//             </div>
//         )
//     }
// }


class DomComponent {
    constructor(element) {
        // super();
        this._currentElement = element;
        this._domNode = null;
    }

    mountComponent() {
        // :dom
        // 通过 element 去创建dom
        var node = document.createElement(this._currentElement.type);
        this._domNode = node;
        // 需要一个方法去专门处理子节点
        // const children = 
        // this._renderComponents = 

        // 在mount的过程中可以去将子节点的instance存储起来

        this._renderDomChildren(this._currentElement.props);  // element对象

        return node;
    }

    updateComponent(preElement, nextElement) {
        this._currentElement = nextElement;
        
        // 遍历   子节点数组  然后进行前后对比
        this._updateChildren(preElement.props, nextElement.props);
    }

    _updateChildren(prevProps, nextProps) {
        // porps.children 3    字符串,数字 对象， 数组
        var prevType = typeof prevProps.children;
        var nextType = typeof nextProps.children;
        // debugger;
        if (nextType === 'undefined') {
            // debugger;
            return;
        }
        // debugger;
        // 清空父亲节点
        DOM.empty(this._domNode);

        if (nextType === 'string' || nextType === 'number') {
            // 直接修改真实节点
            // debugger;
            this._domNode.textContent = nextProps.children;
        } else {
            // 如果 div里面嵌套了其它的节点，而不是数字或者字符串
            
            // 1. this._domNode 中插入更新之后的节点，比如： h1
            // 2. 计算出真实的子节点，通过element对象转换过来
            // 3. 可以从 nextProps.children中得到子节点的element对象
            if (Array.isArray(nextProps.children)) {
                const childElements = nextProps.children;
                const chidNodes = childElements.map((childElement) => {
                    return instantiateComponent(childElement).mountComponent();
                });
                DOM.appendChildren(this._domNode, chidNodes);
            } else {
                // 单个节点
                var childElement = nextProps.children;
                //  实例化， 

                // 如何 通过 element对象 去调用update方法

                // 结论： 不可以 直接调用实例化的 updateComponent方法
                // 1. 每次update都需要通过element进行实例化，这是不现实的，影响性能
                // 2. 如果直接实例化  只有新的状态，没有旧的，无法对比。
                var chidNode = instantiateComponent(childElement).mountComponent();
                DOM.appendChildren(this._domNode, chidNode);
            }
            // ** 需要处理child是数组的情况
        }
    }

    _renderDomChildren(props) {  // 递归
        // 获取 子节点信息 
        console.log('_renderDomChildren', props)
        // children
        // 1. string 或者 数字类型 2. 数组
        if (typeof props.children === 'string' || typeof props.children === 'number') {
            var textNode = document.createTextNode(props.children);
            // 如何插入 h1
            this._domNode.appendChild(textNode);
        } else if (props.children) {  // 小技巧
            // 1. 数组 2. 对象  [{type: 'div'}]
            var childrenNodes;   // 转换成真实dom

            if (Array.isArray(props.children)) {  //多个节点
                childrenNodes = props.children.map((el) => {  // element  => dom
                    // 
                    return instantiateComponent(el).mountComponent();
                });// [dom, dom]

            } else {  // 单个节点  element对象 
                childrenNodes = instantiateComponent(props.children).mountComponent();
            }
            DOM.appendChildren(this._domNode, childrenNodes);
        }
    }
}

export default DomComponent;