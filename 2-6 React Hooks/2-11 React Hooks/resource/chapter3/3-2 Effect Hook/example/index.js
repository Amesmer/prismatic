import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('my text');
 
  useEffect(() => {
    // useEffect 是异步的，将在每一轮渲染结束后执行
    // console.log('exec');
    // useEffect 每次更新的时候，都会先执行一遍卸载函数（effect 的返回函数）
    // const a = await 10;
    document.title = `You clicked ${count} times`;
  }, []);

  // 可以通过设置第二参数来优化性能
  // 通过设置第二参数为空数组，则只会在组件第一次加载以及最后一次卸载执行
  useEffect(() => {
    console.log('update');
    const timer = setInterval(() => { console.log('timer') }, 1000);
    return () => {
      console.log('unmount');
      clearInterval(timer);
    }
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

render(
    <App />,
  document.getElementById('root')
)