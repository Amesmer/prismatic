import SimpleReact from './simpleReact';

// 可以转为element对象吗？
window.React = {};
React.createElement = SimpleReact.createElement;

class Cpp extends SimpleReact.Component {
    render() {
        return (
            <div>
                <h1>111</h1>
                <h2>2222</h2>
                <Bpp />
            </div>
        )
    }
}

// { type: Cpp }

class Bpp extends SimpleReact.Component {
    render() {
        return <h3>我是Bpp</h3>
    }
}

// { type: Bpp }


class App extends SimpleReact.Component {
    constructor() {
        super();
        // console.log(this)
        this.state = {
            count: 0
        }

        setInterval(() => {
            this.setState({  // 还会调用一次render
                count: this.state.count + 1,
            });
        }, 1000);
    }

    // componentDidMount() {

    // }

    // App本身是没有变化的，因为setState本身就是在App内部调用的，发生变化的其实是render中的内容。
    render() {
        // debugger;  // 进入断点
        // debugger
        // console.log('=====', this)
        return (
            <div>
                <h1><div>{this.state.count}</div></h1>
                <h2>我是h2<div></div></h2>
                <h3>我是h3</h3>
            </div>
        )
    }
}
// Bpp => Cpp 直接删掉 Bpp 重新渲染  新的  Cpp





// // SimpleReact.createElement('div', {id: 'app'}, 'xxxx');

// // console.log(SimpleReact.createElement('div', {id: 'app'}, 'xxxx'));

// console.log(dom);

// var elementA = SimpleReact.createElement('div', {id: 'app'}, 'xxxx');

// 注意： 使用jsx
SimpleReact.render(<App />, document.querySelector('#app'));
