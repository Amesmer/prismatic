import React from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { changeAAction, changeBAction, changeCAction, switchDAction  } from '../../actions'

// 这个计算的过程放在哪里处理？

// 1. 放在组件内计算
// 问题： 当组件的自身属性 ownProps 或者 setState 的时候，这个计算的过程会重新执行，浪费性能
function compute(a, b, c) {
  // 假定这个计算的过程非常复杂
  console.log('exec')
  return a*b*c
}

// 2. 放在 reducer 中计算
// 问题：reducer 函数会变成非常复杂，当我们没更新一个状态值，都得维护与这个公式相关的值，会导致结果不正确
class App extends React.Component {
  render() {
      const { a, b, c, d,cubic } = this.props
      const { changeA, changeB, changeC, switchD } = this.props
      console.log(d, cubic)
      return (
        <div>
          长：<input type="text" value={a} onChange={changeA} />
          宽：<input type="text" value={b} onChange={changeB} />
          高：<input type="text" value={c} onChange={changeC} />
          {/* <h1>{`${a} x ${b} x ${c} = ${compute(a, b, c)}`}</h1> */}
          <h1>{`${a} x ${b} x ${c} = ${cubic}`}</h1>
          <button onClick={switchD}>Switch</button>
        </div>
      )
  }
}

// 3. 放在 mapStateToProps 中计算
// 问题：不管 store 中任意其他的状态改变是，都会触发无效计算

// 结论：不管将计算放在 组件内 还是 mapStateToProps 中，都无法避免性能瓶颈

// 解决方案：精准控制计算 -> 我们需要告诉程序：只有 a, b, c 变化的时候，才会触发计算
// const mapStateToProps = state => ({
//   ...state.cubic,
//   cubic: compute(state.cubic.a, state.cubic.b, state.cubic.c)
// })

// let memoize = null

// const mapStateToProps = state => {
//   const { a, b, c }  = state.cubic
//   if (!memoize) {
//     // 初始化的时候并且没有缓存，就直接计算结果
//     memoize = {
//       a,
//       b,
//       c,
//       cubic: compute(a, b, c)
//     }
//   } else {
//       // 对比 prev 和 current 
//       // 如果 a, b, c 不相等，就重新计算
//       if (!(a === memoize.a && b === memoize.b  && c === memoize.c )) {
//         memoize = {
//           a,
//           b,
//           c,
//           cubic: compute(a, b, c)
//         }
//       }
//     }
//     return {
//       ...state.cubic,
//       ...memoize
//     }
//   }

const aSelector = state => state.a
const bSelector = state => state.b
const cSelector = state => state.c

const cubicSelector = createSelector(
  [aSelector, bSelector, cSelector],
  (a, b, c) => compute(a, b, c)
)

const mapStateToProps = state => {
  return {
    ...state.cubic,
    cubic: cubicSelector(state.cubic)
  }
}

const mapDispatchToProps = (dispatch) => ({
  changeA: (e) => {
    dispatch(changeAAction(e.currentTarget.value))
  },
  changeB: (e) => {
    dispatch(changeBAction(e.currentTarget.value))
  },
  changeC: (e) => {
    dispatch(changeCAction(e.currentTarget.value))
  },
  switchD: () => {
    dispatch(switchDAction())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(App)