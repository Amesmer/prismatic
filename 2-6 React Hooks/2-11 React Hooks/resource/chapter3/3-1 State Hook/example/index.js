import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'

function App() {
  // 声明的名称叫做 xxx, 那么必定会有一个值叫做 setXxx()
  // 初始值只有在第一加载时起作用，在后续的渲染中，useState 返回的值始终是更新后最新的 state
  // const [count, setCount] = useState(0);
  const [count, setCount] = useState(() => { return 1 + 1 });
 
  // if (count < 3) {
  //   const [text, setText] = useState('my text');
  // }

  // // useState 必须在函数组件的最外层使用，不可以加任何的条件或者嵌套内
  // const [xxx, setXxx] = useState('xxx');
  console.log('exec');

  // react 使用了 object.is 来比较 state, 如果  state 没有变化，则不会触发组件更新
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      <button onClick={() => setCount(2)}>
        Click me 2
      </button>
    </div>
  );
}

render(
    <App />,
  document.getElementById('root')
)