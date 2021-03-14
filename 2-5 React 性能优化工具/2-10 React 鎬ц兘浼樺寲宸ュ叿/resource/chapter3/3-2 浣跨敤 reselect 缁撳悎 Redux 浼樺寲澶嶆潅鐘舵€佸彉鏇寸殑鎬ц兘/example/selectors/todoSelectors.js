import { createSelector } from 'reselect'
import { VisibilityFilters } from '../actions'

const getFilter = (state) =>
  state.visibilityFilter

const getTodos = (state) =>
  state.todos

const getVisibleTodos = createSelector(
  [ getFilter, getTodos ],
  (filter, todos) => {
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
)

export default getVisibleTodos