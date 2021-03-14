import React, { useState } from 'react'

function Counter5(props){
  // 这个函数只在初始渲染时执行一次，后续更新状态重新渲染组件时，该函数就不会再被调用
  function getInitState(){
    debugger
      return {number:props.number};
  }
  let [counter,setCounter] = useState(getInitState);
  let a = counter
  return (
      <>
         <p>{counter.number}</p>
         <button onClick={()=>{ 
           a.number = counter.number+1
           setCounter({ number: counter.number+1 })
          }}>+</button>
         <button onClick={()=>setCounter(counter)}>setCounter</button>
      </>
  )
}

function App() {
  let [number,setNumber] = useState(0);
  function alertNumber(){
    setTimeout(()=>{
      // alert 只能获取到点击按钮时的那个状态
      alert(number);
    },3000);
  }
  return (
      <>
          <p>{number}</p>
          <button onClick={()=>setNumber(number+1)}>+</button>
          <button onClick={alertNumber}>alertNumber</button>
          <Counter5 number={1} />
      </>
  )
}

export default App