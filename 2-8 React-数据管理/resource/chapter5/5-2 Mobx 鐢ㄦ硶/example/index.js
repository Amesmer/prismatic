import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import Counter from './container/Counter'
import stores from './store'


// 1. 创建 store
// mobx 的 store 不是唯一的，通常是多个
// mobx 中 action 通常定义在  store 中

// 2. 使用 Provider 注入 store

// 3. 连接 store
// mobx 不需要连接，只需要将组件定义成可观察组件

// 4. 拿到 store 中的数据
ReactDOM.render(
  <Provider {...stores}>
	  <Counter />
  </Provider>,
	document.getElementById('root')
)