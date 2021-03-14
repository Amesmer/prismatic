
import instantiateComponent from './instantiateComponent.js';
// 复合组件
class Component {
    constructor() {

        // 方便后面使用
        this._pendingState = null;
        this._currentElement = null;
        this._renderComponent = null;
    }

    _constructor(element) {
        this._currentElement = element;
    }

    // obj
    setState(partialState) {
        // 
        this._pendingState = Object.assign({}, this.setState, partialState);

        // 更新逻辑
        this.updateComponent(this._currentElement, this._currentElement);
        
    }

    // 1.核心 element
    // 2. 新旧 element
    updateComponent(preElement, nextElement) {
        // 1. nextElement 更新当前的组件 element的引用
        this._currentElement = nextElement;

        this.props = nextElement.porps;
        this.state = this._pendingState;
        this._pendingState = null;

        // 对比 render里面的element   

        // 好好回顾
        var preRenderElement = this._renderComponent._currentElement;
        var nextRenderElement = this.render();

        // diff 算法

        // 1. 如果遇到 element类型不一样，直接删掉旧的， 然后渲染新的
        if (preRenderElement.type === nextRenderElement.type) {
            // 更新逻辑， 需要继续的进行递归，看子节点发生了哪些变化

            // 1.需要调用 updateComponent 方法形成递归
            
            this._renderComponent.updateComponent(this._renderComponent._currentElement, nextRenderElement);

        } else {
            // preRenderElement 对应的真是节点删掉  渲染 nextRenderElement 对象的dom
        }
    }

    mountComponent() {  // 返回真实dom
        // 依赖于  element  type props children
        // element从 render中来


        var renderElment = this.render();

        // 没有必要, renderElment 无法再次执行update
        // this._xxx = renderElment; 


        // 得到element之后？
         // element 转换为 真实dom
        
        // renderComponent 即可以再次调用updataComponent方法，又能拿到rederElement
        var renderComponent = instantiateComponent(renderElment);
        this._renderComponent = renderComponent;  // 更新的时候需要用到

        var renderNode = renderComponent.mountComponent();

        return renderNode;
    }
}

export default Component;