import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import mark from './mark'

export default combineReducers({
  todos,
  visibilityFilter,
  mark,
})