
import DomComponent from './DomComponent';


// 将element变为组件并且实例化
function instantiateComponent(element) {
    var componentInstance;

    if (typeof element.type === 'function') {
        // element.type 本身就是一个复合组件
        componentInstance = new element.type(element.props);  // 得到复合组件的实例
        componentInstance._constructor(element);
    } else if (typeof element.type ==='string') {
        componentInstance = new DomComponent(element);
    } else if (typeof element === 'string' ||  typeof element === 'number') {
        componentInstance = new DomComponent({
            type: 'span',
            props: {children: element}
        });
    }
    // debugger;
    return componentInstance;
}

export default instantiateComponent;