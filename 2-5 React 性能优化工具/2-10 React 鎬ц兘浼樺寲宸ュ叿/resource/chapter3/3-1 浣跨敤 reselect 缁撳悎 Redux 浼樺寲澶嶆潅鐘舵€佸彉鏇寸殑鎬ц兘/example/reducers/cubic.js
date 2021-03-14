const initState = {
  a: 1,
  b: 2,
  c: 3,
  d: false,
}

// function compute(a, b, c) {
//   // 假定这个计算的过程非常复杂
//   return a*b*c
// }

const cubic = (state = initState, action) => {
  switch (action.type) {
    case 'CHANGEA':
      return {
        ...state,
        a: action.value,
        // cubic: compute(action.value, state.b, state.c)
    }
    case 'CHANGEB':
      return {
        ...state,
        b: action.value,
        // cubic: compute(state.a, action.value, state.c)
    }
    case 'CHANGEC':
      return {
        ...state,
        c: action.value,
        // cubic: compute(state.a, state.b, action.value)
    }
    case 'SWITCHD':
      return {
        ...state,
        d: !state.d,
    }
    default:
      return {
        ...state,
        // cubic: compute(state.a, state.b, state.c)
      }
  }
}

export default cubic