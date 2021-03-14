import React from 'react';  // 其实加载的anujs
import './App.css';
// import './test.js';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      count: 1
    }
  }

  click() {
    debugger;
    this.setState({
      count: 2
    });
    // this.setState({
    //   count: 3
    // })
    // this.setState({
    //   count: 4
    // })
    // this.setState({
    //   count: 5
    // })
  }

  // 1. fiber如何渲染的
  // 2. 点击事件是如何触发的
  // 3. fiber如何进行更新的
  // 目标： 理解fiber的思想
  render() {
    // debugger;
    return (
      <div className="App">
        <h1 className="h1-class">{this.state.count}</h1>
        <h2 className="h2-class" onClick={() => {
          this.click();
        }}>
          点我点我！
        </h2>
      </div>
    );
  }
}

export default App;
