import uuid from '../util/uuid'

const initTodos = []

for (let i = 0; i < 50; i++) {
  if (i % 2 === 0) {
    initTodos.push({
      id: uuid(),
      text: `事项${i}`,
      completed: true
    })
  } else {
    initTodos.push({
      id: uuid(),
      text: `事项${i}`,
      completed: false
    })
  }
}

const todos = (state = initTodos, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        {
          id: action.id,
          text: action.text,
          completed: false
        },
        ...state,
      ]
    case 'TOGGLE_TODO':
      return state.map(todo =>
        (todo.id === action.id)
          ? {...todo, completed: !todo.completed}
          : todo
      )
    default:
      return state
  }
}

export default todos