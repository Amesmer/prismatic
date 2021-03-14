import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'
import { VisibilityFilters } from '../actions'
import getVisibleTodosSelector from '../selectors/todoSelectors'

function getVisibleTodos (todos, filter) {
  console.log('exec')
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos.map(item => {
        let result = 0
        for (let i = 0; i < 10; i++) {
          console.log(i)
          result = item
        }
        return result
      })
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const mapStateToProps = (state) => {
  return {
  //  todos: getVisibleTodos(state.todos, state.visibilityFilter),
   todos: getVisibleTodosSelector(state),
   mark: state.mark,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleTodo: id => dispatch(toggleTodo(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)